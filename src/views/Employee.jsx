import React, { useState, useEffect, useRef } from "react";
import { Tag, StatBar, LetterModal } from "../components/ui";
import { fmt, addDays, daysFromToday, initials, isPendingReq, reqStatusTag, TODAY } from "../lib/format";
import { callMessages, buildEmployeeContext } from "../lib/ai";
import { LETTER_TEMPLATES, EMP_NOTICES } from "../data/seed";

/* which changes of status this employee can submit — gated by their leave */
function changeTypesFor(c) {
  const bonding = c.stack || /bond|pregnan|baby|child|adopt|placement/i.test(c.reason);
  const t = [];
  if (bonding)
    t.push({ key: "lifeEvent", icon: "⊕", title: "Report a birth, placement, or adoption", blurb: "Tell us your child has arrived so HR can move your leave from pregnancy disability to bonding." });
  if (c.type === "Intermittent")
    t.push({ key: "absence", icon: "⏱", title: "Report an intermittent absence", blurb: "Log time used for a qualifying episode. Hours draw down your 12-week (480-hour) bank." });
  t.push({ key: "extend", icon: "⤺", title: "Request to extend my leave", blurb: "Ask for additional time. An updated medical certification is usually required." });
  if (c.type !== "Intermittent")
    t.push({ key: "schedule", icon: "⇄", title: "Change my leave schedule", blurb: "Move between continuous and intermittent / reduced-schedule leave when it's medically needed." });
  t.push({ key: "rtw", icon: "➜", title: "Plan my return to work", blurb: "Share your intended return date. A fitness-for-duty note may be required first." });
  t.push({ key: "contact", icon: "✎", title: "Update my contact information", blurb: "Keep your phone, email, and address current so notices reach you." });
  return t;
}

/* the employee's leave journey, drawn from their case */
function planFor(c) {
  const items = [{ state: "done", h: "Leave opened", d: fmt(c.opened) }];
  if (c.used.pdl > 0) {
    items.push({ state: "now", h: "Pregnancy disability leave (CA PDL)", d: `Up to ~17.3 weeks while you're disabled · ${c.used.pdl} used` });
    items.push({ state: "future", h: "Transition to CFRA bonding", d: `Begins once your provider clears you · target ${fmt(c.nextDeadline.when)}` });
    items.push({ state: "future", h: "CFRA bonding leave", d: "Up to 12 weeks · must finish within 12 months of the birth" });
  } else {
    items.push({ state: "now", h: `${c.type} leave in progress`, d: `${c.used.fmla} of ${c.mcgw ? 26 : 12} weeks used` });
    items.push({ state: "future", h: c.nextDeadline.what, d: fmt(c.nextDeadline.when) });
  }
  items.push({ state: "future", h: "Return to work", d: "Restored to the same or an equivalent position" });
  return items;
}

/* concrete to-dos for the employee, derived from their case */
function todosFor(c, myReqs) {
  const t = [];
  if (c.cert.state === "Insufficient")
    t.push({ tone: "t-red", what: "Your certification is missing required details. Submit the missing information before the cure deadline.", when: c.nextDeadline.when });
  else if (c.cert.state === "Pending")
    t.push({ tone: "t-amber", what: "Return your medical certification (WH-380) so HR can complete its review.", when: c.nextDeadline.when });
  const dd = daysFromToday(c.nextDeadline.when);
  if (c.cert.state !== "Insufficient" && c.cert.state !== "Pending" && dd <= 21)
    t.push({ tone: dd <= 7 ? "t-red" : "t-amber", what: c.nextDeadline.what, when: c.nextDeadline.when });
  if (!myReqs.length)
    t.push({ tone: "t-blue", what: "Need to change something — extend, return, or report a birth? Use “Request a Change.”", when: null });
  return t;
}

