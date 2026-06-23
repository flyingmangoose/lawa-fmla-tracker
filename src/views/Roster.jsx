import React, { useState } from "react";
import { Tag } from "../components/ui";
import { PENDING_ELIG } from "../data/seed";

export function Roster({ startCase }) {
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const run = () => { setPhase("running"); setTimeout(() => setPhase("done"), 1900); };
  return (
    <div className="fade">
      <h2 className="fm-h">Roster &amp; hours</h2>
      <p className="fm-sub">No HRIS integration. Eligibility is computed from a periodic Workday payroll export — uploaded, normalized, and reconciled here.</p>

      <div className="fm-card" style={{ marginBottom: 16 }}>
        <div className="fm-sec-h">
          <h3>Workday payroll export</h3>
          {phase === "idle" && <button className="fm-btn brass" onClick={run}>⤴ Upload export (.csv)</button>}
          {phase === "running" && <span style={{ fontSize: 15, color: "var(--brass)" }}>Normalizing columns &amp; reconciling…</span>}
          {phase === "done" && <Tag c="t-green">3,200 records reconciled</Tag>}
        </div>
        {phase === "idle" && <p style={{ fontSize: 15.6, color: "var(--muted)", margin: 0 }}>Drop the latest pay-period export. The tool maps non-standard column headers, matches employees to existing records, and recomputes the 1,250-hour / 12-month eligibility test — no manual spreadsheet work.</p>}
        {phase === "running" && <div style={{ fontSize: 15.6, color: "var(--ink-2)" }}><span className="dot" /> Mapping 41 columns → standard schema · matching on employee ID + name · recomputing eligibility</div>}
        {phase === "done" && (
          <div className="fm-alert al-blue"><span className="ic">◎</span>
            <div style={{ fontSize: 15.6 }}>AI normalized <strong>41 source columns</strong> to the standard schema and matched <strong>3,200 of 3,200</strong> employees. <strong>2 employees newly approaching the 1,250-hour threshold</strong> were flagged for an eligibility notice.</div>
          </div>
        )}
      </div>

      <div className="fm-card" data-tour="roster">
        <div className="fm-sec-h"><h3>Approaching eligibility</h3><Tag c="t-blue">Auto-computed</Tag></div>
        <table className="fm-tbl">
          <thead><tr><th>Employee</th><th>Hours (rolling 12 mo)</th><th>Tenure</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {PENDING_ELIG.map((e) => (
              <tr key={e.name}>
                <td><div className="emp">{e.name}</div><div className="role">{e.role}</div></td>
                <td className="fm-mono">{e.hours.toLocaleString()} / 1,250</td>
                <td className="fm-mono">{e.months} mo</td>
                <td><Tag c="t-amber">{e.note}</Tag></td>
                <td style={{ textAlign: "right" }}><button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13 }} onClick={() => startCase({ name: e.name, role: e.role, reason: "" })}>Start case →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="guard"><span>◆</span> Eligibility math is deterministic, not AI. The AI layer only cleans and matches the import so the math runs on trustworthy data.</div>
      </div>
    </div>
  );
}
