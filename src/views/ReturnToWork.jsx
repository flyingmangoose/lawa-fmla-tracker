import React, { useState } from "react";
import { Tag, Guard } from "../components/ui";
import { fmt, addDays, daysFromToday, TODAY } from "../lib/format";

/* Return to work: confirm fitness-for-duty or accommodation-on-return, close the
   case. If entitlement is exhausted, hand off to the ADA interactive process. */
export function ReturnToWork({ cases, openId, onReturn, go }) {
  const active = cases.filter((c) => c.status !== "Returned" && c.status !== "Closed");
  const returned = cases.filter((c) => c.status === "Returned" || c.status === "Closed");
  const sel = cases.find((c) => c.id === openId && c.status !== "Returned" && c.status !== "Closed");

  return (
    <div className="fade">
      <h2 className="fm-h">Return to work</h2>
      <p className="fm-sub">Close the loop: confirm the return date and fitness-for-duty, capture any on-return accommodation, and restore the employee to the same or an equivalent role.</p>

      <div className="fm-grid g2">
        <div className="fm-card" data-tour="rtw">
          <div className="fm-sec-h"><h3>Cases ready to plan a return</h3><Tag c="t-blue">{active.length}</Tag></div>
          <table className="fm-tbl">
            <thead><tr><th>Employee</th><th>Authorized through</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {active.map((c) => (
                <tr key={c.id} className={`click ${sel && sel.id === c.id ? "" : ""}`} onClick={() => go("rtw", c.id)}>
                  <td><div className="emp">{c.name}</div><div className="role fm-mono">{c.id}</div></td>
                  <td className="fm-mono" style={{ fontSize: 13.8 }}>{c.leaveThrough ? fmt(c.leaveThrough) : "—"}</td>
                  <td><Tag c={c.statusTag}>{c.status}</Tag></td>
                  <td style={{ textAlign: "right" }}><button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 14 }}>Plan →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {returned.length > 0 && <>
            <div className="fm-sec-h" style={{ marginTop: 22 }}><h3>Returned &amp; closed</h3><Tag c="t-grey">{returned.length}</Tag></div>
            {returned.map((c) => (
              <div className="req-row" key={c.id}>
                <div><div className="emp">{c.name}</div><div className="role fm-mono">{c.id}</div></div>
                <Tag c="t-grey">Returned {c.returnedOn ? fmt(c.returnedOn) : ""}</Tag>
              </div>
            ))}
          </>}
        </div>

        <div>
          {sel ? <RTWForm c={sel} onReturn={onReturn} go={go} /> : (
            <div className="fm-card" style={{ background: "var(--paper-2)" }}>
              <div className="fm-sec-h"><h3>Return checklist</h3></div>
              <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 0 }}>Pick a case on the left to plan the return. The checklist confirms the steps required before reinstatement.</p>
              <ol style={{ fontSize: 15.4, lineHeight: 1.7, paddingLeft: 18, color: "var(--ink-2)" }}>
                <li>Confirm intended return date.</li>
                <li>Collect fitness-for-duty certification (own serious health condition).</li>
                <li>Apply any temporary accommodation / modified duty.</li>
                <li>Restore to the same or an equivalent position.</li>
                <li>Generate the return-to-work confirmation and close the case.</li>
              </ol>
              <Guard>If entitlement is exhausted, the return path becomes the ADA interactive process — an HR + counsel decision.</Guard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RTWForm({ c, onReturn, go }) {
  const ownSHC = /own serious health/i.test(c.reason);
  const exhausting = c.status === "Exhausting";
  const [returnDate, setReturnDate] = useState(c.leaveThrough && daysFromToday(c.leaveThrough) > 0 ? c.leaveThrough : addDays(TODAY, 7));
  const [fitness, setFitness] = useState(!ownSHC);
  const [accommodation, setAccommodation] = useState("");
  const ready = !!returnDate && (!ownSHC || fitness);

  if (exhausting) {
    return (
      <div className="fm-card" style={{ borderColor: "var(--red)" }}>
        <div className="fm-sec-h"><h3>Entitlement exhausted</h3><Tag c="t-red">ADA review</Tag></div>
        <div className="fm-alert al-amber" style={{ marginBottom: 14 }}><span className="ic">⚑</span><div style={{ fontSize: 15 }}>{c.name}'s FMLA/CFRA entitlement is nearly exhausted. Don't auto-close — open the <strong>ADA interactive process</strong> to evaluate a reasonable accommodation before any return-or-separation decision.</div></div>
        <button className="fm-btn brass" onClick={() => go("accommodations")}>Open ADA interactive process →</button>
        <Guard style={{ marginTop: 14 }}>This is a human decision for HR and counsel. AI only surfaced the exhaustion trigger.</Guard>
      </div>
    );
  }

  return (
    <div className="fm-card">
      <div className="fm-sec-h"><h3>Plan return · {c.name}</h3><Tag c={c.statusTag}>{c.status}</Tag></div>
      <div className="fm-form">
        <label className="fm-field"><span>Return date</span><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
        <label className="fm-field"><span>Restore to</span><input value={`${c.role} (or equivalent)`} readOnly /></label>
      </div>
      {ownSHC && (
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontSize: 15, cursor: "pointer" }}>
          <input type="checkbox" checked={fitness} onChange={(e) => setFitness(e.target.checked)} style={{ marginTop: 3 }} />
          <span>Fitness-for-duty certification received and on file (required for own serious health condition).</span>
        </label>
      )}
      <label className="fm-field fm-col2" style={{ marginTop: 14 }}><span>Accommodation on return <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></span><input value={accommodation} onChange={(e) => setAccommodation(e.target.value)} placeholder="e.g. 20-lb lifting limit for first 2 weeks" /></label>
      <Guard style={{ marginTop: 16 }}>Confirming generates a return-to-work confirmation letter and closes the case. Health benefits continued throughout; the employee is restored to the same or an equivalent position.</Guard>
      <button className="fm-btn brass" style={{ marginTop: 14 }} disabled={!ready} onClick={() => onReturn(c.id, { returnDate, fitness, accommodation })}>Confirm return &amp; close case</button>
    </div>
  );
}