function EmpHome({ c, myReqs, go }) {
  const cap = c.mcgw ? 26 : 12;
  const remaining = (cap - c.used.fmla).toFixed(1);
  const todos = todosFor(c, myReqs);
  const plan = planFor(c);
  return (
    <div className="fade">
      <div className="emp-hero">
        <div className="emp-heads">
          <div className="emp-ava">{initials(c.name)}</div>
          <div>
            <h2>Hi, {c.name.split(" ")[0]}</h2>
            <div className="sub2">{c.role} · {c.dept}<br />Your leave is <strong style={{ color: "#fff" }}>{c.status.toLowerCase()}</strong> — case <span className="fm-mono">{c.id}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {c.leaves.map((l) => <Tag key={l} c="t-blue">{l}</Tag>)}
        </div>
      </div>

      <div className="fm-grid g3" style={{ marginBottom: 22 }}>
        <div className="fm-card fm-kpi"><div className="n">{remaining}</div><div className="l">Weeks remaining</div><div className="d" style={{ color: "var(--muted)" }}>of {cap} protected weeks</div></div>
        <div className="fm-card fm-kpi"><div className="n" style={{ fontSize: 30, lineHeight: 1.15, paddingTop: 6 }}>{fmt(c.nextDeadline.when)}</div><div className="l">{c.nextDeadline.what}</div><div className="d" style={{ color: daysFromToday(c.nextDeadline.when) <= 7 ? "var(--red)" : "var(--amber)" }}>{daysFromToday(c.nextDeadline.when)} days away</div></div>
        <div className="fm-card fm-kpi"><div className="n" style={{ fontSize: 30, lineHeight: 1.15, paddingTop: 6 }}>{c.cert.state}</div><div className="l">Certification</div><div className="d" style={{ color: c.cert.state === "Sufficient" || c.cert.state === "Not required" ? "var(--green)" : "var(--red)" }}>{c.cert.state === "Sufficient" || c.cert.state === "Not required" ? "Nothing needed from you" : "Action needed"}</div></div>
      </div>

      <div className="fm-grid g2">
        <div>
          <div className="fm-card" style={{ marginBottom: 20 }}>
            <div className="fm-sec-h"><h3>What you need to do</h3></div>
            {todos.length ? todos.map((t, i) => (
              <div className="todo" key={i}>
                <div className={`tk fm-tag ${t.tone}`} style={{ borderRadius: 7 }}>{t.tone === "t-red" ? "!" : t.tone === "t-blue" ? "◆" : "•"}</div>
                <div style={{ fontSize: 15, lineHeight: 1.5 }}>{t.what}{t.when && <div className="fm-mono" style={{ fontSize: 13.4, color: "var(--muted)", marginTop: 3 }}>By {fmt(t.when)}</div>}</div>
              </div>
            )) : <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>You're all caught up — nothing needs your attention right now.</p>}
            <button className="fm-btn brass" style={{ marginTop: 6 }} onClick={() => go("request")}>Request a change of status →</button>
          </div>

          <div className="fm-card">
            <div className="fm-sec-h"><h3>Your leave balance</h3><Tag c="t-grey">Live</Tag></div>
            <div style={{ marginBottom: c.used.pdl || c.used.cfra ? 14 : 0 }}>
              <div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>{c.mcgw ? "FMLA — Military Caregiver (26 wk)" : "FMLA (12 wk)"}</div>
              <StatBar used={c.used.fmla} cap={cap} color={c.statusTag === "t-red" ? "var(--red)" : "var(--green)"} />
            </div>
            {c.used.pdl > 0 && <div style={{ marginBottom: 14 }}><div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>CA PDL (up to ~17.3 wk)</div><StatBar used={c.used.pdl} cap={17.3} color="var(--blue)" /></div>}
            {c.used.cfra > 0 && <div><div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>CFRA (12 wk)</div><StatBar used={c.used.cfra} cap={12} color="var(--brass)" /></div>}
            <div className="guard" style={{ marginTop: 14 }}><span>◆</span> Your health benefits continue while you're out, and you're entitled to return to the same or an equivalent job.</div>
          </div>
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }}>
          <div className="fm-sec-h"><h3>Your leave plan</h3></div>
          <div className="tl">
            {plan.map((p, i) => (
              <div key={i} className={`tl-item ${p.state}`}><span className="pt" /><div className="th">{p.h}</div><div className="td">{p.d}</div></div>
            ))}
          </div>
          <p style={{ fontSize: 14.6, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 16, background: "var(--card)", padding: "12px 14px", borderRadius: 9, border: "1px solid var(--line)" }}>{c.summary}</p>
        </div>
      </div>
    </div>
  );
}

