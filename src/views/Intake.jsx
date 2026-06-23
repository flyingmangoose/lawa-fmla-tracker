import React, { useState } from "react";
import { Tag, Stepper, Guard } from "../components/ui";
import { fmt, addDays, TODAY } from "../lib/format";

/* Employee front door: self-registration -> request -> documents -> submit.
   Captures a PERSONAL email for leave communications and starts the intake clock. */
export function Intake({ prefill = {}, onSubmit }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(null);
  const [f, setF] = useState({
    name: prefill.name || "", role: prefill.role || "", dept: prefill.dept || "",
    personalEmail: "", kind: "leave", reason: "", leaveType: "Continuous",
    startDate: addDays(TODAY, 14), docs: [],
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const addDoc = () => set("docs", [...f.docs, f.kind === "leave" ? `WH-380_${f.docs.length + 1}.pdf` : `Provider_note_${f.docs.length + 1}.pdf`]);

  const steps = [{ label: "Register" }, { label: "Your request" }, { label: "Documents" }];
  const okReg = f.name.trim() && f.role.trim() && f.personalEmail.trim();
  const okReq = f.reason.trim();

  const submit = () => {
    const item = {
      name: f.name.trim(), role: f.role.trim(), dept: f.dept.trim() || "—",
      kind: f.kind, reason: f.reason.trim(), leaveType: f.kind === "leave" ? f.leaveType : "—",
      personalEmail: f.personalEmail.trim(), docs: f.docs, clockDays: 5,
    };
    const id = onSubmit(item);
    setDone(id);
  };

  if (done) {
    return (
      <div className="fade">
        <h2 className="fm-h">Request submitted</h2>
        <p className="fm-sub">Your request is now with HR Shared Services.</p>
        <div className="fm-card" style={{ maxWidth: 640 }}>
          <div className="fm-alert al-blue" style={{ marginBottom: 16 }}><span className="ic">◎</span>
            <div style={{ fontSize: 15.6 }}>Thanks, {f.name.split(" ")[0]}. Your {f.kind === "leave" ? "leave" : "accommodation"} request <strong className="fm-mono">{done}</strong> was received. HR's review clock has started — you'll get an eligibility or acknowledgement notice at your personal email within <strong>5 business days</strong>.</div>
          </div>
          <div className="kv"><span className="k">Request</span><span className="v">{f.kind === "leave" ? "Leave (FMLA/CFRA/PDL)" : "Accommodation / modified duty"}</span></div>
          <div className="kv"><span className="k">Comms to</span><span className="v fm-mono" style={{ fontSize: 13.5 }}>{f.personalEmail}</span></div>
          <div className="kv"><span className="k">Documents</span><span className="v">{f.docs.length || 0} uploaded</span></div>
          <div className="kv"><span className="k">Submitted</span><span className="v">{fmt(TODAY)}</span></div>
          <Guard style={{ marginTop: 16 }}>You can track this from “My Leave” once HR opens your case. HR makes every determination — submitting does not approve anything.</Guard>
        </div>
      </div>
    );
  }

  return (
    <div className="fade">
      <h2 className="fm-h">Apply for leave or accommodation</h2>
      <p className="fm-sub">Self-service intake — no HR ticket needed. A few details start your request and the review clock.</p>
      <div className="fm-card" style={{ maxWidth: 720 }}>
        <Stepper steps={steps} current={step} />

        {step === 0 && (
          <div className="fade">
            <div className="fm-form">
              <label className="fm-field"><span>Full name</span><input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" /></label>
              <label className="fm-field"><span>Job title</span><input value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Ramp Agent" /></label>
              <label className="fm-field"><span>Department</span><input value={f.dept} onChange={(e) => set("dept", e.target.value)} placeholder="e.g. Airfield Ops" /></label>
              <label className="fm-field"><span>Personal email <span style={{ color: "var(--red)", fontWeight: 700 }}>(not work email)</span></span><input value={f.personalEmail} onChange={(e) => set("personalEmail", e.target.value)} placeholder="you@personal-email.com" /></label>
            </div>
            <Guard style={{ marginTop: 16 }}>Use a <strong>personal</strong> email. Leave correspondence should reach you even when you're away from work and without going through your manager — so notices go to an address you control.</Guard>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <button className="fm-btn brass" disabled={!okReg} onClick={() => setStep(1)}>Next →</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fade">
            <div className="fm-field" style={{ marginBottom: 14 }}><span>What are you requesting?</span>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button type="button" className={`fm-btn ${f.kind === "leave" ? "brass" : "ghost"}`} onClick={() => set("kind", "leave")}>A leave (FMLA / CFRA / PDL)</button>
                <button type="button" className={`fm-btn ${f.kind === "accommodation" ? "brass" : "ghost"}`} onClick={() => set("kind", "accommodation")}>Accommodation / light duty</button>
              </div>
            </div>
            <div className="fm-form">
              {f.kind === "leave" && <>
                <label className="fm-field"><span>Leave schedule</span><select value={f.leaveType} onChange={(e) => set("leaveType", e.target.value)}><option>Continuous</option><option>Intermittent</option><option>Reduced schedule</option></select></label>
                <label className="fm-field"><span>Expected start date</span><input type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} /></label>
              </>}
              <label className="fm-field fm-col2"><span>{f.kind === "leave" ? "Reason for leave" : "What accommodation do you need?"}</span><input value={f.reason} onChange={(e) => set("reason", e.target.value)} placeholder={f.kind === "leave" ? "e.g. Own serious health condition (surgery + recovery)" : "e.g. Temporary light duty for a lifting restriction"} /></label>
            </div>
            <Guard style={{ marginTop: 16 }}>Share only what's needed to start the request. Medical specifics belong on your certification, which travels a separate confidential channel — not the general file.</Guard>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
              <button className="fm-btn ghost" onClick={() => setStep(0)}>← Back</button>
              <button className="fm-btn brass" disabled={!okReq} onClick={() => setStep(2)}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade">
            <div className="fm-sec-h"><h3 className="fm-serif" style={{ fontSize: 18 }}>Supporting documents <span style={{ color: "var(--muted-2)", fontWeight: 400, fontSize: 14 }}>(optional now — can follow)</span></h3></div>
            <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: "26px 18px", textAlign: "center", color: "var(--muted)", fontSize: 15.4 }}>
              {f.docs.length ? f.docs.map((d) => <div key={d} className="fm-mono" style={{ fontSize: 14, color: "var(--ink-2)" }}>📎 {d}</div>) : "Drop a certification or provider note here"}
            </div>
            <button className="fm-btn ghost" style={{ marginTop: 12 }} onClick={addDoc}>⤴ Add a document</button>
            <Guard style={{ marginTop: 16 }}>Uploads are simulated for this concept. Certifications are routed to a confidential, access-restricted path, separate from your general case file.</Guard>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
              <button className="fm-btn ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="fm-btn brass" onClick={submit}>Submit to HR</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
