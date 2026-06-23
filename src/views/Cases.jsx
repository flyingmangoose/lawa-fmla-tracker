import React, { useState } from "react";
import { Tag, StatBar, Audit } from "../components/ui";
import { fmt, addDays, statusToTag, nextCaseId, daysFromToday, TODAY } from "../lib/format";
import { LEAVE_OPTIONS } from "../data/seed";

export function Cases({ openId, go, cases, startCase, events, documents }) {
  const sel = cases.find((c) => c.id === openId);
  return (
    <div className="fade">
      <div className="fm-sec-h">
        <div>
          <h2 className="fm-h">Leave cases</h2>
          <p className="fm-sub" style={{ margin: 0 }}>{cases.length} active · federal FMLA stacked with California CFRA &amp; PDL where applicable</p>
        </div>
        <button className="fm-btn brass" onClick={() => startCase()} data-tour="new-case">+ New Case</button>
      </div>
      <div className="fm-card" data-tour="cases-table">
        <table className="fm-tbl">
          <thead><tr><th>Case / Employee</th><th>Reason</th><th>Type</th><th>Entitlement</th><th>Status</th></tr></thead>
          <tbody>
            {cases.map((c) => {
              const cap = c.mcgw ? 26 : 12;
              return (
                <tr key={c.id} className="click" onClick={() => go("cases", c.id)}>
                  <td><div className="emp">{c.name}</div><div className="role fm-mono">{c.id}</div></td>
                  <td style={{ fontSize: 15, maxWidth: 200 }}>{c.reason}</td>
                  <td><Tag c="t-grey">{c.type}</Tag></td>
                  <td style={{ minWidth: 130 }}><StatBar used={c.used.fmla} cap={cap} color={c.statusTag === "t-red" ? "var(--red)" : "var(--green)"} /></td>
                  <td><Tag c={c.statusTag}>{c.status}</Tag></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sel && <CaseDrawer c={sel} close={() => go("cases")} go={go} events={(events || []).filter((e) => e.caseId === sel.id)} documents={(documents || []).filter((d) => d.caseId === sel.id)} />}
    </div>
  );
}

export function CaseDrawer({ c, close, go, events = [], documents = [] }) {
  const [designation, setDesignation] = useState(c.status === "Pending cert" ? "pending" : "approved");
  const cap = c.mcgw ? 26 : 12;
  const exhausting = c.status === "Exhausting";
  return (
    <div className="drawer-bg" onClick={close}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-h">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="fm-mono" style={{ fontSize: 13.8, color: "var(--muted)" }}>{c.id}</div>
              <h3 className="fm-serif" style={{ fontSize: 24, margin: "2px 0 0", fontWeight: 600 }}>{c.name}</h3>
              <div style={{ fontSize: 15, color: "var(--muted)" }}>{c.role} · {c.dept}</div>
            </div>
            <button className="x" onClick={close}>×</button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {c.leaves.map((l) => <Tag key={l} c="t-blue">{l}</Tag>)}
          </div>
        </div>
        <div className="drawer-c">
          {c.flag && (
            <div className={`fm-alert ${c.flag.tag === "t-red" ? "al-amber" : "al-blue"}`} style={{ marginBottom: 16 }}>
              <span className="ic">⚑</span><div style={{ fontSize: 15 }}><strong>AI flag</strong> — {c.flag.text}</div>
            </div>
          )}

          <h4 className="fm-serif" style={{ fontSize: 16.8, margin: "0 0 8px" }}>Balance engine</h4>
          <div className="fm-card" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: c.used.pdl || c.used.cfra ? 14 : 0 }}>
              <div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>{c.mcgw ? "FMLA — Military Caregiver (26 wk)" : "FMLA (12 wk)"}</div>
              <StatBar used={c.used.fmla} cap={cap} color={c.statusTag === "t-red" ? "var(--red)" : "var(--green)"} />
            </div>
            {c.used.pdl > 0 && <div style={{ marginBottom: 14 }}><div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>CA PDL (up to ~17.3 wk)</div><StatBar used={c.used.pdl} cap={17.3} color="var(--blue)" /></div>}
            {c.used.cfra > 0 && <div><div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>CFRA (12 wk)</div><StatBar used={c.used.cfra} cap={12} color="var(--brass)" /></div>}
            {c.stack && <div className="guard" style={{ marginTop: 14 }}><span>◆</span> PDL runs concurrent with FMLA but <strong>not</strong> CFRA. CFRA bonding (12 wks) begins after disability ends — the stacking that adds up to ~7 months total.</div>}
          </div>

          <div className="kv"><span className="k">Reason</span><span className="v" style={{ maxWidth: 320, textAlign: "right" }}>{c.reason}</span></div>
          <div className="kv"><span className="k">Leave type</span><span className="v">{c.type}</span></div>
          <div className="kv"><span className="k">Opened</span><span className="v">{fmt(c.opened)}</span></div>
          {c.leaveThrough && <div className="kv"><span className="k">Authorized through</span><span className="v">{fmt(c.leaveThrough)}</span></div>}
          <div className="kv"><span className="k">Certification</span><span className="v"><Tag c={c.cert.state === "Sufficient" ? "t-green" : c.cert.state === "Insufficient" ? "t-red" : "t-grey"}>{c.cert.state}</Tag></span></div>
          <div className="kv"><span className="k">Comms email (personal)</span><span className="v fm-mono" style={{ fontSize: 13.5 }}>{c.personalEmail || "—"}</span></div>
          <div className="kv"><span className="k">Next deadline</span><span className="v">{c.nextDeadline.what} · {fmt(c.nextDeadline.when)}</span></div>

          <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 14, background: "var(--paper-2)", padding: "12px 14px", borderRadius: 9, border: "1px solid var(--line)" }}>{c.summary}</p>

          {documents.length > 0 && <>
            <h4 className="fm-serif" style={{ fontSize: 16.8, margin: "18px 0 8px" }}>Documents <span className="lock" style={{ marginLeft: 6 }}>🔒 Confidential</span></h4>
            {documents.map((d) => (
              <div className="kv" key={d.id}><span className="k">{d.kind}</span><span className="v fm-mono" style={{ fontSize: 13.2 }}>{fmt(d.uploaded)}</span></div>
            ))}
          </>}

          <h4 className="fm-serif" style={{ fontSize: 16.8, margin: "18px 0 8px" }}>Audit trail</h4>
          <Audit events={events} />

          <h4 className="fm-serif" style={{ fontSize: 16.8, margin: "18px 0 8px" }}>Designation decision</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <button className={`fm-btn ${designation === "approved" ? "brass" : "ghost"}`} onClick={() => setDesignation("approved")}>Designate as FMLA</button>
            <button className={`fm-btn ${designation === "pending" ? "brass" : "ghost"}`} onClick={() => setDesignation("pending")}>Hold pending cert</button>
          </div>
          <div className="guard"><span>◆</span> The designation is recorded under the signed-in HR user. AI cannot approve, deny, or designate leave.</div>

          <h4 className="fm-serif" style={{ fontSize: 16.8, margin: "18px 0 8px" }}>Close-out</h4>
          {exhausting ? (
            <>
              <div className="fm-alert al-amber" style={{ marginBottom: 10 }}><span className="ic">⚑</span><div style={{ fontSize: 15 }}>Entitlement nearly exhausted. Before return or separation, run the <strong>ADA interactive process</strong> — this is an HR + counsel decision.</div></div>
              <button className="fm-btn brass" onClick={() => go("accommodations")}>Open ADA interactive process →</button>
            </>
          ) : (
            <button className="fm-btn ghost" onClick={() => go("rtw", c.id)}>Begin return to work →</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NewCaseModal({ draft, cases, onClose, onSave }) {
  const [f, setF] = useState({
    name: draft.name || "", role: draft.role || "", dept: draft.dept || "",
    reason: draft.reason || "", type: "Continuous", leaves: ["FMLA", "CFRA"],
    status: "Pending cert", certState: "Pending",
    deadlineWhat: "Certification due", deadlineWhen: addDays(TODAY, 15), summary: "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleLeave = (l) => setF((p) => ({ ...p, leaves: p.leaves.includes(l) ? p.leaves.filter((x) => x !== l) : [...p.leaves, l] }));

  const valid = f.name.trim() && f.role.trim() && f.reason.trim() && f.leaves.length > 0;

  const save = () => {
    if (!valid) return;
    const mcgw = f.leaves.some((l) => l.includes("Military Caregiver"));
    const stack = f.leaves.some((l) => l.includes("PDL"));
    const newCase = {
      id: nextCaseId(cases), name: f.name.trim(), role: f.role.trim(), dept: f.dept.trim() || "—",
      reason: f.reason.trim(), type: f.type, status: f.status, statusTag: statusToTag(f.status),
      opened: TODAY, leaveThrough: null, lastDoc: null, manager: draft.manager || "—", personalEmail: draft.personalEmail || "",
      leaves: f.leaves, flag: null,
      cert: { state: f.certState, note: "" },
      summary: f.summary.trim() || "Case opened by HR. Balances begin at zero; designation pending review.",
      used: { fmla: 0, cfra: 0, pdl: 0 },
      nextDeadline: { what: f.deadlineWhat.trim() || "Next review", when: f.deadlineWhen },
      ...(mcgw ? { mcgw: true } : {}), ...(stack ? { stack: true } : {}),
    };
    onSave(newCase);
  };

  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" style={{ width: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="lt-head"><h4>New leave case</h4><button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button></div>
        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>
          <div className="fm-form">
            <label className="fm-field"><span>Employee name</span><input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" /></label>
            <label className="fm-field"><span>Role</span><input value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="Job title" /></label>
            <label className="fm-field"><span>Department</span><input value={f.dept} onChange={(e) => set("dept", e.target.value)} placeholder="Department" /></label>
            <label className="fm-field"><span>Leave type</span>
              <select value={f.type} onChange={(e) => set("type", e.target.value)}><option>Continuous</option><option>Intermittent</option></select>
            </label>
            <label className="fm-field fm-col2"><span>Reason for leave</span><input value={f.reason} onChange={(e) => set("reason", e.target.value)} placeholder="e.g. Own serious health condition (surgery + recovery)" /></label>
            <div className="fm-field fm-col2"><span>Applicable leaves</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {LEAVE_OPTIONS.map((l) => (
                  <button key={l} type="button" className={`fm-btn ${f.leaves.includes(l) ? "brass" : "ghost"}`} style={{ padding: "7px 12px", fontSize: 13 }} onClick={() => toggleLeave(l)}>{f.leaves.includes(l) ? "✓ " : ""}{l}</button>
                ))}
              </div>
            </div>
            <label className="fm-field"><span>Status</span>
              <select value={f.status} onChange={(e) => set("status", e.target.value)}><option>Pending cert</option><option>Active</option></select>
            </label>
            <label className="fm-field"><span>Certification</span>
              <select value={f.certState} onChange={(e) => set("certState", e.target.value)}><option>Pending</option><option>Sufficient</option><option>Insufficient</option><option>Not required</option></select>
            </label>
            <label className="fm-field"><span>Next deadline</span><input value={f.deadlineWhat} onChange={(e) => set("deadlineWhat", e.target.value)} /></label>
            <label className="fm-field"><span>Due date</span><input type="date" value={f.deadlineWhen} onChange={(e) => set("deadlineWhen", e.target.value)} /></label>
            <label className="fm-field fm-col2"><span>Summary <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></span><input value={f.summary} onChange={(e) => set("summary", e.target.value)} placeholder="Short case summary" /></label>
          </div>
          <div className="guard" style={{ marginTop: 18 }}><span>◆</span> Cases start with zero used balances. The AI never opens, designates, or denies a case — this is an HR action.</div>
        </div>
        <div className="lt-foot">
          <span className="lt-gen">◆ {draft.name ? "Imported from roster / intake" : "Manual intake"} · recorded under the signed-in HR user</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13 }} onClick={onClose}>Cancel</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} disabled={!valid} onClick={save}>Create case</button>
          </div>
        </div>
      </div>
    </div>
  );
}