/* per-type request form */
function ChangeRequestModal({ type, c, onClose, onSubmit }) {
  const today = TODAY;
  const init = {
    lifeEvent: { event: "Birth", eventDate: today },
    absence: { absDate: today, hours: "8", note: "" },
    extend: { returnDate: addDays(today, 30), why: "" },
    schedule: { to: c.type === "Intermittent" ? "Continuous" : "Intermittent", frequency: "" },
    rtw: { returnDate: addDays(today, 14), accommodation: "" },
    contact: { phone: "", email: "", address: "" },
  }[type.key];
  const [f, setF] = useState(init);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const meta = {
    lifeEvent: { note: "Reporting your child's arrival lets HR move you from pregnancy disability leave (PDL) to CFRA bonding leave — up to 12 weeks, to be taken within 12 months of the birth. HR will issue an updated designation notice.", valid: !!f.eventDate },
    absence: { note: "Each reported episode draws hours from your 480-hour FMLA bank once HR confirms it. Reporting promptly keeps your record accurate and protects the absence.", valid: !!f.absDate && Number(f.hours) > 0 },
    extend: { note: "Extensions beyond your current entitlement are reviewed by HR and usually need an updated medical certification. If your protected leave is exhausted, HR may explore other options with you, such as an ADA accommodation.", valid: !!f.returnDate },
    schedule: { note: "Intermittent or reduced-schedule leave is available when it's medically necessary. HR will request a certification describing the expected frequency and duration before confirming the change.", valid: true },
    rtw: { note: "For your own serious health condition, HR may require a fitness-for-duty certification before you return. You're entitled to be restored to the same or an equivalent position.", valid: !!f.returnDate },
    contact: { note: "We use this to send your eligibility, rights, and designation notices. Updating it here doesn't change your leave — it just keeps your file current.", valid: !!(f.phone || f.email || f.address) },
  }[type.key];

  const summarize = () => ({
    lifeEvent: `${f.event} reported, event date ${fmt(f.eventDate)} — requesting transition to CFRA bonding leave.`,
    absence: `Intermittent absence on ${fmt(f.absDate)}, ${f.hours} hour(s)${f.note ? ` — ${f.note}` : ""}.`,
    extend: `Requesting to extend leave; intended return ${fmt(f.returnDate)}${f.why ? ` — ${f.why}` : ""}.`,
    schedule: `Requesting change to ${f.to} leave${f.frequency ? ` — proposed frequency: ${f.frequency}` : ""}.`,
    rtw: `Planning return to work on ${fmt(f.returnDate)}${f.accommodation ? ` — accommodation note: ${f.accommodation}` : ""}.`,
    contact: `Updated contact details: ${[f.phone && `phone ${f.phone}`, f.email && `email ${f.email}`, f.address && `address ${f.address}`].filter(Boolean).join("; ")}.`,
  }[type.key]);

  const submit = () => meta.valid && onSubmit({ caseId: c.id, empName: c.name, type: type.key, title: type.title, detail: summarize() });

  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" style={{ width: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="lt-head"><h4>{type.title}</h4><button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button></div>
        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>
          <div className="fm-form">
            {type.key === "lifeEvent" && <>
              <label className="fm-field"><span>Event</span><select value={f.event} onChange={(e) => set("event", e.target.value)}><option>Birth</option><option>Adoption</option><option>Foster placement</option></select></label>
              <label className="fm-field"><span>Event date</span><input type="date" value={f.eventDate} onChange={(e) => set("eventDate", e.target.value)} /></label>
            </>}
            {type.key === "absence" && <>
              <label className="fm-field"><span>Absence date</span><input type="date" value={f.absDate} onChange={(e) => set("absDate", e.target.value)} /></label>
              <label className="fm-field"><span>Hours used</span><input type="number" min="1" max="12" value={f.hours} onChange={(e) => set("hours", e.target.value)} /></label>
              <label className="fm-field fm-col2"><span>Note <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></span><input value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="e.g. migraine episode, left mid-shift" /></label>
            </>}
            {type.key === "extend" && <>
              <label className="fm-field"><span>New intended return date</span><input type="date" value={f.returnDate} onChange={(e) => set("returnDate", e.target.value)} /></label>
              <label className="fm-field fm-col2"><span>Reason for the extension</span><input value={f.why} onChange={(e) => set("why", e.target.value)} placeholder="e.g. provider extended recovery by 3 weeks" /></label>
            </>}
            {type.key === "schedule" && <>
              <label className="fm-field"><span>Change to</span><select value={f.to} onChange={(e) => set("to", e.target.value)}><option>Intermittent</option><option>Reduced schedule</option><option>Continuous</option></select></label>
              <label className="fm-field fm-col2"><span>Expected frequency / duration</span><input value={f.frequency} onChange={(e) => set("frequency", e.target.value)} placeholder="e.g. about 2 days per month, up to 1 day each" /></label>
            </>}
            {type.key === "rtw" && <>
              <label className="fm-field"><span>Intended return date</span><input type="date" value={f.returnDate} onChange={(e) => set("returnDate", e.target.value)} /></label>
              <label className="fm-field fm-col2"><span>Any accommodation you'll need <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></span><input value={f.accommodation} onChange={(e) => set("accommodation", e.target.value)} placeholder="e.g. lifting restriction for first 2 weeks" /></label>
            </>}
            {type.key === "contact" && <>
              <label className="fm-field"><span>Phone</span><input value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(###) ###-####" /></label>
              <label className="fm-field"><span>Email</span><input value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="name@example.com" /></label>
              <label className="fm-field fm-col2"><span>Mailing address</span><input value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, city, state, ZIP" /></label>
            </>}
          </div>
          <div className="guard" style={{ marginTop: 18 }}><span>◆</span> {meta.note}</div>
        </div>
        <div className="lt-foot">
          <span className="lt-gen">◆ Goes to HR Shared Services for review · you'll see the status here</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13 }} onClick={onClose}>Cancel</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} disabled={!meta.valid} onClick={submit}>Submit to HR</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmpRequest({ c, myReqs, onSubmit }) {
  const [active, setActive] = useState(null);
  const types = changeTypesFor(c);
  return (
    <div className="fade">
      <h2 className="fm-h">Request a change of status</h2>
      <p className="fm-sub">Tell HR what's changing — a birth, a longer recovery, a return date. You submit the request; HR reviews it and confirms the designation.</p>

      <div className="req-grid" style={{ marginBottom: 22 }}>
        {types.map((t) => (
          <button key={t.key} className="req-card" onClick={() => setActive(t)}>
            <span className="ri">{t.icon}</span>
            <span><h4>{t.title}</h4><p>{t.blurb}</p></span>
          </button>
        ))}
      </div>

      <div className="fm-card">
        <div className="fm-sec-h"><h3>Your requests</h3><Tag c="t-grey">{myReqs.length} submitted</Tag></div>
        {myReqs.length ? (
          <div>
            {myReqs.map((r) => (
              <div className="req-row" key={r.id}>
                <div>
                  <div className="emp">{r.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{r.detail}</div>
                  <div className="fm-mono" style={{ fontSize: 13, color: "var(--muted-2)", marginTop: 3 }}>{r.id} · submitted {fmt(r.submitted)}{r.decidedOn ? ` · decided ${fmt(r.decidedOn)}` : ""}</div>
                  {r.note && <div style={{ fontSize: 13.6, color: "var(--ink-2)", marginTop: 4, fontStyle: "italic" }}>HR note: {r.note}</div>}
                </div>
                <Tag c={reqStatusTag(r.status)}>{r.status}</Tag>
              </div>
            ))}
          </div>
        ) : <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>You haven't submitted any requests yet. Pick a change above to get started.</p>}
        <div className="guard" style={{ marginTop: 16 }}><span>◆</span> Submitting a request never changes your leave on its own. HR reviews every request and makes the official designation — the AI here only helps you understand your options.</div>
      </div>

      {active && <ChangeRequestModal type={active} c={c} onClose={() => setActive(null)} onSubmit={(r) => { onSubmit(r); setActive(null); }} />}
    </div>
  );
}

function EmpTime({ c, myReqs, onSubmit }) {
  const [open, setOpen] = useState(false);
  const absences = myReqs.filter((r) => r.type === "absence");
  const pendingHrs = absences.filter(isPendingReq).reduce((s, r) => s + (parseFloat((r.detail.match(/, ([\d.]+) hour/) || [])[1]) || 0), 0);
  const absType = changeTypesFor(c).find((t) => t.key === "absence");
  return (
    <div className="fade">
      <h2 className="fm-h">Report time</h2>
      <p className="fm-sub">Your leave is intermittent — log each qualifying absence so it's protected and counted correctly against your bank.</p>

      <div className="fm-grid g3" style={{ marginBottom: 20 }}>
        <div className="fm-card fm-kpi"><div className="n">{c.used.fmla}</div><div className="l">Weeks used (confirmed)</div><div className="d" style={{ color: "var(--muted)" }}>of 12 · HR-confirmed</div></div>
        <div className="fm-card fm-kpi"><div className="n">{absences.length}</div><div className="l">Absences you've reported</div><div className="d" style={{ color: "var(--amber)" }}>{pendingHrs} hrs awaiting HR confirmation</div></div>
        <div className="fm-card fm-kpi"><div className="n">{(12 - c.used.fmla).toFixed(1)}</div><div className="l">Weeks remaining</div><div className="d" style={{ color: "var(--green)" }}>protected time left</div></div>
      </div>

      <div className="fm-card">
        <div className="fm-sec-h"><h3>Reported absences</h3>{absType && <button className="fm-btn brass" onClick={() => setOpen(true)}>+ Report an absence</button>}</div>
        {absences.length ? (
          <table className="fm-tbl">
            <thead><tr><th>Reported</th><th>Details</th><th>Status</th></tr></thead>
            <tbody>
              {absences.map((r) => (
                <tr key={r.id}><td className="fm-mono">{fmt(r.submitted)}</td><td>{r.detail}</td><td><Tag c={reqStatusTag(r.status)}>{r.status}</Tag></td></tr>
              ))}
            </tbody>
          </table>
        ) : <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: "30px 18px", textAlign: "center", color: "var(--muted)", fontSize: 15.4 }}>No absences reported yet. Use “Report an absence” after a qualifying episode.</div>}
        <div className="guard" style={{ marginTop: 16 }}><span>◆</span> Reported hours are held as pending until HR confirms them against your certification — your official balance only moves on HR's review.</div>
      </div>

      {open && absType && <ChangeRequestModal type={absType} c={c} onClose={() => setOpen(false)} onSubmit={(r) => { onSubmit(r); setOpen(false); }} />}
    </div>
  );
}

function EmpDocuments({ c }) {
  const [letter, setLetter] = useState(null);
  const [certSent, setCertSent] = useState(false);
  const notices = EMP_NOTICES[c.id] || [];
  const open = (key) => { const t = LETTER_TEMPLATES[key]; setLetter({ title: t.title, who: t.who, body: t.body, loading: false, ai: false }); };
  const needsCert = c.cert.state === "Pending" || c.cert.state === "Insufficient";
  return (
    <div className="fade">
      <h2 className="fm-h">My documents</h2>
      <p className="fm-sub">The notices HR has sent you, and the certifications you need to provide. Medical certifications go through a confidential channel, kept separate from your general file.</p>
      <LetterModal letter={letter} onClose={() => setLetter(null)} />

      <div className="fm-grid g2">
        <div className="fm-card">
          <div className="fm-sec-h"><h3>Notices from HR</h3><Tag c="t-grey">{notices.length}</Tag></div>
          {notices.length ? (
            <table className="fm-tbl">
              <thead><tr><th>Notice</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {notices.map((n) => {
                  const t = LETTER_TEMPLATES[n.key];
                  return <tr key={n.key}><td className="emp">{t.title}</td><td><Tag c="t-green">Received</Tag></td><td style={{ textAlign: "right" }}><button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => open(n.key)}>View</button></td></tr>;
                })}
              </tbody>
            </table>
          ) : <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>Your eligibility and designation notices will appear here once HR issues them.</p>}
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }}>
          <div className="fm-sec-h"><h3>Your certification</h3><Tag c={c.cert.state === "Sufficient" ? "t-green" : c.cert.state === "Insufficient" ? "t-red" : "t-grey"}>{c.cert.state}</Tag></div>
          {needsCert ? (
            certSent ? (
              <div className="fm-alert al-blue"><span className="ic">◎</span><div style={{ fontSize: 15.4 }}>Thanks — your certification was received through the confidential channel. HR will review it for completeness and follow up if anything's missing.</div></div>
            ) : (
              <>
                <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: "28px 18px", textAlign: "center", color: "var(--muted)", fontSize: 15.4 }}>Drop your medical certification (WH-380) here</div>
                <button className="fm-btn brass" style={{ marginTop: 12 }} onClick={() => setCertSent(true)}>⤴ Upload certification</button>
                {c.cert.state === "Insufficient" && <div className="fm-alert al-amber" style={{ marginTop: 12 }}><span className="ic">⚑</span><div style={{ fontSize: 15 }}>HR flagged your certification as incomplete{c.cert.note ? ` — ${c.cert.note}` : ""}. Please provide the missing details before the cure deadline on {fmt(c.nextDeadline.when)}.</div></div>}
              </>
            )
          ) : (
            <div className="fm-alert al-blue"><span className="ic">◎</span><div style={{ fontSize: 15.4 }}>{c.cert.state === "Not required" ? "No medical certification is required for this type of leave." : "Your certification is on file and complete — nothing more is needed from you right now."}</div></div>
          )}
          <div className="guard" style={{ marginTop: 14 }}><span>◆</span> Your medical information is processed on a confidential, access-restricted path and kept separate from your general case file.</div>
        </div>
      </div>
    </div>
  );
}

