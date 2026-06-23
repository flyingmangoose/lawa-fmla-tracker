import React, { useState } from "react";
import { Tag, Guard } from "../components/ui";

const STEPS = [
  { persona: "employee", chip: "Employee", tab: "apply", title: "Request", desc: "An employee files for leave or accommodation from the self-service front door, using a personal email for correspondence. Submitting starts HR's 5-business-day notice clock — no HR ticket required." },
  { persona: "hr", chip: "HR / Leave Admin", tab: "requests", title: "HR review", desc: "The application lands in HR's intake queue. HR opens it, reviews the uploaded documents, and runs the certification sufficiency check before deciding anything." },
  { persona: "hr", chip: "HR / Leave Admin", tab: "cases", id: "FM-2026-0155", title: "Determination", desc: "HR makes the human call in the case drawer — designate the leave type against the balance engine, or hold pending cert. This is where Robert Hayes' insufficient certification triggers a cure letter. AI never designates." },
  { persona: "hr", chip: "HR / Leave Admin", tab: "notices", title: "Letters & e-signature", desc: "Eligibility, rights, designation, cure and follow-up letters generate from case data — templates for routine notices, AI drafting for judgment letters. Mandated forms route for DocuSign-style e-signature, held for HR signature." },
  { persona: "hr", chip: "HR / Leave Admin", tab: "cases", id: "FM-2026-0148", title: "Tracking", desc: "Balances, CFRA/PDL stacking, deadlines and a full audit trail track automatically. Maria Delgado's case shows PDL running concurrent with FMLA and CFRA bonding reserved to follow." },
  { persona: "hr", chip: "HR / Leave Admin", tab: "dash", title: "Follow-up automation", desc: "When a leave's authorized-through date passes with no new documentation, the deterministic check flags HR on the dashboard and queues the correct 15- or 30-day follow-up letter. No one has to watch a spreadsheet." },
  { persona: "hr", chip: "HR / Leave Admin", tab: "rtw", id: "FM-2026-0151", title: "Return to work", desc: "Confirm fitness-for-duty, capture any on-return accommodation, restore to the same or an equivalent role, and close the case. If entitlement is exhausted (Dawn Pierce), the path becomes the ADA interactive process instead." },
  { persona: "hr", chip: "HR / Leave Admin", tab: "payroll", title: "Payroll boundary", desc: "The approved leave's payroll coding hands off to Workday on a scheduled batch — explicitly not a live real-time feed. This completes the lifecycle without overpromising the integration." },
];

export function Walkthrough({ goTo }) {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  return (
    <div className="fade">
      <h2 className="fm-h">Guided walkthrough</h2>
      <p className="fm-sub">One case, end to end — request to return to work. Step through in order, or jump straight into any step. The persona flips automatically so you see each step as the right user.</p>

      <div className="fm-grid g2">
        <div className="wf-rail">
          {STEPS.map((st, idx) => (
            <button key={st.title} className={`wf-step ${idx === i ? "on" : ""}`} onClick={() => setI(idx)}>
              <span className="wn">{idx + 1}</span>
              <span style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <h4>{st.title}</h4><span className="persona-chip">{st.chip}</span>
                </div>
                <p>{st.desc}</p>
              </span>
            </button>
          ))}
        </div>

        <div>
          <div className="fm-card" style={{ background: "var(--paper-2)", position: "sticky", top: 16 }}>
            <div className="fm-sec-h"><h3>Step {i + 1} · {s.title}</h3><span className="persona-chip">{s.chip}</span></div>
            <p style={{ fontSize: 15.4, lineHeight: 1.6, color: "var(--ink-2)" }}>{s.desc}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button className="fm-btn ghost" disabled={i === 0} onClick={() => setI((p) => Math.max(0, p - 1))}>← Back</button>
              <button className="fm-btn brass" onClick={() => goTo(s.persona, s.tab, s.id)}>Open this step →</button>
              <button className="fm-btn ghost" disabled={i === STEPS.length - 1} onClick={() => setI((p) => Math.min(STEPS.length - 1, p + 1))}>Next →</button>
            </div>
            <Guard style={{ marginTop: 18 }}>Throughout: AI assists (parsing, drafting, flagging, computing) and humans decide. Managers see schedule impact only; employees see only their own data; HR sees everything and makes every determination.</Guard>
          </div>
        </div>
      </div>
    </div>
  );
}
