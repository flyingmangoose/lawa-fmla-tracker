/* ============================================================
   In-memory seed data. No backend, no DB — resets on refresh.
   LAWA-flavored names/roles. The collections below connect so the
   lifecycle walks end to end: roster -> intake -> case -> docs ->
   letters -> accommodation -> events (audit) -> return to work.
   ============================================================ */
import { fmt, TODAY } from "../lib/format";

export const LEAVE_OPTIONS = ["FMLA", "CFRA", "PDL (CA)", "FMLA (Military Caregiver — 26 wk)"];

/* ---- leave cases (the existing six + lifecycle fields) ----
   New fields per case: manager, personalEmail (leave comms go to a
   PERSONAL email), leaveThrough (authorized-through date) and lastDoc
   (date of newest documentation) which drive follow-up automation. */
export const CASES = [
  {
    id: "FM-2026-0148", name: "Maria Delgado", role: "Operations Coordinator", dept: "Airfield Ops",
    manager: "Janet Cole", personalEmail: "maria.delgado.home@gmail.com",
    reason: "Pregnancy disability → Baby bonding", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-03-02", leaveThrough: "2026-06-18", lastDoc: "2026-03-01",
    leaves: ["PDL (CA)", "FMLA", "CFRA"],
    flag: null,
    cert: { state: "Sufficient", note: "Provider cert complete; EDD note on file" },
    stack: true,
    summary: "Pregnancy disability leave under California PDL (up to 4 months) running concurrent with FMLA. CFRA bonding (12 wks) reserved to begin after disability ends — does NOT run concurrent with PDL.",
    used: { fmla: 8.0, cfra: 0, pdl: 9.5 }, nextDeadline: { what: "PDL → CFRA transition designation", when: "2026-06-18" }
  },
  {
    id: "FM-2026-0151", name: "James Okafor", role: "Airport Police Officer", dept: "Public Safety",
    manager: "Lt. Ray Mosely", personalEmail: "j.okafor.personal@gmail.com",
    reason: "Own serious health condition (surgery + recovery)", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-04-21", leaveThrough: "2026-07-10", lastDoc: "2026-04-19",
    leaves: ["FMLA", "CFRA"], flag: null,
    cert: { state: "Sufficient", note: "WH-380-E complete" },
    summary: "Continuous block leave for surgical recovery. FMLA and CFRA running concurrently.",
    used: { fmla: 5.5, cfra: 5.5, pdl: 0 }, nextDeadline: { what: "Recertification request window", when: "2026-07-10" }
  },
  {
    id: "FM-2026-0142", name: "Linda Tran", role: "Maintenance Worker II", dept: "Facilities",
    manager: "Karen Walsh", personalEmail: "ltran.personal@gmail.com",
    reason: "Own serious health condition (chronic migraine)", type: "Intermittent", status: "Active",
    statusTag: "t-green", opened: "2026-02-11", leaveThrough: "2026-05-29", lastDoc: "2026-02-11",
    leaves: ["FMLA", "CFRA"],
    flag: { tag: "t-amber", text: "AI flagged: intermittent absences cluster on Fridays/Mondays (7 of last 9). Suggest recertification review." },
    cert: { state: "Sufficient", note: "Frequency: 2–3 episodes/month, up to 1 day each" },
    summary: "Intermittent leave for chronic condition. Hours decrement against the 480-hour FMLA bank per occurrence.",
    used: { fmla: 6.2, cfra: 6.2, pdl: 0 }, nextDeadline: { what: "Recertification (pattern-based) — HR review", when: "2026-06-12" }
  },
  {
    id: "FM-2026-0155", name: "Robert Hayes", role: "Electrician", dept: "Facilities",
    manager: "Karen Walsh", personalEmail: "rhayes.home@outlook.com",
    reason: "Care for spouse with serious health condition", type: "Continuous", status: "Pending cert",
    statusTag: "t-amber", opened: "2026-05-26", leaveThrough: null, lastDoc: "2026-05-25",
    leaves: ["FMLA", "CFRA"],
    flag: { tag: "t-red", text: "AI flagged: certification incomplete — missing probable duration and frequency of care. Cure period clock running." },
    cert: { state: "Insufficient", note: "WH-380-F missing §6 (duration). Return-for-cure letter ready to send." },
    summary: "Family-care leave. Certification returned as insufficient; employee has 7 calendar days to cure before provisional designation lapses.",
    used: { fmla: 0, cfra: 0, pdl: 0 }, nextDeadline: { what: "Cure deadline (insufficient cert)", when: "2026-06-09" }
  },
  {
    id: "FM-2026-0133", name: "Aisha Bennett", role: "Administrative Analyst", dept: "HR Shared Svcs",
    manager: "Dolores Kim", personalEmail: "aisha.bennett.personal@gmail.com",
    reason: "Military caregiver leave (covered servicemember)", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-01-15", leaveThrough: "2026-06-20", lastDoc: "2026-01-14",
    leaves: ["FMLA (Military Caregiver — 26 wk)"], flag: null,
    cert: { state: "Sufficient", note: "Certification of serious injury/illness on file" },
    summary: "Military caregiver leave carries a 26-workweek entitlement in a single 12-month period — distinct from the standard 12-week bank.",
    used: { fmla: 14.0, cfra: 0, pdl: 0 }, mcgw: true,
    nextDeadline: { what: "Mid-leave status check-in", when: "2026-06-20" }
  },
  {
    id: "FM-2026-0156", name: "Carlos Mendez", role: "Custodian", dept: "Facilities",
    manager: "Karen Walsh", personalEmail: "carlos.mendez.home@gmail.com",
    reason: "Bonding with new child", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-05-12", leaveThrough: "2026-08-01", lastDoc: "2026-05-10",
    leaves: ["FMLA", "CFRA"], flag: null,
    cert: { state: "Not required", note: "Bonding leave — no medical cert required" },
    summary: "Block bonding leave. FMLA and CFRA run concurrently for bonding when both apply to the same parent.",
    used: { fmla: 3.0, cfra: 3.0, pdl: 0 }, nextDeadline: { what: "Bonding leave must conclude within 12 mo of birth", when: "2027-04-30" }
  },
  {
    id: "FM-2026-0119", name: "Dawn Pierce", role: "Customer Service Rep", dept: "Guest Experience",
    manager: "Priya Shah", personalEmail: "dawn.pierce.personal@gmail.com",
    reason: "Own serious health condition", type: "Continuous", status: "Exhausting",
    statusTag: "t-red", opened: "2025-12-08", leaveThrough: "2026-06-23", lastDoc: "2026-05-20",
    leaves: ["FMLA", "CFRA"],
    flag: { tag: "t-red", text: "AI flagged: FMLA/CFRA entitlement nearly exhausted. Begin ADA interactive-process review before leave expires." },
    cert: { state: "Sufficient", note: "Cert current" },
    summary: "Entitlement nearly exhausted. Decision point: ADA reasonable-accommodation interactive process. AI surfaces the trigger; HR + counsel decide next steps.",
    used: { fmla: 11.4, cfra: 11.4, pdl: 0 }, nextDeadline: { what: "Entitlement exhaustion / RTW or ADA review", when: "2026-06-23" }
  },
];

