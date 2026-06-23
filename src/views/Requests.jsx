import React, { useState } from "react";
import { Tag, Guard } from "../components/ui";
import { fmt, daysFromToday } from "../lib/format";

const intakeTag = (st) => (st === "New" ? "t-amber" : st === "Determined" ? "t-green" : st === "Denied" ? "t-red" : "t-blue");

/* HR review queue for incoming intake applications + the determination step */
export function Requests({ intake, onDetermine }) {
  const [open, setOpen] = useState(null);
  const pending = intake.filter((i) => i.status === "New").length;
  return (
    <div className="fade">
      <h2 className="fm-h">Incoming requests</h2>
      <p className="fm-sub">New leave and accommodation applications from the employee front door. Open one, review the documents, then make the human determination.</p>

      <div className="fm-card" data-tour="hr-queue">
        <div className="fm-sec-h"><h3>Intake queue</h3>{pending > 0 ? <Tag c="t-amber">{pending} new</Tag> : <Tag c="t-green">All triaged</Tag>}</div>
        <table className="fm-tbl">
          <thead><tr><th>Applicant</th><th>Type</th><th>Reason</th><th>Docs</th><th>Clock</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {intake.map((i) => {
              const due = daysFromToday(i.submitted) + i.clockDays; // business-day proxy
              return (
                <tr key={i.id}>
                  <td><div className="emp">{i.name}</div><div className="role fm-mono">{i.id} · {i.dept}</div></td>
                  <td><Tag c={i.kind === "leave" ? "t-blue" : "t-grey"}>{i.kind === "leave" ? "Leave" : "Accommodation"}</Tag></td>
                  <td style={{ fontSize: 14.5, maxWidth: 240, color: "var(--muted)" }}>{i.reason}</td>
                  <td className="fm-mono" style={{ fontSize: 13.5 }}>{i.docs.length ? `${i.docs.length} file(s)` : "—"}</td>
                  <td><Tag c={i.status !== "New" ? "t-grey" : due <= 1 ? "t-red" : "t-amber"}>{i.status !== "New" ? "—" : `${Math.max(0, due)}d to notice`}</Tag></td>
                  <td><Tag c={intakeTag(i.status)}>{i.status}</Tag></td>
                  <td style={{ textAlign: "right" }}>{i.status === "New"
                    ? <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 14 }} onClick={() => setOpen(i)}>Review →</button>
                    : <span style={{ fontSize: 13.5, color: "var(--muted-2)" }}>{i.outcome}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Guard style={{ marginTop: 14 }}>The 5-business-day eligibility/acknowledgement clock starts at submission and is tracked deterministically. AI may parse a certification; HR makes every determination.</Guard>
      </div>

      {open && <DetermineModal item={open} onClose={() => setOpen(null)} onDetermine={(action) => { onDetermine(open, action); setOpen(null); }} />}
    </div>
  );
}

function DetermineModal({ item, onClose, onDetermine }) {
  const certOk = item.kind === "leave" && item.docs.length > 0;
  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" style={{ width: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="lt-head"><h4>Review &amp; determine · {item.name}</h4><button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button></div>
        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>
          <div className="fm-mono" style={{ fontSize: 13.4, color: "var(--muted)" }}>{item.id} · submitted {fmt(item.submitted)}</div>
          <h3 className="fm-serif" style={{ fontSize: 21, margin: "3px 0 6px", fontWeight: 600 }}>{item.kind === "leave" ? "Leave request" : "Accommodation request"}</h3>
          <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 16px" }}>{item.reason}</p>

          <div className="kv"><span className="k">Applicant</span><span className="v">{item.name} · {item.role}</span></div>
          <div className="kv"><span className="k">Department</span><span className="v">{item.dept}</span></div>
          {item.kind === "leave" && <div className="kv"><span className="k">Schedule</span><span className="v">{item.leaveType}</span></div>}
          <div className="kv"><span className="k">Comms email (personal)</span><span className="v fm-mono" style={{ fontSize: 13.2 }}>{item.personalEmail}</span></div>
          <div className="kv"><span className="k">Documents <span className="lock" style={{ marginLeft: 4 }}>🔒</span></span><span className="v fm-mono" style={{ fontSize: 13 }}>{item.docs.join(", ") || "none yet"}</span></div>

          {item.kind === "leave" && (
            <div className={`fm-alert ${certOk ? "al-blue" : "al-amber"}`} style={{ marginTop: 14 }}>
              <span className="ic">{certOk ? "◎" : "⚑"}</span>
              <div style={{ fontSize: 15 }}>{certOk
                ? <>Certification present. AI extracted the required fields and the deterministic checklist shows them <strong>complete</strong> — eligible to designate.</>
                : <>No certification on file yet. Send the eligibility + rights notice and request the WH-380 within 15 days before designating.</>}</div>
            </div>
          )}

          <Guard style={{ marginTop: 16 }}>{item.kind === "leave"
            ? "Designating opens a case with the balance engine; you complete the designation there. AI never designates."
            : "Routing creates a confidential accommodation record. The grant/deny decision and the ADA interactive process stay with HR + counsel."}</Guard>
        </div>
        <div className="lt-foot">
          <span className="lt-gen">◆ Human determination · recorded under the signed-in HR user</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13, borderColor: "var(--red)", color: "var(--red)" }} onClick={() => onDetermine("deny")}>Deny</button>
            {item.kind === "leave"
              ? <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} onClick={() => onDetermine("openCase")}>Designate &amp; open case</button>
              : <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} onClick={() => onDetermine("accommodation")}>Open accommodation record</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
