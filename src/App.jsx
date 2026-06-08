import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   LAWA FMLA Tracker — POC
   Standalone, integration-free AI-enabled leave compliance system
   Built for a CHRO demo. AI assists; humans make every designation.
   ============================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root{
  --ink:#0a2647; --ink-2:#14416b; --paper:#eef3f9; --paper-2:#f7fafd; --card:#ffffff;
  --brass:#c0902a; --brass-2:#dcae46; --line:#d6e1ee; --line-2:#e6eef7;
  --muted:#566576; --muted-2:#8493a3;
  --green:#1f7a4d; --green-bg:#e3f1e9; --amber:#a9760f; --amber-bg:#f5ead0;
  --red:#b5352f; --red-bg:#f6e2e0; --blue:#1d6fbf; --blue-bg:#e3eefb;
  --sky:#3a8dde; --sky-2:#7fc0f5;
}
*{box-sizing:border-box}
.fm-root{font-family:'Barlow',sans-serif;color:var(--ink);background:var(--paper);min-height:100vh;-webkit-font-smoothing:antialiased}
.fm-serif{font-family:'Barlow Semi Condensed',sans-serif}
.fm-mono{font-family:'IBM Plex Mono',monospace}

.fm-shell{max-width:1180px;margin:0 auto}
.fm-topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 28px;background:var(--ink);color:#eef4fb}
.fm-brand{display:flex;align-items:center;gap:12px}
.fm-logo{height:34px;border-radius:6px;background:linear-gradient(160deg,#0a2647,#14416b);display:flex;align-items:center;justify-content:center;gap:2.5px;padding:0 8px}
.fm-logo i{display:block;width:3px;border-radius:2px}
.fm-pylon{height:3px;display:flex}
.fm-pylon span{flex:1}
.fm-brand h1{font-family:'Barlow Semi Condensed',sans-serif;font-size:18px;font-weight:600;margin:0;letter-spacing:.2px}
.fm-brand .sub{font-size:11px;color:#9fb0bd;letter-spacing:.4px;text-transform:uppercase;margin-top:1px}
.fm-poc{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#0a2647;background:var(--brass-2);padding:3px 8px;border-radius:4px;font-weight:600}

.fm-nav{display:flex;gap:2px;padding:0 20px;background:var(--ink-2);overflow-x:auto}
.fm-nav button{background:none;border:none;color:#aebcc7;font-family:'Barlow',sans-serif;font-size:13.5px;font-weight:500;padding:13px 16px;cursor:pointer;border-bottom:2.5px solid transparent;white-space:nowrap;transition:.15s}
.fm-nav button:hover{color:#fff}
.fm-nav button.on{color:#fff;border-bottom-color:var(--brass-2)}

.fm-body{padding:26px 28px 60px}
.fm-h{font-family:'Barlow Semi Condensed',sans-serif;font-weight:600;font-size:24px;margin:0 0 3px}
.fm-sub{color:var(--muted);font-size:13.5px;margin:0 0 20px}

.fm-grid{display:grid;gap:14px}
.g4{grid-template-columns:repeat(4,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g2{grid-template-columns:1.4fr 1fr}
@media(max-width:820px){.g4{grid-template-columns:repeat(2,1fr)}.g3,.g2{grid-template-columns:1fr}}

.fm-card{background:var(--card);border:1px solid var(--line);border-radius:11px;padding:18px}
.fm-kpi .n{font-family:'Barlow Semi Condensed',sans-serif;font-size:30px;font-weight:600;line-height:1}
.fm-kpi .l{font-size:12px;color:var(--muted);margin-top:7px;text-transform:uppercase;letter-spacing:.5px}
.fm-kpi .d{font-size:11.5px;margin-top:8px;font-weight:500}

.fm-tag{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;letter-spacing:.2px}
.t-green{background:var(--green-bg);color:var(--green)}
.t-amber{background:var(--amber-bg);color:var(--amber)}
.t-red{background:var(--red-bg);color:var(--red)}
.t-blue{background:var(--blue-bg);color:var(--blue)}
.t-grey{background:#eee9de;color:var(--muted)}

.fm-sec-h{display:flex;align-items:center;justify-content:space-between;margin:0 0 12px}
.fm-sec-h h3{font-family:'Barlow Semi Condensed',sans-serif;font-size:16px;font-weight:600;margin:0}

table.fm-tbl{width:100%;border-collapse:collapse;font-size:13px}
.fm-tbl th{text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--muted-2);font-weight:600;padding:0 10px 9px;border-bottom:1px solid var(--line)}
.fm-tbl td{padding:11px 10px;border-bottom:1px solid var(--line-2);vertical-align:middle}
.fm-tbl tr:last-child td{border-bottom:none}
.fm-tbl tr.click{cursor:pointer}
.fm-tbl tr.click:hover td{background:var(--paper-2)}
.emp{font-weight:600}
.role{font-size:11.5px;color:var(--muted)}

.fm-btn{font-family:'Barlow',sans-serif;font-size:13px;font-weight:600;border-radius:8px;padding:9px 15px;cursor:pointer;border:1px solid var(--ink);background:var(--ink);color:#eef4fb;transition:.15s}
.fm-btn:hover{background:var(--ink-2)}
.fm-btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
.fm-btn.ghost:hover{background:var(--paper-2);border-color:var(--brass)}
.fm-btn.brass{background:var(--brass);border-color:var(--brass);color:#fff}
.fm-btn.brass:hover{background:#96652f}
.fm-btn:disabled{opacity:.5;cursor:default}

.fm-alert{display:flex;gap:11px;padding:13px 14px;border-radius:9px;font-size:13px;align-items:flex-start}
.al-amber{background:var(--amber-bg);border:1px solid #ecd9a8}
.al-blue{background:var(--blue-bg);border:1px solid #c4d8e6}
.fm-alert .ic{font-size:15px;line-height:1.2}

.bar{height:9px;border-radius:6px;background:var(--line);overflow:hidden;display:flex}
.bar span{display:block;height:100%}

.drawer-bg{position:fixed;inset:0;background:rgba(22,36,47,.42);display:flex;justify-content:flex-end;z-index:50}
.drawer{width:560px;max-width:94vw;background:var(--paper);height:100%;overflow-y:auto;box-shadow:-12px 0 40px rgba(0,0,0,.18)}
.drawer-h{padding:20px 24px;border-bottom:1px solid var(--line);background:var(--card);position:sticky;top:0;z-index:2}
.drawer-c{padding:22px 24px}
.x{background:none;border:none;font-size:22px;cursor:pointer;color:var(--muted);line-height:1}

.kv{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line-2);font-size:13px}
.kv .k{color:var(--muted)}
.kv .v{font-weight:600}

.guard{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--brass);background:var(--paper-2);border:1px dashed var(--brass-2);border-radius:8px;padding:8px 12px;margin-top:12px}

.chat-wrap{display:flex;flex-direction:column;height:540px;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.chat-log{flex:1;overflow-y:auto;padding:20px}
.msg{margin-bottom:16px;display:flex;gap:10px}
.msg .av{width:28px;height:28px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
.av-ai{background:linear-gradient(135deg,var(--brass-2),var(--brass));color:#0a2647}
.av-u{background:var(--ink);color:#eef4fb}
.bub{font-size:13.5px;line-height:1.55;padding:11px 14px;border-radius:10px;max-width:84%;white-space:pre-wrap}
.bub-ai{background:var(--paper-2);border:1px solid var(--line)}
.bub-u{background:var(--ink);color:#eef4fb}
.chat-in{display:flex;gap:8px;padding:14px;border-top:1px solid var(--line);background:var(--paper-2)}
.chat-in input{flex:1;border:1px solid var(--line);border-radius:8px;padding:10px 13px;font-family:'Barlow',sans-serif;font-size:13.5px;outline:none}
.chat-in input:focus{border-color:var(--brass)}
.chip{font-size:11.5px;border:1px solid var(--line);background:var(--card);border-radius:16px;padding:5px 11px;cursor:pointer;color:var(--ink-2)}
.chip:hover{border-color:var(--brass);color:var(--brass)}
.dot{width:6px;height:6px;border-radius:50%;background:var(--brass);display:inline-block;animation:bl 1s infinite}
@keyframes bl{0%,80%,100%{opacity:.3}40%{opacity:1}}
.fade{animation:fu .35s ease both}
@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.lt-bg{position:fixed;inset:0;background:rgba(22,36,47,.5);display:flex;align-items:flex-start;justify-content:center;z-index:60;padding:40px 16px;overflow-y:auto}
.lt-sheet{background:#fff;width:660px;max-width:96vw;border-radius:10px;box-shadow:0 24px 64px rgba(0,0,0,.32);overflow:hidden;animation:fu .3s ease both}
.lt-head{display:flex;justify-content:space-between;align-items:center;padding:13px 20px;background:var(--ink);color:#eef4fb}
.lt-head h4{font-family:'Barlow Semi Condensed',sans-serif;margin:0;font-size:15px;font-weight:600}
.lt-paper{padding:36px 44px;font-size:13.5px;line-height:1.72;color:#1d2a34;white-space:pre-wrap;min-height:230px}
.lt-lh{display:flex;align-items:center;gap:11px;border-bottom:2px solid var(--brass);padding-bottom:13px;margin-bottom:22px}
.lt-lh .mk{width:32px;height:32px;border-radius:6px;background:linear-gradient(135deg,var(--brass-2),var(--brass));display:flex;align-items:center;justify-content:center;font-family:'Barlow Semi Condensed',sans-serif;font-weight:700;color:#0a2647;flex-shrink:0}
.lt-lh .nm{font-family:'Barlow Semi Condensed',sans-serif;font-weight:600;font-size:15px;line-height:1.15}
.lt-lh .ad{font-size:10.5px;color:var(--muted);letter-spacing:.3px}
.lt-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 20px;background:var(--paper-2);border-top:1px solid var(--line)}
.lt-gen{font-size:11.5px;color:var(--brass);display:flex;align-items:center;gap:6px}
`;

/* ---------------- demo data ---------------- */
const TODAY = "2026-06-05";

const CASES = [
  {
    id: "FM-2026-0148", name: "Maria Delgado", role: "Operations Coordinator", dept: "Airfield Ops",
    reason: "Pregnancy disability → Baby bonding", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-03-02",
    leaves: ["PDL (CA)", "FMLA", "CFRA"],
    flag: null,
    cert: { state: "Sufficient", note: "Provider cert complete; EDD note on file" },
    stack: true,
    summary: "Pregnancy disability leave under California PDL (up to 4 months) running concurrent with FMLA. CFRA bonding (12 wks) reserved to begin after disability ends — does NOT run concurrent with PDL.",
    used: { fmla: 8.0, cfra: 0, pdl: 9.5 }, nextDeadline: { what: "PDL → CFRA transition designation", when: "2026-06-18" }
  },
  {
    id: "FM-2026-0151", name: "James Okafor", role: "Airport Police Officer", dept: "Public Safety",
    reason: "Own serious health condition (surgery + recovery)", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-04-21",
    leaves: ["FMLA", "CFRA"], flag: null,
    cert: { state: "Sufficient", note: "WH-380-E complete" },
    summary: "Continuous block leave for surgical recovery. FMLA and CFRA running concurrently.",
    used: { fmla: 5.5, cfra: 5.5, pdl: 0 }, nextDeadline: { what: "Recertification request window", when: "2026-07-10" }
  },
  {
    id: "FM-2026-0142", name: "Linda Tran", role: "Maintenance Worker II", dept: "Facilities",
    reason: "Own serious health condition (chronic migraine)", type: "Intermittent", status: "Active",
    statusTag: "t-green", opened: "2026-02-11",
    leaves: ["FMLA", "CFRA"],
    flag: { tag: "t-amber", text: "AI flagged: intermittent absences cluster on Fridays/Mondays (7 of last 9). Suggest recertification review." },
    cert: { state: "Sufficient", note: "Frequency: 2–3 episodes/month, up to 1 day each" },
    summary: "Intermittent leave for chronic condition. Hours decrement against the 480-hour FMLA bank per occurrence.",
    used: { fmla: 6.2, cfra: 6.2, pdl: 0 }, nextDeadline: { what: "Recertification (pattern-based) — HR review", when: "2026-06-12" }
  },
  {
    id: "FM-2026-0155", name: "Robert Hayes", role: "Electrician", dept: "Facilities",
    reason: "Care for spouse with serious health condition", type: "Continuous", status: "Pending cert",
    statusTag: "t-amber", opened: "2026-05-26",
    leaves: ["FMLA", "CFRA"],
    flag: { tag: "t-red", text: "AI flagged: certification incomplete — missing probable duration and frequency of care. Cure period clock running." },
    cert: { state: "Insufficient", note: "WH-380-F missing §6 (duration). Return-for-cure letter ready to send." },
    summary: "Family-care leave. Certification returned as insufficient; employee has 7 calendar days to cure before provisional designation lapses.",
    used: { fmla: 0, cfra: 0, pdl: 0 }, nextDeadline: { what: "Cure deadline (insufficient cert)", when: "2026-06-09" }
  },
  {
    id: "FM-2026-0133", name: "Aisha Bennett", role: "Administrative Analyst", dept: "HR Shared Svcs",
    reason: "Military caregiver leave (covered servicemember)", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-01-15",
    leaves: ["FMLA (Military Caregiver — 26 wk)"], flag: null,
    cert: { state: "Sufficient", note: "Certification of serious injury/illness on file" },
    summary: "Military caregiver leave carries a 26-workweek entitlement in a single 12-month period — distinct from the standard 12-week bank.",
    used: { fmla: 14.0, cfra: 0, pdl: 0 }, mcgw: true,
    nextDeadline: { what: "Mid-leave status check-in", when: "2026-06-20" }
  },
  {
    id: "FM-2026-0156", name: "Carlos Mendez", role: "Custodian", dept: "Facilities",
    reason: "Bonding with new child", type: "Continuous", status: "Active",
    statusTag: "t-green", opened: "2026-05-12",
    leaves: ["FMLA", "CFRA"], flag: null,
    cert: { state: "Not required", note: "Bonding leave — no medical cert required" },
    summary: "Block bonding leave. FMLA and CFRA run concurrently for bonding when both apply to the same parent.",
    used: { fmla: 3.0, cfra: 3.0, pdl: 0 }, nextDeadline: { what: "Bonding leave must conclude within 12 mo of birth", when: "2027-04-30" }
  },
  {
    id: "FM-2026-0119", name: "Dawn Pierce", role: "Customer Service Rep", dept: "Guest Experience",
    reason: "Own serious health condition", type: "Continuous", status: "Exhausting",
    statusTag: "t-red", opened: "2025-12-08",
    leaves: ["FMLA", "CFRA"],
    flag: { tag: "t-red", text: "AI flagged: FMLA/CFRA entitlement nearly exhausted. Begin ADA interactive-process review before leave expires." },
    cert: { state: "Sufficient", note: "Cert current" },
    summary: "Entitlement nearly exhausted. Decision point: ADA reasonable-accommodation interactive process. AI surfaces the trigger; HR + counsel decide next steps.",
    used: { fmla: 11.4, cfra: 11.4, pdl: 0 }, nextDeadline: { what: "Entitlement exhaustion / RTW or ADA review", when: "2026-06-23" }
  },
];

const PENDING_ELIG = [
  { name: "Devon Wallace", role: "Ramp Agent", hours: 1208, months: 11, note: "Crosses 1,250 hrs in ~3 weeks" },
  { name: "Priya Nair", role: "Budget Analyst", hours: 1190, months: 14, note: "Hours OK at next pay period" },
];

const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const daysFromToday = (d) => Math.round((new Date(d) - new Date(TODAY)) / 864e5);

/* build a compact grounding context for the live assistant */
function buildContext() {
  let s = `LAWA FMLA Tracker — live case data (as of ${fmt(TODAY)}). Entitlements: standard FMLA & CFRA = 12 workweeks (480 hrs full-time); CA PDL = up to 4 months (~17.3 wks) for pregnancy disability and runs concurrent with FMLA but NOT CFRA; CFRA bonding (12 wks) begins after PDL ends; Military Caregiver FMLA = 26 weeks.\n\nCases:\n`;
  CASES.forEach((c) => {
    const cap = c.mcgw ? 26 : 12;
    s += `- ${c.name} (${c.id}), ${c.role}, ${c.dept}. Reason: ${c.reason}. Type: ${c.type}. Status: ${c.status}. Leaves: ${c.leaves.join(", ")}. FMLA used: ${c.used.fmla} of ${cap} wks${c.used.pdl ? `; PDL used: ${c.used.pdl} wks (of ~17.3)` : ""}${c.used.cfra ? `; CFRA used: ${c.used.cfra} of 12 wks` : ""}. Cert: ${c.cert.state}. Next deadline: ${c.nextDeadline.what} on ${fmt(c.nextDeadline.when)}.${c.flag ? ` FLAG: ${c.flag.text}` : ""}\n`;
  });
  s += `\nGuardrail: You assist HR staff. You may compute balances, summarize, and surface deadlines and risks, but you must NEVER make or recommend a final leave designation or any adverse employment determination — those are human decisions. If asked to decide, explain the options and say the determination must be made by an HR professional, with counsel where appropriate. Keep answers brief and concrete.`;
  return s;
}

/* ---------------- small components ---------------- */
const Tag = ({ c, children }) => <span className={`fm-tag ${c}`}>{children}</span>;

function StatBar({ used, cap, color }) {
  const pct = Math.min(100, (used / cap) * 100);
  return (
    <div>
      <div className="bar"><span style={{ width: pct + "%", background: color }} /></div>
      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 5 }} className="fm-mono">
        {used} / {cap} wks used · {(cap - used).toFixed(1)} remaining
      </div>
    </div>
  );
}

/* ---------------- views ---------------- */
function Dashboard({ go }) {
  const deadlines = [...CASES].sort((a, b) => daysFromToday(a.nextDeadline.when) - daysFromToday(b.nextDeadline.when)).slice(0, 5);
  const flags = CASES.filter((c) => c.flag);
  return (
    <div className="fade">
      <h2 className="fm-h">Leave compliance overview</h2>
      <p className="fm-sub">Los Angeles World Airports · 3,200 employees · {CASES.length} active cases</p>

      <div className="fm-grid g4" style={{ marginBottom: 14 }}>
        <div className="fm-card fm-kpi"><div className="n">{CASES.length}</div><div className="l">Active cases</div><div className="d" style={{ color: "var(--green)" }}>All within entitlement</div></div>
        <div className="fm-card fm-kpi"><div className="n">3</div><div className="l">Deadlines ≤ 14 days</div><div className="d" style={{ color: "var(--amber)" }}>Action required</div></div>
        <div className="fm-card fm-kpi"><div className="n">1</div><div className="l">Certs to cure</div><div className="d" style={{ color: "var(--red)" }}>Cure clock running</div></div>
        <div className="fm-card fm-kpi"><div className="n">2</div><div className="l">Approaching eligibility</div><div className="d" style={{ color: "var(--blue)" }}>From hours upload</div></div>
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
                    <td style={{ fontSize: 12.5 }}>{c.nextDeadline.what}</td>
                    <td className="fm-mono" style={{ fontSize: 12 }}>{fmt(c.nextDeadline.when)}</td>
                    <td><Tag c={tag}>{dd <= 0 ? "due" : `${dd}d`}</Tag></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }}>
          <div className="fm-sec-h"><h3>AI surfaced for review</h3><Tag c="t-grey">Human decides</Tag></div>
          {flags.map((c) => (
            <div key={c.id} className={`fm-alert ${c.flag.tag === "t-red" ? "al-amber" : "al-blue"}`} style={{ marginBottom: 9, cursor: "pointer" }} onClick={() => go("cases", c.id)}>
              <span className="ic">{c.flag.tag === "t-red" ? "⚑" : "◎"}</span>
              <div><strong style={{ fontSize: 12.5 }}>{c.name}</strong><div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 2 }}>{c.flag.text}</div></div>
            </div>
          ))}
          <div className="guard"><span>◆</span> AI flags patterns and deadlines. It never makes a designation or adverse call — those stay with HR.</div>
        </div>
      </div>
    </div>
  );
}

function Employees() {
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
          {phase === "running" && <span style={{ fontSize: 12.5, color: "var(--brass)" }}>Normalizing columns &amp; reconciling…</span>}
          {phase === "done" && <Tag c="t-green">3,200 records reconciled</Tag>}
        </div>
        {phase === "idle" && <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Drop the latest pay-period export. The tool maps non-standard column headers, matches employees to existing records, and recomputes the 1,250-hour / 12-month eligibility test — no manual spreadsheet work.</p>}
        {phase === "running" && <div style={{ fontSize: 13, color: "var(--ink-2)" }}><span className="dot" /> Mapping 41 columns → standard schema · matching on employee ID + name · recomputing eligibility</div>}
        {phase === "done" && (
          <div className="fm-alert al-blue"><span className="ic">◎</span>
            <div style={{ fontSize: 13 }}>AI normalized <strong>41 source columns</strong> to the standard schema and matched <strong>3,200 of 3,200</strong> employees. <strong>2 employees newly approaching the 1,250-hour threshold</strong> were flagged for an eligibility notice.</div>
          </div>
        )}
      </div>

      <div className="fm-card">
        <div className="fm-sec-h"><h3>Approaching eligibility</h3><Tag c="t-blue">Auto-computed</Tag></div>
        <table className="fm-tbl">
          <thead><tr><th>Employee</th><th>Hours (rolling 12 mo)</th><th>Tenure</th><th>Status</th></tr></thead>
          <tbody>
            {PENDING_ELIG.map((e) => (
              <tr key={e.name}>
                <td><div className="emp">{e.name}</div><div className="role">{e.role}</div></td>
                <td className="fm-mono">{e.hours.toLocaleString()} / 1,250</td>
                <td className="fm-mono">{e.months} mo</td>
                <td><Tag c="t-amber">{e.note}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="guard"><span>◆</span> Eligibility math is deterministic, not AI. The AI layer only cleans and matches the import so the math runs on trustworthy data.</div>
      </div>
    </div>
  );
}

function Cases({ openId, go }) {
  const sel = CASES.find((c) => c.id === openId);
  return (
    <div className="fade">
      <h2 className="fm-h">Leave cases</h2>
      <p className="fm-sub">{CASES.length} active · federal FMLA stacked with California CFRA &amp; PDL where applicable</p>
      <div className="fm-card">
        <table className="fm-tbl">
          <thead><tr><th>Case / Employee</th><th>Reason</th><th>Type</th><th>Entitlement</th><th>Status</th></tr></thead>
          <tbody>
            {CASES.map((c) => {
              const cap = c.mcgw ? 26 : 12;
              return (
                <tr key={c.id} className="click" onClick={() => go("cases", c.id)}>
                  <td><div className="emp">{c.name}</div><div className="role fm-mono">{c.id}</div></td>
                  <td style={{ fontSize: 12.5, maxWidth: 200 }}>{c.reason}</td>
                  <td><Tag c="t-grey">{c.type}</Tag></td>
                  <td style={{ minWidth: 130 }}><StatBar used={c.used.fmla} cap={cap} color={c.statusTag === "t-red" ? "var(--red)" : "var(--green)"} /></td>
                  <td><Tag c={c.statusTag}>{c.status}</Tag></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sel && <CaseDrawer c={sel} close={() => go("cases")} />}
    </div>
  );
}

function CaseDrawer({ c, close }) {
  const [designation, setDesignation] = useState(c.status === "Pending cert" ? "pending" : "approved");
  const cap = c.mcgw ? 26 : 12;
  return (
    <div className="drawer-bg" onClick={close}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-h">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="fm-mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>{c.id}</div>
              <h3 className="fm-serif" style={{ fontSize: 20, margin: "2px 0 0", fontWeight: 600 }}>{c.name}</h3>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.role} · {c.dept}</div>
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
              <span className="ic">⚑</span><div style={{ fontSize: 12.5 }}><strong>AI flag</strong> — {c.flag.text}</div>
            </div>
          )}

          <h4 className="fm-serif" style={{ fontSize: 14, margin: "0 0 8px" }}>Balance engine</h4>
          <div className="fm-card" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: c.used.pdl || c.used.cfra ? 14 : 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{c.mcgw ? "FMLA — Military Caregiver (26 wk)" : "FMLA (12 wk)"}</div>
              <StatBar used={c.used.fmla} cap={cap} color={c.statusTag === "t-red" ? "var(--red)" : "var(--green)"} />
            </div>
            {c.used.pdl > 0 && <div style={{ marginBottom: 14 }}><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>CA PDL (up to ~17.3 wk)</div><StatBar used={c.used.pdl} cap={17.3} color="var(--blue)" /></div>}
            {c.used.cfra > 0 && <div><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>CFRA (12 wk)</div><StatBar used={c.used.cfra} cap={12} color="var(--brass)" /></div>}
            {c.stack && <div className="guard" style={{ marginTop: 14 }}><span>◆</span> PDL runs concurrent with FMLA but <strong>not</strong> CFRA. CFRA bonding (12 wks) begins after disability ends — the stacking that adds up to ~7 months total.</div>}
          </div>

          <div className="kv"><span className="k">Reason</span><span className="v" style={{ maxWidth: 320, textAlign: "right" }}>{c.reason}</span></div>
          <div className="kv"><span className="k">Leave type</span><span className="v">{c.type}</span></div>
          <div className="kv"><span className="k">Opened</span><span className="v">{fmt(c.opened)}</span></div>
          <div className="kv"><span className="k">Certification</span><span className="v"><Tag c={c.cert.state === "Sufficient" ? "t-green" : c.cert.state === "Insufficient" ? "t-red" : "t-grey"}>{c.cert.state}</Tag></span></div>
          <div className="kv"><span className="k">Next deadline</span><span className="v">{c.nextDeadline.what} · {fmt(c.nextDeadline.when)}</span></div>

          <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 14, background: "var(--paper-2)", padding: "12px 14px", borderRadius: 9, border: "1px solid var(--line)" }}>{c.summary}</p>

          <h4 className="fm-serif" style={{ fontSize: 14, margin: "18px 0 8px" }}>Designation decision</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button className={`fm-btn ${designation === "approved" ? "brass" : "ghost"}`} onClick={() => setDesignation("approved")}>Designate as FMLA</button>
            <button className={`fm-btn ${designation === "pending" ? "brass" : "ghost"}`} onClick={() => setDesignation("pending")}>Hold pending cert</button>
          </div>
          <div className="guard"><span>◆</span> The designation is recorded under the signed-in HR user. AI cannot approve, deny, or designate leave.</div>
        </div>
      </div>
    </div>
  );
}

/* deterministic notices fill from templates — no AI, just merge */
const LETTER_TEMPLATES = {
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
};

/* the cure letter is genuinely drafted by Claude from the parsed (insufficient) cert */
async function draftCureLetter() {
  const facts = `Employer: Los Angeles World Airports (LAWA). Date: ${fmt(TODAY)}.
Employee: Robert Hayes, Electrician, Facilities, Employee ID 1155-LAWA.
Leave reason: leave to care for spouse with a serious health condition (FMLA / CFRA).
Form submitted: WH-380-F (certification for family member's serious health condition), signed by provider on 2026-05-25.
Certification is INSUFFICIENT. Specifically missing: (1) the probable duration of the condition / how long care will be needed [item 6], and (2) the frequency and duration of care the employee will provide.
Cure period: the employee has 7 calendar days from receipt to provide the missing information. Cure deadline: ${fmt("2026-06-09")}.`;

  const res = await fetch("/api/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: "draft", max_tokens: 1000,
      system: "You draft FMLA return-for-cure letters for an HR leave administrator. Write a professional, legally careful business letter that (1) thanks the employee for the submitted certification, (2) states plainly and specifically which required items are missing, (3) explains the 7-calendar-day cure period and the consequence if not cured, and (4) tells them how to submit the missing information. Use a respectful, non-accusatory tone. Do NOT make a final determination on the leave itself — the letter requests information; designation happens later. Output ONLY the letter text (date, recipient, body, signature). No preamble, no markdown, no placeholders left unfilled — use the facts provided. Around 200-240 words.",
      messages: [{ role: "user", content: "Draft the return-for-cure letter using these facts:\n\n" + facts }],
    }),
  });
  if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
  const data = await res.json();
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

function LetterModal({ letter, onClose }) {
  if (!letter) return null;
  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="lt-head">
          <h4>{letter.title} · {letter.who}</h4>
          <button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button>
        </div>
        <div className="lt-paper">
          <div className="lt-lh">
            <div className="mk">L</div>
            <div><div className="nm">Los Angeles World Airports</div><div className="ad">Human Resources · Leave Administration · 1 World Way, Los Angeles, CA 90045</div></div>
          </div>
          {letter.loading
            ? <div style={{ color: "var(--brass)", fontSize: 13 }}><span className="dot" /> <span className="dot" style={{ animationDelay: ".2s" }} /> <span className="dot" style={{ animationDelay: ".4s" }} /> Drafting from the parsed certification…</div>
            : letter.body}
        </div>
        <div className="lt-foot">
          <span className="lt-gen">{letter.ai ? "◆ Drafted by AI from parsed certification" : "◆ Filled from case data"} · held for HR signature</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 12.5 }} onClick={onClose}>Close</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 12.5 }} disabled={letter.loading}>Sign &amp; send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Certs() {
  const [parsed, setParsed] = useState(false);
  const [letter, setLetter] = useState(null);

  const genCure = async () => {
    setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", body: "", loading: true, ai: true });
    try {
      const body = await draftCureLetter();
      setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", body: body || "Draft unavailable.", loading: false, ai: true });
    } catch (e) {
      setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", loading: false, ai: true,
        body: `${fmt(TODAY)}\n\nRobert Hayes\n\nDear Mr. Hayes:\n\nThank you for submitting your certification (WH-380-F). Before we can complete our review, we need additional information. The certification does not state the probable duration of the condition or the frequency and duration of care you will provide.\n\nPlease provide the missing information within 7 calendar days, by ${fmt("2026-06-09")}. If we do not receive it, the leave may be delayed or denied.\n\nSincerely,\nHR Shared Services — Leave Administration\nLos Angeles World Airports\n\n(Note: live drafting was unavailable in this demo; in production this runs on LAWA's secured Claude tier.)` });
    }
  };

  return (
    <div className="fade">
      <h2 className="fm-h">Certification intake</h2>
      <p className="fm-sub">Upload a WH-380 or provider note. The tool extracts dates, frequency, and duration, then checks sufficiency under the regulations.</p>
      <LetterModal letter={letter} onClose={() => setLetter(null)} />

      <div className="fm-grid g2">
        <div className="fm-card">
          <div className="fm-sec-h"><h3>WH-380-F · Robert Hayes</h3>{!parsed ? <button className="fm-btn brass" onClick={() => setParsed(true)}>⤴ Upload &amp; parse</button> : <Tag c="t-red">Insufficient</Tag>}</div>
          {!parsed ? (
            <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: "34px 18px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Drop certification PDF here</div>
          ) : (
            <div className="fade">
              <div className="kv"><span className="k">Patient relationship</span><span className="v">Spouse</span></div>
              <div className="kv"><span className="k">Condition onset</span><span className="v fm-mono">2026-05-20</span></div>
              <div className="kv"><span className="k">Probable duration</span><span className="v" style={{ color: "var(--red)" }}>Not stated — §6</span></div>
              <div className="kv"><span className="k">Frequency of care</span><span className="v" style={{ color: "var(--red)" }}>Not stated</span></div>
              <div className="kv"><span className="k">Provider signature</span><span className="v">Present · 2026-05-25</span></div>
              <div className="fm-alert al-amber" style={{ marginTop: 14 }}>
                <span className="ic">⚑</span>
                <div style={{ fontSize: 12.5 }}>Certification is <strong>incomplete</strong>: missing probable duration and frequency of care. A return-for-cure letter is drafted and ready for HR to send. Employee has 7 calendar days to cure.</div>
              </div>
              <button className="fm-btn ghost" style={{ marginTop: 12 }} onClick={genCure}>Review &amp; draft cure letter →</button>
            </div>
          )}
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }}>
          <div className="fm-sec-h"><h3>How parsing works</h3><Tag c="t-grey">PHI-aware</Tag></div>
          <ol style={{ fontSize: 13, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: "var(--ink-2)" }}>
            <li>Cert is processed on a confidential, access-restricted path — medical data is kept separate from the general case file.</li>
            <li>Required fields are extracted (relationship, onset, duration, frequency, signature).</li>
            <li>Sufficiency is checked against the regulatory checklist.</li>
            <li>If incomplete, a cure letter is drafted — <strong>HR sends it</strong>.</li>
          </ol>
          <div className="guard" style={{ marginTop: 14 }}><span>◆</span> AI extracts and checks completeness. It does not judge the medical validity of the condition.</div>
        </div>
      </div>
    </div>
  );
}

function Notices() {
  const [letter, setLetter] = useState(null);
  const items = [
    { n: "Eligibility Notice", key: "elig", d: "Within 5 business days of leave request", who: "Maria Delgado", st: "Sent" },
    { n: "Rights & Responsibilities Notice", key: "rr", d: "With the eligibility notice", who: "Maria Delgado", st: "Sent" },
    { n: "Designation Notice", key: "desig", d: "Within 5 business days of sufficient cert", who: "James Okafor", st: "Ready — HR sign-off" },
    { n: "Return-for-cure Letter", key: "cure", d: "Within 5 business days of insufficient cert", who: "Robert Hayes", st: "Ready — HR sign-off" },
  ];

  const open = async (i) => {
    if (i.key === "cure") {
      setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", body: "", loading: true, ai: true });
      try {
        const body = await draftCureLetter();
        setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", body, loading: false, ai: true });
      } catch (e) {
        setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", loading: false, ai: true,
          body: `${fmt(TODAY)}\n\nRobert Hayes\n\nDear Mr. Hayes:\n\nThank you for your certification (WH-380-F). It does not state the probable duration of the condition or the frequency and duration of care you will provide. Please supply the missing information within 7 calendar days, by ${fmt("2026-06-09")}.\n\nSincerely,\nHR Shared Services — Leave Administration\nLos Angeles World Airports` });
      }
    } else {
      const t = LETTER_TEMPLATES[i.key];
      setLetter({ title: t.title, who: t.who, body: t.body, loading: false, ai: false });
    }
  };

  return (
    <div className="fade">
      <h2 className="fm-h">DOL notices</h2>
      <p className="fm-sub">The three required FMLA notices, pre-populated from case data and held for human sign-off before release.</p>
      <LetterModal letter={letter} onClose={() => setLetter(null)} />
      <div className="fm-card">
        <table className="fm-tbl">
          <thead><tr><th>Notice</th><th>Employee</th><th>Statutory timing</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.n + i.who}>
                <td className="emp">{i.n}{i.key === "cure" && <span style={{ marginLeft: 7 }}><Tag c="t-grey">AI-drafted</Tag></span>}</td>
                <td>{i.who}</td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{i.d}</td>
                <td><Tag c={i.st === "Sent" ? "t-green" : "t-amber"}>{i.st}</Tag></td>
                <td><button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => open(i)}>{i.st === "Sent" ? "View" : "Review"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="guard"><span>◆</span> Notices auto-fill from case data so deadlines aren't missed — but nothing leaves the system without an HR signature.</div>
      </div>
    </div>
  );
}

function Assistant() {
  const ctx = useRef(buildContext());
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "I'm your FMLA assistant, grounded in LAWA's live case data. Ask me about balances, deadlines, or eligibility — I'll compute and explain, but every designation stays with you." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [msgs, busy]);

  const send = async (q) => {
    const question = (q ?? input).trim();
    if (!question || busy) return;
    const history = [...msgs, { role: "u", text: question }];
    setMsgs(history); setInput(""); setBusy(true);
    try {
      const apiMsgs = history.filter((m) => m.role !== "sys").map((m) => ({ role: m.role === "u" ? "user" : "assistant", content: m.text }));
      const res = await fetch("/api/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "chat", max_tokens: 1000,
          system: ctx.current,
          messages: apiMsgs,
        }),
      });
      if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
      const data = await res.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setMsgs((m) => [...m, { role: "ai", text: text || "I couldn't generate a response just now." }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", text: "I couldn't reach the model just now — in the production build this assistant runs on LAWA's secured Claude tier." }]);
    } finally { setBusy(false); }
  };

  const chips = ["How much leave does Maria Delgado have left?", "Whose certification needs attention?", "What deadlines are in the next two weeks?", "Should I deny Dawn Pierce's leave?"];
  return (
    <div className="fade">
      <h2 className="fm-h">FMLA assistant</h2>
      <p className="fm-sub">A grounded, self-service assistant for HR staff, managers, and employees — answers without an HR ticket. This demo runs on live Claude.</p>
      <div className="chat-wrap">
        <div className="chat-log" ref={logRef}>
          {msgs.map((m, i) => (
            <div className="msg" key={i} style={{ flexDirection: m.role === "u" ? "row-reverse" : "row" }}>
              <div className={`av ${m.role === "u" ? "av-u" : "av-ai"}`}>{m.role === "u" ? "HR" : "◆"}</div>
              <div className={`bub ${m.role === "u" ? "bub-u" : "bub-ai"}`}>{m.text}</div>
            </div>
          ))}
          {busy && <div className="msg"><div className="av av-ai">◆</div><div className="bub bub-ai"><span className="dot" /> <span className="dot" style={{ animationDelay: ".2s" }} /> <span className="dot" style={{ animationDelay: ".4s" }} /></div></div>}
        </div>
        <div style={{ display: "flex", gap: 6, padding: "10px 14px 0", flexWrap: "wrap" }}>
          {chips.map((c) => <button key={c} className="chip" onClick={() => send(c)} disabled={busy}>{c}</button>)}
        </div>
        <div className="chat-in">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about a case, balance, or deadline…" />
          <button className="fm-btn brass" onClick={() => send()} disabled={busy}>Send</button>
        </div>
      </div>
      <div className="guard" style={{ marginTop: 12 }}><span>◆</span> Try the last chip — the assistant will refuse to make the call and hand the decision back to you. That boundary is the design.</div>
    </div>
  );
}

/* ---------------- shell ---------------- */
export default function App() {
  const [tab, setTab] = useState("dash");
  const [caseId, setCaseId] = useState(null);
  const go = (t, id = null) => { setTab(t); setCaseId(id); };
  const tabs = [["dash", "Dashboard"], ["cases", "Cases"], ["emp", "Roster & Hours"], ["cert", "Certifications"], ["notice", "Notices"], ["ai", "Assistant"]];
  return (
    <div className="fm-root">
      <style>{STYLES}</style>
      <div className="fm-topbar">
        <div className="fm-shell" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="fm-brand">
            <div className="fm-logo" aria-label="LAWA">
              <i style={{ height: 11, background: "var(--sky)" }} />
              <i style={{ height: 19, background: "var(--sky-2)" }} />
              <i style={{ height: 24, background: "var(--brass-2)" }} />
              <i style={{ height: 16, background: "#ffffff" }} />
              <i style={{ height: 9, background: "var(--sky)" }} />
            </div>
            <div><h1>LAWA Leave &amp; FMLA</h1><div className="sub">Los Angeles World Airports · HR Shared Services</div></div>
          </div>
          <span className="fm-poc">Proof of Concept</span>
        </div>
      </div>
      <div className="fm-pylon">
        <span style={{ background: "var(--blue)" }} /><span style={{ background: "var(--sky)" }} /><span style={{ background: "var(--sky-2)" }} /><span style={{ background: "var(--brass-2)" }} /><span style={{ background: "var(--brass)" }} /><span style={{ background: "var(--ink-2)" }} /><span style={{ background: "var(--blue)" }} />
      </div>
      <div className="fm-nav">
        <div className="fm-shell" style={{ width: "100%", display: "flex", gap: 2 }}>
          {tabs.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => go(k)}>{l}</button>)}
        </div>
      </div>
      <div className="fm-shell">
        <div className="fm-body">
          {tab === "dash" && <Dashboard go={go} />}
          {tab === "cases" && <Cases openId={caseId} go={go} />}
          {tab === "emp" && <Employees />}
          {tab === "cert" && <Certs />}
          {tab === "notice" && <Notices />}
          {tab === "ai" && <Assistant />}
        </div>
      </div>
    </div>
  );
}