export const PENDING_ELIG = [
  { name: "Devon Wallace", role: "Ramp Agent", hours: 1208, months: 11, note: "Crosses 1,250 hrs in ~3 weeks" },
  { name: "Priya Nair", role: "Budget Analyst", hours: 1190, months: 14, note: "Hours OK at next pay period" },
];

/* ---- roster (drives manager view + intake self-registration match) ---- */
export const EMPLOYEES = [
  { id: "1148-LAWA", name: "Maria Delgado", role: "Operations Coordinator", dept: "Airfield Ops", manager: "Janet Cole", caseId: "FM-2026-0148" },
  { id: "1151-LAWA", name: "James Okafor", role: "Airport Police Officer", dept: "Public Safety", manager: "Lt. Ray Mosely", caseId: "FM-2026-0151" },
  { id: "1142-LAWA", name: "Linda Tran", role: "Maintenance Worker II", dept: "Facilities", manager: "Karen Walsh", caseId: "FM-2026-0142" },
  { id: "1155-LAWA", name: "Robert Hayes", role: "Electrician", dept: "Facilities", manager: "Karen Walsh", caseId: "FM-2026-0155" },
  { id: "1156-LAWA", name: "Carlos Mendez", role: "Custodian", dept: "Facilities", manager: "Karen Walsh", caseId: "FM-2026-0156" },
  { id: "1190-LAWA", name: "Sandra Ruiz", role: "Maintenance Worker I", dept: "Facilities", manager: "Karen Walsh", caseId: null },
  { id: "1133-LAWA", name: "Aisha Bennett", role: "Administrative Analyst", dept: "HR Shared Svcs", manager: "Dolores Kim", caseId: "FM-2026-0133" },
  { id: "1119-LAWA", name: "Dawn Pierce", role: "Customer Service Rep", dept: "Guest Experience", manager: "Priya Shah", caseId: "FM-2026-0119" },
];

