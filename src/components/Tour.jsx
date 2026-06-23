import React, { useState, useEffect } from "react";

/* ---------------- guided tour (spotlight overlay) ---------------- */
export const TOUR = [
  { tab: "dash", target: null, title: "Welcome to LAWA Leave & FMLA", body: "A 60-second tour of how HR runs federal FMLA stacked with California CFRA & PDL — with AI assisting and humans making every call. Use Next / Back, ← → keys, or Esc to exit." },
  { tab: "dash", target: "kpis", title: "Compliance at a glance", body: "Live counts of active cases, deadlines inside 14 days, certifications to cure, and employees approaching eligibility — all computed from case data, not hand-tracked." },
  { tab: "dash", target: "ai-flags", title: "AI surfaces, HR decides", body: "The AI flags patterns and risks for review — an absence cluster, an incomplete cert, a nearly-exhausted entitlement. It never makes a designation; that stays with HR." },
  { tab: "cases", target: "cases-table", title: "Stacked leave, tracked", body: "Each case stacks FMLA, CFRA and PDL where they apply. Click any row to open the balance engine, the audit trail, and the designation decision — recorded under the signed-in HR user." },
  { tab: "cases", target: "new-case", title: "Create or import a case", body: "Open a new case from scratch here — or import one by promoting an employee from the Roster tab, which prefills their details." },
  { tab: "roster", target: "roster", title: "Eligibility from a Workday export", body: "No HRIS integration: the 1,250-hour / 12-month test runs on an uploaded payroll export. Hit “Start case” on a row to import that employee into a new case." },
  { tab: "certs", target: "certs", title: "Certification intake", body: "Upload a WH-380; the tool extracts dates, frequency and duration, checks sufficiency, and — if it’s incomplete — drafts a return-for-cure letter for HR to send." },
  { tab: "notices", target: "notices", title: "Letters & e-signature, ready to sign", body: "The required notices pre-fill from case data so statutory deadlines aren’t missed. Mandated forms route for DocuSign-style e-signature — and nothing leaves without an HR signature." },
  { tab: "ai", target: "assistant", title: "A grounded assistant", body: "Ask about balances, deadlines or eligibility and get answers grounded in live case data. Ask it to deny a leave and it hands the decision back to you — that boundary is the design." },
  { tab: "dash", target: "persona", title: "Three doors, one system", body: "Switch personas here — Employee, HR / Leave Admin, Manager. Access changes by role: employees see only their own data, managers see schedule impact but no medical detail, HR sees everything and makes determinations." },
  { tab: "dash", target: "walkthrough", title: "Walk one case end to end", body: "The guided walkthrough steps through a single case from request to return to work — request, review, determination, letters, tracking, follow-up, return. Restart this tour any time from the top bar." },
];

export function Tour({ step, setStep, onClose }) {
  const s = TOUR[step];
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!s || !s.target) { setRect(null); return; }
    const measure = () => {
      const el = document.querySelector(`[data-tour="${s.target}"]`);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    const t1 = setTimeout(() => {
      const el = document.querySelector(`[data-tour="${s.target}"]`);
      if (el) el.scrollIntoView({ block: "nearest" });
      measure();
    }, 160);
    const t2 = setTimeout(measure, 440); // re-measure after the view fade settles
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [step, s]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setStep((p) => Math.min(TOUR.length - 1, p + 1));
      else if (e.key === "ArrowLeft") setStep((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setStep, onClose]);

  if (!s) return null;
  const pad = 8;
  const hole = rect ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null;

  const cardW = 360;
  let card;
  if (hole) {
    const left = Math.min(Math.max(14, hole.left), window.innerWidth - cardW - 14);
    const below = hole.top + hole.height + 14;
    card = (window.innerHeight - below > 220)
      ? { top: below, left }
      : { bottom: window.innerHeight - hole.top + 14, left };
  } else {
    card = { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
  }

  const last = step === TOUR.length - 1;
  return (
    <>
      {hole ? (
        <>
          <div className="tour-catch" />
          <div className="tour-hole" style={hole} />
        </>
      ) : <div className="tour-backdrop" />}
      <div className="tour-card" style={{ width: cardW, ...card }}>
        <div className="tour-step">Step {step + 1} of {TOUR.length}</div>
        <h4>{s.title}</h4>
        <p>{s.body}</p>
        <div className="tour-actions">
          <button className="tour-skip" onClick={onClose}>Skip tour</button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 0 && <button className="fm-btn ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setStep((p) => p - 1)}>Back</button>}
            <button className="fm-btn brass" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => (last ? onClose() : setStep((p) => p + 1))}>{last ? "Done" : "Next"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
