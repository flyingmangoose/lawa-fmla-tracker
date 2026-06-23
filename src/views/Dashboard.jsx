import React, { useState } from "react";
import { Tag } from "../components/ui";
import { fmt, daysFromToday, isPendingReq, reqStatusTag, followUp } from "../lib/format";
import { PENDING_ELIG } from "../data/seed";

/* HR reviews a change-of-status request and makes the call — approve & designate, or deny */
export function RequestReviewModal({ req, c, onClose, onDecide }) {
  const [note, setNote] = useState("");
  const cap = c && c.mcgw ? 26 : 12;
  const NOTE = {
    lifeEvent: "Approving records the birth/placement and moves the employee from pregnancy-disability (PDL) to CFRA bonding leave. Issue an updated designation notice; bonding must conclude within 12 months of the event.",
    absence: "Approving confirms the reported hours and draws them from the 480-hour bank. Check the episode is consistent with the certification on file.",
    extend: "Approving extends the leave against remaining entitlement. If the entitlement is exhausted, consider the ADA interactive process instead. An updated medical certification is typically required.",
    schedule: "Approving changes the leave schedule. Request a certification describing the medical need, expected frequency, and duration before designating.",
    rtw: "Approving sets the return-to-work date. For a serious health condition, a fitness-for-duty certification may be required before reinstatement to the same or an equivalent role.",
    contact: "Low-risk update to the employee's contact details. Approving simply updates the file; no leave designation changes.",
  }[req.type] || "Review the request against the case and designate accordingly.";
  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" style={{ width: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="lt-head"><h4>Review request · {req.empName}</h4><button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button></div>
        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>
          <div className="fm-mono" style={{ fontSize: 13.4, color: "var(--muted)" }}>{req.id} · submitted {fmt(req.submitted)}</div>
          <h3 className="fm-serif" style={{ fontSize: 21, margin: "3px 0 14px", fontWeight: 600 }}>{req.title}</h3>
          <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55, background: "var(--paper-2)", padding: "12px 14px", borderRadius: 9, border: "1px solid var(--line)", margin: "0 0 16px" }}>{req.detail}</p>

          {c && <>
            <h4 className="fm-serif" style={{ fontSize: 16.8, margin: "0 0 8px" }}>Case context</h4>
            <div className="kv"><span className="k">Employee</span><span className="v">{c.name} · {c.role}</span></div>
            <div className="kv"><span className="k">Current status</span><span className="v"><Tag c={c.statusTag}>{c.status}</Tag></span></div>
            <div className="kv"><span className="k">FMLA used</span><span className="v">{c.used.fmla} of {cap} wks</span></div>
            <div className="kv"><span className="k">Certification</span><span className="v">{c.cert.state}</span></div>
            <div className="kv"><span className="k">Next deadline</span><span className="v">{c.nextDeadline.what} · {fmt(c.nextDeadline.when)}</span></div>
          </>}

          <label className="fm-field fm-col2" style={{ marginTop: 16 }}><span>Decision note <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional, recorded on the case)</span></span>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Approved; updated designation notice to follow" />
          </label>

          <div className="guard" style={{ marginTop: 16 }}><span>◆</span> {NOTE}</div>
          <div className="guard" style={{ marginTop: 10 }}><span>◆</span> Recorded under the signed-in HR user. The employee sees your decision in their self-service portal. AI never approves or denies — this is your call.</div>
        </div>
        <div className="lt-foot">
          <span className="lt-gen">◆ Human designation · {fmt(req.submitted)}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13, borderColor: "var(--red)", color: "var(--red)" }} onClick={() => onDecide("denied", note)}>Deny</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} onClick={() => onDecide("approved", note)}>Approve &amp; designate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ go, cases, requests = [], onReview }) {
  const [review, setReview] = useState(null);
  const deadlines = [...cases].sort((a, b) => daysFromToday(a.nextDeadline.when) - daysFromToday(b.nextDeadline.when)).slice(0, 5);
  const flags = cases.filter((c) => c.flag);
  const dueSoon = cases.filter((c) => daysFromToday(c.nextDeadline.when) <= 14).length;
  const toCure = cases.filter((c) => c.cert.state === "Insufficient").length;
  const pending = requests.filter(isPendingReq).length;
  const lapses = cases.map((c) => ({ c, fu: followUp(c) })).filter((x) => x.fu);
  return (
    <div className="fade">
      <h2 className="fm-h">Leave compliance overview</h2>
      <p className="fm-sub">Los Angeles World Airports · 3,200 employees · {cases.length} active cases</p>

      {review && <RequestReviewModal req={review} c={cases.find((x) => x.id === review.caseId)} onClose={() => setReview(null)} onDecide={(decision, note) => { onReview(review.id, decision, note); setReview(null); }} />}

      {lapses.length > 0 && (
        <div className="fm-card" style={{ marginBottom: 14, borderColor: "var(--amber)", background: "var(--amber-bg)" }} data-tour="followup">
          <div className="fm-sec-h"><h3>Proactive follow-up — automation caught a lapse</h3><Tag c="t-amber">{lapses.length} queued</Tag></div>
          {lapses.map(({ c, fu }) => (
            <div key={c.id} className="fm-alert al-amber" style={{ marginBottom: 9, background: "var(--card)", cursor: "pointer" }} onClick={() => go("notices")}>
              <span className="ic">⚑</span>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 15 }}>{c.name}</strong> · <span className="fm-mono" style={{ fontSize: 13.5 }}>{c.id}</span>
                <div style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 2 }}>{fu.text}</div>
              </div>
              <Tag c="t-amber">{fu.letter} →</Tag>
            </div>
          ))}
          <div className="guard"><span>◆</span> Deterministic, not AI: the date math runs every load so an authorized-through date never slips by unnoticed. The correct 15- or 30-day letter is queued for HR to review and send.</div>
        </div>
      )}

      {requests.length > 0 && (
        <div className="fm-card" style={{ marginBottom: 14, borderColor: "var(--brass-2)", background: "var(--paper-2)" }} data-tour="ess-requests">
          <div className="fm-sec-h"><h3>Employee self-service requests</h3>{pending > 0 ? <Tag c="t-amber">{pending} awaiting review</Tag> : <Tag c="t-green">All reviewed</Tag>}</div>
          <table className="fm-tbl">
            <thead><tr><th>Employee</th><th>Change requested</th><th>Detail</th><th>Submitted</th><th>Decision</th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td><div className="emp">{r.empName}</div><div className="role fm-mono">{r.caseId}</div></td>
                  <td style={{ fontSize: 15 }}>{r.title}</td>
                  <td style={{ fontSize: 14, color: "var(--muted)", maxWidth: 280 }}>{r.detail}</td>
                  <td className="fm-mono" style={{ fontSize: 14 }}>{fmt(r.submitted)}</td>
                  <td style={{ textAlign: "right" }}>
                    {isPendingReq(r)
                      ? <button className="fm-btn brass" style={{ padding: "7px 14px", fontSize: 14 }} onClick={() => setReview(r)}>Review →</button>
                      : <Tag c={reqStatusTag(r.status)}>{r.decision === "approved" ? "Approved" : "Denied"}</Tag>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="guard" style={{ marginTop: 14 }}><span>◆</span> Submitted by employees in the self-service portal. Each lands here for HR to review and designate — the request never changes a balance or status on its own.</div>
        </div>
      )}

      <div className="fm-grid g4" style={{ marginBottom: 14 }} data-tour="kpis">
        <div className="fm-card fm-kpi"><div className="n">{cases.length}</div><div className="l">Active cases</div><div className="d" style={{ color: "var(--green)" }}>All within entitlement</div></div>
        <div className="fm-card fm-kpi"><div className="n">{dueSoon}</div><div className="l">Deadlines ≤ 14 days</div><div className="d" style={{ color: "var(--amber)" }}>Action required</div></div>
        <div className="fm-card fm-kpi"><div className="n">{toCure}</div><div className="l">Certs to cure</div><div className="d" style={{ color: "var(--red)" }}>Cure clock running</div></div>
        <div className="fm-card fm-kpi"><div className="n">{PENDING_ELIG.length}</div><div className="l">Approaching eligibility</div><div className="d" style={{ color: "var(--blue)" }}>From hours upload</div></div>
      </div>

      <div className="fm-grid g2">
        <div className="fm-card">
          <div className="fm-sec-h"><h3>Upcoming deadlines</h3><button className="fm-btn ghost" onClick={() => go("cases")}>All cases →</button></div>
          <table className="fm-tbl">
            <thead><tr><th>Employee</th><th>Action</th><th>Due</th><th></th></tr></thead>
            <tbody>
              {deadlines.map((c) => {
                const dd = daysFromToday(c.nextDeadline.when);
                const tag = dd <= 4 ? "t-red" : dd <= 10 ? "t-amber" : "t-blue";
                return (
                  <tr key={c.id} className="click" onClick={() => go("cases", c.id)}>
                    <td><div className="emp">{c.name}</div><div className="role">{c.role}</div></td>
                    <td style={{ fontSize: 15 }}>{c.nextDeadline.what}</td>
                    <td className="fm-mono" style={{ fontSize: 14.4 }}>{fmt(c.nextDeadline.when)}</td>
                    <td><Tag c={tag}>{dd <= 0 ? "due" : `${dd}d`}</Tag></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }} data-tour="ai-flags">
          <div className="fm-sec-h"><h3>AI surfaced for review</h3><Tag c="t-grey">Human decides</Tag></div>
          {flags.map((c) => (
            <div key={c.id} className={`fm-alert ${c.flag.tag === "t-red" ? "al-amber" : "al-blue"}`} style={{ marginBottom: 9, cursor: "pointer" }} onClick={() => go("cases", c.id)}>
              <span className="ic">{c.flag.tag === "t-red" ? "⚑" : "◎"}</span>
              <div><strong style={{ fontSize: 15 }}>{c.name}</strong><div style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 2 }}>{c.flag.text}</div></div>
            </div>
          ))}
          <div className="guard"><span>◆</span> AI flags patterns and deadlines. It never makes a designation or adverse call — those stay with HR.</div>
        </div>
      </div>
    </div>
  );
}