/* the manager persona is scoped to one front-line manager for the demo */
export const MANAGER = { name: "Karen Walsh", title: "Facilities Manager", dept: "Facilities" };

/* ---- intake queue: new applications submitted from the employee front door ---- */
export const INTAKE = [
  {
    id: "IN-2026-031", name: "Sofia Ramirez", role: "Guest Services Agent", dept: "Guest Experience",
    kind: "leave", reason: "Own serious health condition (knee surgery + recovery)", leaveType: "Continuous",
    personalEmail: "sofia.ramirez.home@gmail.com", docs: ["WH-380-E_provider.pdf"],
    submitted: "2026-06-03", clockDays: 5, status: "New",
  },
  {
    id: "IN-2026-032", name: "Derek Cole", role: "Ramp Agent", dept: "Airfield Ops",
    kind: "accommodation", reason: "Lower-back strain — requesting temporary light / modified duty", leaveType: "—",
    personalEmail: "derekcole88@outlook.com", docs: ["Provider_note.pdf"],
    submitted: "2026-06-04", clockDays: 5, status: "New",
  },
];

/* ---- reasonable accommodation / light-duty (MOST RESTRICTED visibility) ---- */
export const ACCOMMODATIONS = [
  {
    id: "RA-2026-014", name: "Marcus Reyes", role: "Baggage Service Agent", dept: "Facilities",
    kind: "Reasonable accommodation", request: "Ergonomic workstation and a 20-lb lifting restriction",
    status: "Granted", accommodation: "Sit/stand workstation installed; 20-lb lifting limit",
    startDate: "2026-04-01", reviewDate: "2026-07-01", linkedCaseId: null, confidential: true,
  },
  {
    id: "LD-2026-009", name: "James Okafor", role: "Airport Police Officer", dept: "Public Safety",
    kind: "Light / modified duty", request: "Administrative desk duty on return from surgery",
    status: "Pending", accommodation: "Proposed: 4 weeks administrative desk assignment on return",
    startDate: null, reviewDate: "2026-07-08", linkedCaseId: "FM-2026-0151", confidential: true,
  },
  {
    id: "RA-2026-016", name: "Dawn Pierce", role: "Customer Service Rep", dept: "Guest Experience",
    kind: "Reasonable accommodation", request: "Reduced schedule as FMLA/CFRA entitlement exhausts",
    status: "In interactive process", accommodation: "To be determined — ADA interactive meeting scheduled",
    startDate: null, reviewDate: "2026-06-23", linkedCaseId: "FM-2026-0119", confidential: true,
  },
];

/* ---- documents (medical = confidential, kept separate from the general file) ---- */
export const DOCUMENTS = [
  { id: "DOC-201", caseId: "FM-2026-0148", name: "Maria Delgado", kind: "WH-380-E + EDD disability note", uploaded: "2026-03-01", confidential: true },
  { id: "DOC-202", caseId: "FM-2026-0151", name: "James Okafor", kind: "WH-380-E (own serious health condition)", uploaded: "2026-04-19", confidential: true },
  { id: "DOC-203", caseId: "FM-2026-0155", name: "Robert Hayes", kind: "WH-380-F (incomplete — §6 missing)", uploaded: "2026-05-25", confidential: true },
  { id: "DOC-204", caseId: "FM-2026-0133", name: "Aisha Bennett", kind: "Certification of serious injury/illness", uploaded: "2026-01-14", confidential: true },
];

