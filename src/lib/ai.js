/* ============================================================
   AI layer — the ONLY place the app calls a model.
   Used for unstructured tasks only: letter drafting and the
   grounded assistant. Every call has a graceful fallback in the
   caller. No API key here; requests go to the existing /api/messages
   proxy. AI never makes a determination — that stays with humans.
   ============================================================ */
import { fmt, TODAY } from "./format";

/* shared call to the Anthropic proxy; returns concatenated text or throws */
export async function callMessages({ task, system, messages, max_tokens = 1000 }) {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, max_tokens, system, messages }),
  });
  if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
  const data = await res.json();
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

/* the cure letter is genuinely drafted by Claude from the parsed (insufficient) cert */
export async function draftCureLetter() {
  const facts = `Employer: Los Angeles World Airports (LAWA). Date: ${fmt(TODAY)}.
Employee: Robert Hayes, Electrician, Facilities, Employee ID 1155-LAWA.
Leave reason: leave to care for spouse with a serious health condition (FMLA / CFRA).
Form submitted: WH-380-F (certification for family member's serious health condition), signed by provider on 2026-05-25.
Certification is INSUFFICIENT. Specifically missing: (1) the probable duration of the condition / how long care will be needed [item 6], and (2) the frequency and duration of care the employee will provide.
Cure period: the employee has 7 calendar days from receipt to provide the missing information. Cure deadline: ${fmt("2026-06-09")}.`;

  return callMessages({
    task: "draft",
    max_tokens: 1000,
    system: "You draft FMLA return-for-cure letters for an HR leave administrator. Write a professional, legally careful business letter that (1) thanks the employee for the submitted certification, (2) states plainly and specifically which required items are missing, (3) explains the 7-calendar-day cure period and the consequence if not cured, and (4) tells them how to submit the missing information. Use a respectful, non-accusatory tone. Do NOT make a final determination on the leave itself — the letter requests information; designation happens later. Output ONLY the letter text (date, recipient, body, signature). No preamble, no markdown, no placeholders left unfilled — use the facts provided. Around 200-240 words.",
    messages: [{ role: "user", content: "Draft the return-for-cure letter using these facts:\n\n" + facts }],
  });
}

/* generic AI letter drafting for judgment letters (follow-up, RTW) with caller fallback */
export async function draftLetter({ kind, facts, words = "200-240 words" }) {
  return callMessages({
    task: "draft",
    max_tokens: 1000,
    system: `You draft ${kind} letters for an HR leave administrator at a public airport employer. Write a professional, legally careful, respectful business letter. State plainly what is needed and the timeframe. Do NOT make a final determination on the leave or any adverse employment action — the letter requests information or confirms a process step; determinations are made by HR. Output ONLY the letter text (date, recipient, body, signature). No preamble, no markdown, no unfilled placeholders — use the facts provided. Around ${words}.`,
    messages: [{ role: "user", content: `Draft the ${kind} letter using these facts:\n\n${facts}` }],
  });
}

/* build a compact grounding context for the HR assistant */
export function buildContext(cases) {
  let s = `LAWA FMLA Tracker — live case data (as of ${fmt(TODAY)}). Entitlements: standard FMLA & CFRA = 12 workweeks (480 hrs full-time); CA PDL = up to 4 months (~17.3 wks) for pregnancy disability and runs concurrent with FMLA but NOT CFRA; CFRA bonding (12 wks) begins after PDL ends; Military Caregiver FMLA = 26 weeks.\n\nCases:\n`;
  cases.forEach((c) => {
    const cap = c.mcgw ? 26 : 12;
    s += `- ${c.name} (${c.id}), ${c.role}, ${c.dept}. Reason: ${c.reason}. Type: ${c.type}. Status: ${c.status}. Leaves: ${c.leaves.join(", ")}. FMLA used: ${c.used.fmla} of ${cap} wks${c.used.pdl ? `; PDL used: ${c.used.pdl} wks (of ~17.3)` : ""}${c.used.cfra ? `; CFRA used: ${c.used.cfra} of 12 wks` : ""}. Cert: ${c.cert.state}. Next deadline: ${c.nextDeadline.what} on ${fmt(c.nextDeadline.when)}.${c.flag ? ` FLAG: ${c.flag.text}` : ""}\n`;
  });
  s += `\nGuardrail: You assist HR staff. You may compute balances, summarize, and surface deadlines and risks, but you must NEVER make or recommend a final leave designation or any adverse employment determination — those are human decisions. If asked to decide, explain the options and say the determination must be made by an HR professional, with counsel where appropriate. Keep answers brief and concrete.`;
  return s;
}

/* employee-scoped grounding for the live assistant */
export function buildEmployeeContext(c) {
  const cap = c.mcgw ? 26 : 12;
  return `You are the LAWA employee leave assistant. You are speaking directly to ${c.name}, ${c.role} in ${c.dept}, about THEIR OWN leave (case ${c.id}). Today is ${fmt(TODAY)}.

Their leave — Reason: ${c.reason}. Type: ${c.type}. Status: ${c.status}. Programs that apply: ${c.leaves.join(", ")}.
Balances — FMLA used ${c.used.fmla} of ${cap} weeks${c.used.pdl ? `; California PDL used ${c.used.pdl} of ~17.3 weeks` : ""}${c.used.cfra ? `; CFRA used ${c.used.cfra} of 12 weeks` : ""}.
Certification: ${c.cert.state}. Next thing on their calendar: ${c.nextDeadline.what} on ${fmt(c.nextDeadline.when)}.
Context: ${c.summary}

Rules you can explain in plain language: FMLA and CFRA each provide up to 12 workweeks (480 hours full-time) of job-protected leave in the applicable 12-month period; group health benefits continue during leave on the same terms; on return the employee is restored to the same or an equivalent position. In California, Pregnancy Disability Leave (PDL) provides up to four months while the employee is disabled by pregnancy or childbirth and runs at the same time as FMLA but NOT CFRA; CFRA bonding (up to 12 weeks) begins after the disability period ends and must be taken within 12 months of the birth or placement. Military caregiver leave under FMLA is up to 26 weeks in a single 12-month period.

How to behave: warm, plain-spoken, reassuring. Explain balances, dates, rights, and what to expect. Help them understand their options for a change of status — extending leave, returning to work, switching schedule, or reporting a birth/placement. You must NEVER approve, deny, or designate leave, and never promise an outcome — those are decisions HR makes. If they ask you to decide, explain the options and tell them HR will review and confirm, and that they can submit the change from the "Request a Change" page. Keep answers short and concrete. Don't give legal advice; for their specific situation, point them to HR Shared Services.`;
}