function EmpAssistant({ c }) {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: `Hi ${c.name.split(" ")[0]} — I'm your leave assistant. Ask me anything about your own leave: how much time you have left, what happens to your benefits, or how a change of status works. I'll explain your options, but HR makes every official decision.` },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [msgs, busy]);

  const send = async (q) => {
    const question = (q ?? input).trim();
    if (!question || busy) return;
    const history = [...msgs, { role: "u", text: question }];
    setMsgs(history); setInput(""); setBusy(true);
    try {
      const apiMsgs = history.map((m) => ({ role: m.role === "u" ? "user" : "assistant", content: m.text }));
      const text = await callMessages({ task: "chat", system: buildEmployeeContext(c), messages: apiMsgs });
      setMsgs((m) => [...m, { role: "ai", text: text || "I couldn't generate a response just now." }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", text: "I couldn't reach the assistant just now — in the production build this runs on LAWA's secured Claude tier." }]);
    } finally { setBusy(false); }
  };

  const chips = [
    "How many weeks of leave do I have left?",
    "What happens to my health insurance while I'm out?",
    c.stack ? "How does my disability leave turn into bonding leave?" : "Will I get my same job back when I return?",
    "Can I extend my leave if I need more time?",
  ];
  return (
    <div className="fade">
      <h2 className="fm-h">Ask a question</h2>
      <p className="fm-sub">A private assistant grounded in your own leave details — answers in plain language, any time, without waiting on an HR ticket.</p>
      <div className="chat-wrap">
        <div className="chat-log" ref={logRef}>
          {msgs.map((m, i) => (
            <div className="msg" key={i} style={{ flexDirection: m.role === "u" ? "row-reverse" : "row" }}>
              <div className={`av ${m.role === "u" ? "av-u" : "av-ai"}`}>{m.role === "u" ? initials(c.name) : "◆"}</div>
              <div className={`bub ${m.role === "u" ? "bub-u" : "bub-ai"}`}>{m.text}</div>
            </div>
          ))}
          {busy && <div className="msg"><div className="av av-ai">◆</div><div className="bub bub-ai"><span className="dot" /> <span className="dot" style={{ animationDelay: ".2s" }} /> <span className="dot" style={{ animationDelay: ".4s" }} /></div></div>}
        </div>
        <div style={{ display: "flex", gap: 6, padding: "10px 14px 0", flexWrap: "wrap" }}>
          {chips.map((c2) => <button key={c2} className="chip" onClick={() => send(c2)} disabled={busy}>{c2}</button>)}
        </div>
        <div className="chat-in">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about your leave, benefits, or a change of status…" />
          <button className="fm-btn brass" onClick={() => send()} disabled={busy}>Send</button>
        </div>
      </div>
      <div className="guard" style={{ marginTop: 12 }}><span>◆</span> The assistant explains your rights and options — it will never approve, deny, or designate your leave. Those decisions are always made by HR.</div>
    </div>
  );
}

export function EmployeePortal({ c, eTab, setETab, requests, onSubmit }) {
  const myReqs = requests.filter((r) => r.caseId === c.id);
  if (eTab === "myleave") return <EmpHome c={c} myReqs={myReqs} go={setETab} />;
  if (eTab === "request") return <EmpRequest c={c} myReqs={myReqs} onSubmit={onSubmit} />;
  if (eTab === "time") return <EmpTime c={c} myReqs={myReqs} onSubmit={onSubmit} />;
  if (eTab === "documents") return <EmpDocuments c={c} />;
  if (eTab === "help") return <EmpAssistant c={c} />;
  return <EmpHome c={c} myReqs={myReqs} go={setETab} />;
}

/* nav tabs for the employee portal — adapts to leave type */
export const employeeTabs = (c) => [
  ["myleave", "My Leave"], ["request", "Request a Change"],
  ...(c.type === "Intermittent" ? [["time", "Report Time"]] : []),
  ["documents", "My Documents"], ["help", "Ask a Question"],
];