/* ---- letters with status (powers Notices + e-signature tracking) ----
   method: Template (deterministic) | AI-drafted (judgment letters).
   esign: routed for DocuSign-style signature. status drives the tag. */
export const LETTERS = [
  { id: "LT-301", caseId: "FM-2026-0148", who: "Maria Delgado", type: "Eligibility Notice (WH-381)", tplKey: "elig", method: "Template", esign: false, status: "Sent", generated: "2026-03-04" },
  { id: "LT-302", caseId: "FM-2026-0148", who: "Maria Delgado", type: "Rights & Responsibilities Notice", tplKey: "rr", method: "Template", esign: false, status: "Sent", generated: "2026-03-04" },
  { id: "LT-303", caseId: "FM-2026-0151", who: "James Okafor", type: "Designation Notice (WH-382)", tplKey: "desig", method: "Template", esign: true, status: "Out for signature", generated: "2026-04-24" },
  { id: "LT-304", caseId: "FM-2026-0155", who: "Robert Hayes", type: "Return-for-Cure Letter", tplKey: "cure", method: "AI-drafted", esign: true, status: "Ready — HR sign-off", generated: "2026-06-05" },
  { id: "LT-305", caseId: "FM-2026-0142", who: "Linda Tran", type: "15-day Follow-up Letter", tplKey: "followup15", method: "AI-drafted", esign: true, status: "Queued", generated: "2026-06-05" },
  { id: "LT-306", caseId: "FM-2026-0133", who: "Aisha Bennett", type: "30-day Follow-up Letter", tplKey: "followup30", method: "AI-drafted", esign: false, status: "Signed", generated: "2026-05-18" },
];

/* ---- audit / events: who did what, when — shown as a timeline on each case ---- */
export const EVENTS = [
  { id: "EV-1", caseId: "FM-2026-0148", when: "2026-03-02", actor: "Maria Delgado (Employee)", action: "Submitted leave request via self-service intake" },
  { id: "EV-2", caseId: "FM-2026-0148", when: "2026-03-04", actor: "A. Bennett (HR)", action: "Eligibility + Rights & Responsibilities notices sent" },
  { id: "EV-3", caseId: "FM-2026-0148", when: "2026-03-06", actor: "A. Bennett (HR)", action: "Certification received and found sufficient" },
  { id: "EV-4", caseId: "FM-2026-0148", when: "2026-03-06", actor: "A. Bennett (HR)", action: "Designated: PDL concurrent with FMLA; CFRA bonding reserved" },
  { id: "EV-5", caseId: "FM-2026-0151", when: "2026-04-21", actor: "James Okafor (Employee)", action: "Submitted leave request (surgery)" },
  { id: "EV-6", caseId: "FM-2026-0151", when: "2026-04-24", actor: "A. Bennett (HR)", action: "Designation notice generated; routed for e-signature" },
  { id: "EV-7", caseId: "FM-2026-0155", when: "2026-05-26", actor: "Robert Hayes (Employee)", action: "Submitted family-care leave request" },
  { id: "EV-8", caseId: "FM-2026-0155", when: "2026-05-27", actor: "AI assist", action: "Parsed WH-380-F; flagged §6 duration + frequency missing" },
  { id: "EV-9", caseId: "FM-2026-0142", when: "2026-05-30", actor: "System (follow-up automation)", action: "Authorization lapsed with no new documentation — 15-day follow-up queued" },
];

/* notices the employee has received, keyed off the existing HR templates */
export const EMP_NOTICES = {
  "FM-2026-0148": [{ key: "elig" }, { key: "rr" }],
  "FM-2026-0151": [{ key: "desig" }],
};

