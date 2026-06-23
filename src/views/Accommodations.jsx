import React, { useState } from "react";
import { Tag, Guard, Restricted } from "../components/ui";
import { fmt } from "../lib/format";
import { MANAGER } from "../data/seed";

const accTag = (st) => (st === "Granted" ? "t-green" : st === "Denied" ? "t-red" : st === "In interactive process" ? "t-blue" : "t-amber");

/* Reasonable accommodation / light-duty — the MOST sensitive data in the model.
   Visibility narrows by persona: HR sees everything; Manager sees only the work
   arrangement (no medical reason); Employee sees only their own. */
export function Accommodations({ persona, accommodations, onUpdate, empName }) {
  const [open, setOpen] = useState(null);

  if (persona === "manager") {
    const mine = accommodations.filter((a) => a.dept === MANAGER.dept);
    return (
      <div className="fade">
        <h2 className="fm-h">Accommodations &amp; modified duty</h2>
        <p className="fm-sub">Work arrangements affecting your team. You see the arrangement and dates so you can plan coverage — the medical reason and documents stay with HR.</p>
        <div className="lock" style={{ marginBottom: 16 }}>🔒 Restricted view — no diagnosis or medical detail</div>
        {mine.length ? (
          <div className="fm-card">
            <table className="fm-tbl">
              <thead><tr><th>Employee</th><th>Arrangement</th><th>Status</th><th>Review date</th></tr></thead>
              <tbody>
                {mine.map((a) => (
                  <tr key={a.id}>
                    <td><div className="emp">{a.name}</div><div className="role">{a.role}</div></td>
                    <td style={{ fontSize: 14.5 }}>{a.status === "Granted" ? a.accommodation : "Pending HR determination"}</td>
                    <td><Tag c={accTag(a.status)}>{a.status}</Tag></td>
                    <td className="fm-mono" style={{ fontSize: 13.5 }}>{a.reviewDate ? fmt(a.reviewDate) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Guard style={{ marginTop: 14 }}>Plan around the arrangement, not the condition. If you need to discuss workload, contact HR — never ask the employee for medical detail.</Guard>
          </div>
        ) : <Restricted><div style={{ fontSize: 15.4 }}>No active accommodations for your team right now.</div></Restricted>}
      </div>
    );
  }

  if (persona === "employee") {
    const mine = accommodations.filter((a) => a.name === empName);
    return (
      <div className="fade">
        <h2 className="fm-h">My accommodations</h2>
        <p className="fm-sub">Any reasonable-accommodation or modified-duty arrangements on your record. Only you and HR can see this.</p>
        {mine.length ? mine.map((a) => (
          <div className="fm-card" key={a.id} style={{ marginBottom: 14 }}>
            <div className="fm-sec-h"><h3>{a.kind}</h3><Tag c={accTag(a.status)}>{a.status}</Tag></div>
            <div className="kv"><span className="k">What you requested</span><span className="v" style={{ maxWidth: 320, textAlign: "right" }}>{a.request}</span></div>
            <div className="kv"><span className="k">Arrangement</span><span className="v" style={{ maxWidth: 320, textAlign: "right" }}>{a.accommodation}</span></div>
            {a.startDate && <div className="kv"><span className="k">Start</span><span className="v">{fmt(a.startDate)}</span></div>}
            {a.reviewDate && <div className="kv"><span className="k">Review</span><span className="v">{fmt(a.reviewDate)}</span></div>}
            <Guard style={{ marginTop: 14 }}>Your accommodation details are confidential and shared only with the people who must implement them.</Guard>
          </div>
        )) : <Restricted><div style={{ fontSize: 15.4 }}>You have no accommodation requests on file. You can request one any time from “Apply for Leave”.</div></Restricted>}
      </div>
    );
  }

  // HR — full visibility + determinations
  return (
    <div className="fade">
      <h2 className="fm-h">Reasonable accommodation &amp; modified duty</h2>
      <p className="fm-sub">The ADA interactive process and light/modified-duty tracking. This is the most access-restricted data in the system — kept separate from the general case file.</p>
      <div className="lock" style={{ marginBottom: 16 }}>🔒 Extra-sensitive — HR / Leave Admin only</div>
      <div className="fm-card" data-tour="accommodations">
        <table className="fm-tbl">
          <thead><tr><th>Employee</th><th>Type</th><th>Request</th><th>Linked case</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {accommodations.map((a) => (
              <tr key={a.id}>
                <td><div className="emp">{a.name}</div><div className="role fm-mono">{a.id}</div></td>
                <td><Tag c="t-grey">{a.kind}</Tag></td>
                <td style={{ fontSize: 14.5, maxWidth: 240 }}>{a.request}</td>
                <td className="fm-mono" style={{ fontSize: 13.5 }}>{a.linkedCaseId || "—"}</td>
                <td><Tag c={accTag(a.status)}>{a.status}</Tag></td>
                <td style={{ textAlign: "right" }}><button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => setOpen(a)}>Manage →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Guard style={{ marginTop: 14 }}>Grant/deny and the interactive process are human decisions, made by HR with counsel where appropriate. AI does not decide accommodations.</Guard>
      </div>

      {open && <AccModal a={open} onClose={() => setOpen(null)} onUpdate={(patch) => { onUpdate(open.id, patch); setOpen(null); }} />}
    </div>
  );
}

function AccModal({ a, onClose, onUpdate }) {
  const [accommodation, setAccommodation] = useState(a.accommodation);
  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" style={{ width: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="lt-head"><h4>{a.kind} · {a.name}</h4><button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button></div>
        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>
          <div className="fm-mono" style={{ fontSize: 13.4, color: "var(--muted)" }}>{a.id}{a.linkedCaseId ? ` · linked to ${a.linkedCaseId}` : ""}</div>
          <div className="kv" style={{ marginTop: 8 }}><span className="k">Employee</span><span className="v">{a.name} · {a.role}</span></div>
          <div className="kv"><span className="k">Request</span><span className="v" style={{ maxWidth: 300, textAlign: "right" }}>{a.request}</span></div>
          <div className="kv"><span className="k">Current status</span><span className="v"><Tag c={accTag(a.status)}>{a.status}</Tag></span></div>
          {a.reviewDate && <div className="kv"><span className="k">Review date</span><span className="v">{fmt(a.reviewDate)}</span></div>}
          <label className="fm-field fm-col2" style={{ marginTop: 14 }}><span>Accommodation / arrangement</span><input value={accommodation} onChange={(e) => setAccommodation(e.target.value)} /></label>
          <Guard style={{ marginTop: 16 }}>Record the arrangement and the determination. The interactive process is documented here; the medical basis stays on the confidential channel.</Guard>
        </div>
        <div className="lt-foot">
          <span className="lt-gen">◆ Human determination · {a.id}</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="fm-btn ghost" style={{ padding: "7px 12px", fontSize: 13 }} onClick={() => onUpdate({ status: "In interactive process", accommodation })}>Interactive process</button>
            <button className="fm-btn ghost" style={{ padding: "7px 12px", fontSize: 13, borderColor: "var(--red)", color: "var(--red)" }} onClick={() => onUpdate({ status: "Denied", accommodation })}>Deny</button>
            <button className="fm-btn brass" style={{ padding: "7px 12px", fontSize: 13 }} onClick={() => onUpdate({ status: "Granted", accommodation })}>Grant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