/* deterministic notices fill from templates — no AI, just merge */
export const LETTER_TEMPLATES = {
  elig: {
    title: "Eligibility Notice (WH-381)", who: "Maria Delgado",
    body: `${fmt(TODAY)}

Maria Delgado
Operations Coordinator, Airfield Operations
Employee ID: 1148-LAWA

Re: FMLA Eligibility — Notice of Eligibility and Rights & Responsibilities

Dear Ms. Delgado:

On March 2, 2026, you notified us of your need for leave. This notice informs you of your eligibility status under the Family and Medical Leave Act (FMLA).

You ARE eligible for FMLA leave. As of the date of this notice, our records show you have worked for Los Angeles World Airports for more than 12 months and at least 1,250 hours during the 12 months preceding the start of your leave, and you are employed at a worksite with 50 or more employees within 75 miles.

Because your leave relates to pregnancy disability, your rights may also include California Pregnancy Disability Leave (PDL) and the California Family Rights Act (CFRA). A separate explanation of how these run is enclosed.

If you have questions, contact the Leave Administration team in HR Shared Services.

Sincerely,
HR Shared Services — Leave Administration
Los Angeles World Airports`
  },
  rr: {
    title: "Rights & Responsibilities Notice", who: "Maria Delgado",
    body: `${fmt(TODAY)}

Maria Delgado
Re: Your Rights and Responsibilities Under FMLA, PDL, and CFRA

Dear Ms. Delgado:

This notice explains your responsibilities while on protected leave and what you can expect from Los Angeles World Airports.

Entitlement. You are entitled to up to 12 workweeks of FMLA leave in the applicable 12-month period. Because your need for leave arises from pregnancy disability, California Pregnancy Disability Leave provides up to four months of disability-related leave, which runs concurrently with FMLA. Following the disability period, the California Family Rights Act provides up to an additional 12 workweeks of bonding leave, which does NOT run concurrently with PDL.

Certification. You may be required to furnish medical certification supporting the need for leave. Certification is due within 15 calendar days of this request.

Benefits. Your group health benefits will be maintained during leave on the same terms as if you continued to work.

Restoration. On return, you are entitled to be restored to the same or an equivalent position.

This is an explanation of rights, not a determination on any specific period of leave. Designation decisions are made by HR upon receipt of complete information.

Sincerely,
HR Shared Services — Leave Administration
Los Angeles World Airports`
  },
  desig: {
    title: "Designation Notice (WH-382)", who: "James Okafor",
    body: `${fmt(TODAY)}

James Okafor
Airport Police Officer, Public Safety
Employee ID: 1151-LAWA

Re: FMLA Designation Notice

Dear Officer Okafor:

We have reviewed the certification you submitted in connection with your leave request and find it sufficient.

Your leave beginning April 21, 2026 IS designated as FMLA-qualifying and will be counted against your FMLA entitlement. Your FMLA and CFRA leave will run concurrently. Based on a full-time schedule, your 12-workweek entitlement equals 480 hours.

As of this notice, 5.5 weeks have been used and 6.5 weeks remain in the applicable 12-month period.

You may be required to present a fitness-for-duty certification before returning to work. We will request recertification no more often than permitted under the regulations.

This designation was reviewed and approved by HR Shared Services.

Sincerely,
HR Shared Services — Leave Administration
Los Angeles World Airports`
  },
  rtw: {
    title: "Return-to-Work Confirmation", who: "Employee",
    body: `${fmt(TODAY)}

Re: Return-to-Work Confirmation

Dear Colleague:

This letter confirms the return-to-work arrangements following your approved leave. We are glad to welcome you back.

Reinstatement. You are being restored to the same or an equivalent position with equivalent pay, benefits, and terms of employment.

Fitness for duty. Where your leave was for your own serious health condition, please present the fitness-for-duty certification from your provider on or before your first day back, consistent with the notice provided at the start of your leave.

Accommodation. If your provider has identified any temporary restrictions, HR will coordinate any reasonable accommodation or modified-duty arrangement separately and confidentially.

If anything about your return needs adjustment, contact HR Shared Services — Leave Administration.

Sincerely,
HR Shared Services — Leave Administration
Los Angeles World Airports`
  },
};
