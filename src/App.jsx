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
.fm-root{font-family:'Barlow',sans-serif;color:var(--ink);background:var(--paper);min-height:100vh;-webkit-font-smoothing:antialiased;font-size:16px}
.fm-serif{font-family:'Barlow Semi Condensed',sans-serif}
.fm-mono{font-family:'IBM Plex Mono',monospace}

.fm-shell{max-width:1440px;margin:0 auto}
.fm-topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 36px;background:var(--ink);color:#eef4fb}
.fm-brand{display:flex;align-items:center;gap:15px}
.fm-logo{height:42px;border-radius:7px;background:linear-gradient(160deg,#0a2647,#14416b);display:flex;align-items:center;justify-content:center;gap:3px;padding:0 10px}
.fm-logo i{display:block;width:4px;border-radius:2px}
.fm-pylon{height:4px;display:flex}
.fm-pylon span{flex:1}
.fm-brand h1{font-family:'Barlow Semi Condensed',sans-serif;font-size:23px;font-weight:600;margin:0;letter-spacing:.2px}
.fm-brand .sub{font-size:13px;color:#9fb0bd;letter-spacing:.4px;text-transform:uppercase;margin-top:2px}
.fm-poc{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#0a2647;background:var(--brass-2);padding:4px 10px;border-radius:5px;font-weight:600}
.fm-by{font-size:12.5px;color:#9fb0bd;letter-spacing:.3px;margin-top:6px;text-align:right}
.fm-by b{color:var(--brass-2);font-weight:600}

.fm-nav{display:flex;gap:2px;padding:0 28px;background:var(--ink-2);overflow-x:auto}
.fm-nav button{background:none;border:none;color:#aebcc7;font-family:'Barlow',sans-serif;font-size:16px;font-weight:500;padding:16px 22px;cursor:pointer;border-bottom:3px solid transparent;white-space:nowrap;transition:.15s}
.fm-nav button:hover{color:#fff}
.fm-nav button.on{color:#fff;border-bottom-color:var(--brass-2)}

.fm-body{padding:34px 36px 56px}
.fm-h{font-family:'Barlow Semi Condensed',sans-serif;font-weight:600;font-size:32px;margin:0 0 4px}
.fm-sub{color:var(--muted);font-size:16px;margin:0 0 26px}

.fm-grid{display:grid;gap:20px}
.g4{grid-template-columns:repeat(4,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g2{grid-template-columns:1.4fr 1fr}
@media(max-width:960px){.g4{grid-template-columns:repeat(2,1fr)}.g3,.g2{grid-template-columns:1fr}}

.fm-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:24px}
.fm-kpi .n{font-family:'Barlow Semi Condensed',sans-serif;font-size:46px;font-weight:600;line-height:1}
.fm-kpi .l{font-size:14px;color:var(--muted);margin-top:11px;text-transform:uppercase;letter-spacing:.5px}
.fm-kpi .d{font-size:14px;margin-top:11px;font-weight:500}

.fm-tag{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:.2px}
.t-green{background:var(--green-bg);color:var(--green)}
.t-amber{background:var(--amber-bg);color:var(--amber)}
.t-red{background:var(--red-bg);color:var(--red)}
.t-blue{background:var(--blue-bg);color:var(--blue)}
.t-grey{background:#eee9de;color:var(--muted)}

.fm-sec-h{display:flex;align-items:center;justify-content:space-between;margin:0 0 16px}
.fm-sec-h h3{font-family:'Barlow Semi Condensed',sans-serif;font-size:20px;font-weight:600;margin:0}

table.fm-tbl{width:100%;border-collapse:collapse;font-size:15.5px}
.fm-tbl th{text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:var(--muted-2);font-weight:600;padding:0 12px 11px;border-bottom:1px solid var(--line)}
.fm-tbl td{padding:14px 12px;border-bottom:1px solid var(--line-2);vertical-align:middle}
.fm-tbl tr:last-child td{border-bottom:none}
.fm-tbl tr.click{cursor:pointer}
.fm-tbl tr.click:hover td{background:var(--paper-2)}
.emp{font-weight:600}
.role{font-size:14px;color:var(--muted)}

.fm-btn{font-family:'Barlow',sans-serif;font-size:15px;font-weight:600;border-radius:9px;padding:11px 19px;cursor:pointer;border:1px solid var(--ink);background:var(--ink);color:#eef4fb;transition:.15s}
.fm-btn:hover{background:var(--ink-2)}
.fm-btn.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
.fm-btn.ghost:hover{background:var(--paper-2);border-color:var(--brass)}
.fm-btn.brass{background:var(--brass);border-color:var(--brass);color:#fff}
.fm-btn.brass:hover{background:#96652f}
.fm-btn:disabled{opacity:.5;cursor:default}

.fm-alert{display:flex;gap:13px;padding:16px 17px;border-radius:10px;font-size:15px;align-items:flex-start}
.al-amber{background:var(--amber-bg);border:1px solid #ecd9a8}
.al-blue{background:var(--blue-bg);border:1px solid #c4d8e6}
.fm-alert .ic{font-size:18px;line-height:1.2}

.bar{height:11px;border-radius:7px;background:var(--line);overflow:hidden;display:flex}
.bar span{display:block;height:100%}

.drawer-bg{position:fixed;inset:0;background:rgba(22,36,47,.42);display:flex;justify-content:flex-end;z-index:50}
.drawer{width:680px;max-width:94vw;background:var(--paper);height:100%;overflow-y:auto;box-shadow:-12px 0 40px rgba(0,0,0,.18)}
.drawer-h{padding:24px 28px;border-bottom:1px solid var(--line);background:var(--card);position:sticky;top:0;z-index:2}
.drawer-c{padding:26px 28px}
.x{background:none;border:none;font-size:26px;cursor:pointer;color:var(--muted);line-height:1}

.kv{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line-2);font-size:15px}
.kv .k{color:var(--muted)}
.kv .v{font-weight:600}

.guard{display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--brass);background:var(--paper-2);border:1px dashed var(--brass-2);border-radius:9px;padding:11px 15px;margin-top:16px}

.chat-wrap{display:flex;flex-direction:column;height:640px;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.chat-log{flex:1;overflow-y:auto;padding:26px}
.msg{margin-bottom:20px;display:flex;gap:12px}
.msg .av{width:34px;height:34px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700}
.av-ai{background:linear-gradient(135deg,var(--brass-2),var(--brass));color:#0a2647}
.av-u{background:var(--ink);color:#eef4fb}
.bub{font-size:15.5px;line-height:1.6;padding:13px 17px;border-radius:11px;max-width:84%;white-space:pre-wrap}
.bub-ai{background:var(--paper-2);border:1px solid var(--line)}
.bub-u{background:var(--ink);color:#eef4fb}
.chat-in{display:flex;gap:10px;padding:17px;border-top:1px solid var(--line);background:var(--paper-2)}
.chat-in input{flex:1;border:1px solid var(--line);border-radius:9px;padding:13px 16px;font-family:'Barlow',sans-serif;font-size:15.5px;outline:none}
.chat-in input:focus{border-color:var(--brass)}
.chip{font-size:14px;border:1px solid var(--line);background:var(--card);border-radius:18px;padding:7px 14px;cursor:pointer;color:var(--ink-2)}
.chip:hover{border-color:var(--brass);color:var(--brass)}
.dot{width:6px;height:6px;border-radius:50%;background:var(--brass);display:inline-block;animation:bl 1s infinite}
@keyframes bl{0%,80%,100%{opacity:.3}40%{opacity:1}}
.fade{animation:fu .35s ease both}
@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.lt-bg{position:fixed;inset:0;background:rgba(22,36,47,.5);display:flex;align-items:flex-start;justify-content:center;z-index:60;padding:40px 16px;overflow-y:auto}
.lt-sheet{background:#fff;width:760px;max-width:96vw;border-radius:12px;box-shadow:0 24px 64px rgba(0,0,0,.32);overflow:hidden;animation:fu .3s ease both}
.lt-head{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:var(--ink);color:#eef4fb}
.lt-head h4{font-family:'Barlow Semi Condensed',sans-serif;margin:0;font-size:18px;font-weight:600}
.lt-paper{padding:44px 52px;font-size:16px;line-height:1.75;color:#1d2a34;white-space:pre-wrap;min-height:260px}
.lt-lh{display:flex;align-items:center;gap:13px;border-bottom:2px solid var(--brass);padding-bottom:15px;margin-bottom:26px}
.lt-lh .mk{width:38px;height:38px;border-radius:7px;background:linear-gradient(135deg,var(--brass-2),var(--brass));display:flex;align-items:center;justify-content:center;font-family:'Barlow Semi Condensed',sans-serif;font-weight:700;color:#0a2647;flex-shrink:0}
.lt-lh .nm{font-family:'Barlow Semi Condensed',sans-serif;font-weight:600;font-size:18px;line-height:1.15}
.lt-lh .ad{font-size:12px;color:var(--muted);letter-spacing:.3px}
.lt-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 24px;background:var(--paper-2);border-top:1px solid var(--line)}
.lt-gen{font-size:13.5px;color:var(--brass);display:flex;align-items:center;gap:7px}

.fm-foot{margin:0 36px;padding:22px 0 36px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:4px;font-size:13px;color:var(--muted-2)}
.fm-foot b{color:var(--brass);font-weight:600}
.fm-foot span:first-child{font-size:14px;color:var(--muted)}

.tour-btn{background:var(--brass-2);border:1px solid var(--brass-2);color:#0a2647;font-family:'Barlow',sans-serif;font-size:14px;font-weight:700;padding:9px 16px;border-radius:8px;cursor:pointer;white-space:nowrap;transition:.15s;animation:tourpulse 2.4s ease-in-out infinite}
.tour-btn:hover{background:#e8bd5a;border-color:#e8bd5a;animation:none}
@keyframes tourpulse{0%{box-shadow:0 0 0 0 rgba(220,174,70,.55)}70%{box-shadow:0 0 0 9px rgba(220,174,70,0)}100%{box-shadow:0 0 0 0 rgba(220,174,70,0)}}
@media(prefers-reduced-motion:reduce){.tour-btn{animation:none}}
.tour-backdrop{position:fixed;inset:0;background:rgba(10,38,71,.55);z-index:70}
.tour-catch{position:fixed;inset:0;z-index:70}
.tour-hole{position:fixed;z-index:71;border-radius:11px;border:2px solid var(--brass-2);box-shadow:0 0 0 9999px rgba(10,38,71,.55);pointer-events:none;transition:top .25s,left .25s,width .25s,height .25s}
.tour-card{position:fixed;z-index:72;background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.32);padding:18px 20px;animation:fu .25s ease both}
.tour-card .tour-step{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--brass);letter-spacing:.4px;margin-bottom:6px}
.tour-card h4{font-family:'Barlow Semi Condensed',sans-serif;font-size:18px;font-weight:600;margin:0 0 7px;color:var(--ink)}
.tour-card p{font-size:14px;line-height:1.55;color:var(--ink-2);margin:0 0 16px}
.tour-actions{display:flex;align-items:center;justify-content:space-between;gap:10px}
.tour-skip{background:none;border:none;color:var(--muted-2);font-family:'Barlow',sans-serif;font-size:13px;cursor:pointer;padding:4px}
.tour-skip:hover{color:var(--muted)}

.fm-form{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fm-field{display:flex;flex-direction:column;gap:5px}
.fm-field.fm-col2{grid-column:1 / -1}
.fm-field>span{font-size:12.5px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
.fm-field input,.fm-field select{border:1px solid var(--line);border-radius:9px;padding:11px 13px;font-family:'Barlow',sans-serif;font-size:15px;color:var(--ink);background:#fff;outline:none}
.fm-field input:focus,.fm-field select:focus{border-color:var(--brass)}
@media(max-width:640px){.fm-form{grid-template-columns:1fr}.fm-field.fm-col2{grid-column:auto}}

/* persona switch + employee self-service */
.seg{display:inline-flex;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:9px;padding:3px;gap:3px}
.seg button{background:none;border:none;color:#aebcc7;font-family:'Barlow',sans-serif;font-size:13.5px;font-weight:600;padding:7px 14px;border-radius:7px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:.15s}
.seg button.on{background:var(--brass-2);color:#0a2647}
.seg button:not(.on):hover{color:#fff}
.emp-pick{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#eef4fb;font-family:'Barlow',sans-serif;font-size:13.5px;font-weight:500;border-radius:8px;padding:8px 11px;cursor:pointer;outline:none}
.emp-pick option{color:#0a2647}

.emp-hero{background:linear-gradient(135deg,var(--ink),var(--ink-2));color:#eef4fb;border-radius:16px;padding:28px 30px;display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:22px}
.emp-hero h2{font-family:'Barlow Semi Condensed',sans-serif;font-size:28px;margin:0 0 5px;font-weight:600;color:#fff}
.emp-hero .sub2{color:#9fb0bd;font-size:15px;line-height:1.5}
.emp-ava{width:56px;height:56px;border-radius:13px;background:linear-gradient(135deg,var(--brass-2),var(--brass));color:#0a2647;display:flex;align-items:center;justify-content:center;font-family:'Barlow Semi Condensed',sans-serif;font-weight:700;font-size:22px;flex-shrink:0}
.emp-heads{display:flex;gap:14px;align-items:center}

.req-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
@media(max-width:760px){.req-grid{grid-template-columns:1fr}}
.req-card{text-align:left;width:100%;background:var(--card);border:1px solid var(--line);border-radius:13px;padding:18px 19px;cursor:pointer;transition:.15s;display:flex;gap:14px;align-items:flex-start;font-family:'Barlow',sans-serif}
.req-card:hover{border-color:var(--brass);box-shadow:0 6px 20px rgba(10,38,71,.08);transform:translateY(-1px)}
.req-card .ri{width:42px;height:42px;border-radius:10px;background:var(--blue-bg);color:var(--blue);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.req-card h4{font-family:'Barlow Semi Condensed',sans-serif;font-size:17px;margin:0 0 3px;font-weight:600;color:var(--ink)}
.req-card p{font-size:13.8px;color:var(--muted);margin:0;line-height:1.5}

.tl{position:relative;padding-left:26px;margin:4px 0 0}
.tl::before{content:'';position:absolute;left:7px;top:7px;bottom:9px;width:2px;background:var(--line)}
.tl-item{position:relative;padding:0 0 17px}
.tl-item:last-child{padding-bottom:0}
.tl-item .pt{position:absolute;left:-23px;top:3px;width:13px;height:13px;border-radius:50%;background:var(--line);border:2px solid #fff;box-shadow:0 0 0 2px var(--line)}
.tl-item.done .pt{background:var(--green);box-shadow:0 0 0 2px var(--green-bg)}
.tl-item.now .pt{background:var(--brass);box-shadow:0 0 0 2px var(--paper-2)}
.tl-item .th{font-weight:600;font-size:15px}
.tl-item.future .th{color:var(--muted)}
.tl-item .td{font-size:13.8px;color:var(--muted);margin-top:1px}

.req-row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:15px 0;border-bottom:1px solid var(--line-2)}
.req-row:last-child{border-bottom:none}
.todo{display:flex;gap:12px;align-items:flex-start;padding:13px 15px;border:1px solid var(--line);border-radius:10px;background:var(--card);margin-bottom:10px}
.todo .tk{width:26px;height:26px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}
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
const addDays = (d, n) => { const t = new Date(d + "T00:00:00"); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10); };
const statusToTag = (s) => (s === "Active" ? "t-green" : s === "Exhausting" ? "t-red" : "t-amber");

/* next FM-YYYY-#### id from the highest existing numeric suffix */
function nextCaseId(cases) {
  const year = TODAY.slice(0, 4);
  const max = cases.reduce((m, c) => Math.max(m, parseInt(c.id.split("-").pop(), 10) || 0), 0);
  return `FM-${year}-${String(max + 1).padStart(4, "0")}`;
}

/* build a compact grounding context for the live assistant */
function buildContext(cases) {
  let s = `LAWA FMLA Tracker — live case data (as of ${fmt(TODAY)}). Entitlements: standard FMLA & CFRA = 12 workweeks (480 hrs full-time); CA PDL = up to 4 months (~17.3 wks) for pregnancy disability and runs concurrent with FMLA but NOT CFRA; CFRA bonding (12 wks) begins after PDL ends; Military Caregiver FMLA = 26 weeks.\n\nCases:\n`;
  cases.forEach((c) => {
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
      <div style={{ fontSize: 13.8, color: "var(--muted)", marginTop: 5 }} className="fm-mono">
        {used} / {cap} wks used · {(cap - used).toFixed(1)} remaining
      </div>
    </div>
  );
}

/* ---------------- views ---------------- */
/* employee-request status helpers, shared by the HR and employee views */
const isPendingReq = (r) => !(r.status.startsWith("Approved") || r.status.startsWith("Denied"));
const reqStatusTag = (status) => (status.startsWith("Approved") ? "t-green" : status.startsWith("Denied") ? "t-red" : "t-amber");

/* HR reviews a change-of-status request and makes the call — approve & designate, or deny */
function RequestReviewModal({ req, c, onClose, onDecide }) {
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
          <span className="lt-gen">◆ Human designation · {fmt(TODAY)}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13, borderColor: "var(--red)", color: "var(--red)" }} onClick={() => onDecide("denied", note)}>Deny</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} onClick={() => onDecide("approved", note)}>Approve &amp; designate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ go, cases, requests = [], onReview }) {
  const [review, setReview] = useState(null);
  const deadlines = [...cases].sort((a, b) => daysFromToday(a.nextDeadline.when) - daysFromToday(b.nextDeadline.when)).slice(0, 5);
  const flags = cases.filter((c) => c.flag);
  const dueSoon = cases.filter((c) => daysFromToday(c.nextDeadline.when) <= 14).length;
  const toCure = cases.filter((c) => c.cert.state === "Insufficient").length;
  const pending = requests.filter(isPendingReq).length;
  return (
    <div className="fade">
      <h2 className="fm-h">Leave compliance overview</h2>
      <p className="fm-sub">Los Angeles World Airports · 3,200 employees · {cases.length} active cases</p>

      {review && <RequestReviewModal req={review} c={cases.find((x) => x.id === review.caseId)} onClose={() => setReview(null)} onDecide={(decision, note) => { onReview(review.id, decision, note); setReview(null); }} />}

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

function Employees({ startCase }) {
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

function Cases({ openId, go, cases, startCase }) {
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
          <div className="kv"><span className="k">Certification</span><span className="v"><Tag c={c.cert.state === "Sufficient" ? "t-green" : c.cert.state === "Insufficient" ? "t-red" : "t-grey"}>{c.cert.state}</Tag></span></div>
          <div className="kv"><span className="k">Next deadline</span><span className="v">{c.nextDeadline.what} · {fmt(c.nextDeadline.when)}</span></div>

          <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 14, background: "var(--paper-2)", padding: "12px 14px", borderRadius: 9, border: "1px solid var(--line)" }}>{c.summary}</p>

          <h4 className="fm-serif" style={{ fontSize: 16.8, margin: "18px 0 8px" }}>Designation decision</h4>
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
            ? <div style={{ color: "var(--brass)", fontSize: 15.6 }}><span className="dot" /> <span className="dot" style={{ animationDelay: ".2s" }} /> <span className="dot" style={{ animationDelay: ".4s" }} /> Drafting from the parsed certification…</div>
            : letter.body}
        </div>
        <div className="lt-foot">
          <span className="lt-gen">{letter.ai ? "◆ Drafted by AI from parsed certification" : "◆ Filled from case data"} · held for HR signature</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 15 }} onClick={onClose}>Close</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 15 }} disabled={letter.loading}>Sign &amp; send</button>
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

      <div className="fm-grid g2" data-tour="certs">
        <div className="fm-card">
          <div className="fm-sec-h"><h3>WH-380-F · Robert Hayes</h3>{!parsed ? <button className="fm-btn brass" onClick={() => setParsed(true)}>⤴ Upload &amp; parse</button> : <Tag c="t-red">Insufficient</Tag>}</div>
          {!parsed ? (
            <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: "34px 18px", textAlign: "center", color: "var(--muted)", fontSize: 15.6 }}>Drop certification PDF here</div>
          ) : (
            <div className="fade">
              <div className="kv"><span className="k">Patient relationship</span><span className="v">Spouse</span></div>
              <div className="kv"><span className="k">Condition onset</span><span className="v fm-mono">2026-05-20</span></div>
              <div className="kv"><span className="k">Probable duration</span><span className="v" style={{ color: "var(--red)" }}>Not stated — §6</span></div>
              <div className="kv"><span className="k">Frequency of care</span><span className="v" style={{ color: "var(--red)" }}>Not stated</span></div>
              <div className="kv"><span className="k">Provider signature</span><span className="v">Present · 2026-05-25</span></div>
              <div className="fm-alert al-amber" style={{ marginTop: 14 }}>
                <span className="ic">⚑</span>
                <div style={{ fontSize: 15 }}>Certification is <strong>incomplete</strong>: missing probable duration and frequency of care. A return-for-cure letter is drafted and ready for HR to send. Employee has 7 calendar days to cure.</div>
              </div>
              <button className="fm-btn ghost" style={{ marginTop: 12 }} onClick={genCure}>Review &amp; draft cure letter →</button>
            </div>
          )}
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }}>
          <div className="fm-sec-h"><h3>How parsing works</h3><Tag c="t-grey">PHI-aware</Tag></div>
          <ol style={{ fontSize: 15.6, lineHeight: 1.7, paddingLeft: 18, margin: 0, color: "var(--ink-2)" }}>
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
      <div className="fm-card" data-tour="notices">
        <table className="fm-tbl">
          <thead><tr><th>Notice</th><th>Employee</th><th>Statutory timing</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.n + i.who}>
                <td className="emp">{i.n}{i.key === "cure" && <span style={{ marginLeft: 7 }}><Tag c="t-grey">AI-drafted</Tag></span>}</td>
                <td>{i.who}</td>
                <td style={{ fontSize: 14.4, color: "var(--muted)" }}>{i.d}</td>
                <td><Tag c={i.st === "Sent" ? "t-green" : "t-amber"}>{i.st}</Tag></td>
                <td><button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 14.4 }} onClick={() => open(i)}>{i.st === "Sent" ? "View" : "Review"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="guard"><span>◆</span> Notices auto-fill from case data so deadlines aren't missed — but nothing leaves the system without an HR signature.</div>
      </div>
    </div>
  );
}

function Assistant({ cases }) {
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
          system: buildContext(cases),
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
      <div className="chat-wrap" data-tour="assistant">
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

/* ---------------- new case form ---------------- */
const LEAVE_OPTIONS = ["FMLA", "CFRA", "PDL (CA)", "FMLA (Military Caregiver — 26 wk)"];

function NewCaseModal({ draft, cases, onClose, onSave }) {
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
      opened: TODAY, leaves: f.leaves, flag: null,
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
          <span className="lt-gen">◆ {draft.name ? "Imported from roster" : "Manual intake"} · recorded under the signed-in HR user</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13 }} onClick={onClose}>Cancel</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} disabled={!valid} onClick={save}>Create case</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Employee self-service portal
   The same case data, seen from the employee's side. Employees
   submit information and changes of status; HR makes every
   designation. AI explains; it never decides.
   ============================================================ */

/* employee-scoped grounding for the live assistant */
function buildEmployeeContext(c) {
  const cap = c.mcgw ? 26 : 12;
  return `You are the LAWA employee leave assistant. You are speaking directly to ${c.name}, ${c.role} in ${c.dept}, about THEIR OWN leave (case ${c.id}). Today is ${fmt(TODAY)}.

Their leave — Reason: ${c.reason}. Type: ${c.type}. Status: ${c.status}. Programs that apply: ${c.leaves.join(", ")}.
Balances — FMLA used ${c.used.fmla} of ${cap} weeks${c.used.pdl ? `; California PDL used ${c.used.pdl} of ~17.3 weeks` : ""}${c.used.cfra ? `; CFRA used ${c.used.cfra} of 12 weeks` : ""}.
Certification: ${c.cert.state}. Next thing on their calendar: ${c.nextDeadline.what} on ${fmt(c.nextDeadline.when)}.
Context: ${c.summary}

Rules you can explain in plain language: FMLA and CFRA each provide up to 12 workweeks (480 hours full-time) of job-protected leave in the applicable 12-month period; group health benefits continue during leave on the same terms; on return the employee is restored to the same or an equivalent position. In California, Pregnancy Disability Leave (PDL) provides up to four months while the employee is disabled by pregnancy or childbirth and runs at the same time as FMLA but NOT CFRA; CFRA bonding (up to 12 weeks) begins after the disability period ends and must be taken within 12 months of the birth or placement. Military caregiver leave under FMLA is up to 26 weeks in a single 12-month period.

How to behave: warm, plain-spoken, reassuring. Explain balances, dates, rights, and what to expect. Help them understand their options for a change of status — extending leave, returning to work, switching schedule, or reporting a birth/placement. You must NEVER approve, deny, or designate leave, and never promise an outcome — those are decisions HR makes. If they ask you to decide, explain the options and tell them HR will review and confirm, and that they can submit the change from the "Request a Change" page. Keep answers short and concrete. Don't give legal advice; for their specific situation, point them to HR Shared Services.`;
}

/* which changes of status this employee can submit — gated by their leave */
function changeTypesFor(c) {
  const bonding = c.stack || /bond|pregnan|baby|child|adopt|placement/i.test(c.reason);
  const t = [];
  if (bonding)
    t.push({ key: "lifeEvent", icon: "⊕", title: "Report a birth, placement, or adoption", blurb: "Tell us your child has arrived so HR can move your leave from pregnancy disability to bonding." });
  if (c.type === "Intermittent")
    t.push({ key: "absence", icon: "⏱", title: "Report an intermittent absence", blurb: "Log time used for a qualifying episode. Hours draw down your 12-week (480-hour) bank." });
  t.push({ key: "extend", icon: "⤺", title: "Request to extend my leave", blurb: "Ask for additional time. An updated medical certification is usually required." });
  if (c.type !== "Intermittent")
    t.push({ key: "schedule", icon: "⇄", title: "Change my leave schedule", blurb: "Move between continuous and intermittent / reduced-schedule leave when it's medically needed." });
  t.push({ key: "rtw", icon: "➜", title: "Plan my return to work", blurb: "Share your intended return date. A fitness-for-duty note may be required first." });
  t.push({ key: "contact", icon: "✎", title: "Update my contact information", blurb: "Keep your phone, email, and address current so notices reach you." });
  return t;
}

/* the employee's leave journey, drawn from their case */
function planFor(c) {
  const items = [{ state: "done", h: "Leave opened", d: fmt(c.opened) }];
  if (c.used.pdl > 0) {
    items.push({ state: "now", h: "Pregnancy disability leave (CA PDL)", d: `Up to ~17.3 weeks while you're disabled · ${c.used.pdl} used` });
    items.push({ state: "future", h: "Transition to CFRA bonding", d: `Begins once your provider clears you · target ${fmt(c.nextDeadline.when)}` });
    items.push({ state: "future", h: "CFRA bonding leave", d: "Up to 12 weeks · must finish within 12 months of the birth" });
  } else {
    items.push({ state: "now", h: `${c.type} leave in progress`, d: `${c.used.fmla} of ${c.mcgw ? 26 : 12} weeks used` });
    items.push({ state: "future", h: c.nextDeadline.what, d: fmt(c.nextDeadline.when) });
  }
  items.push({ state: "future", h: "Return to work", d: "Restored to the same or an equivalent position" });
  return items;
}

/* concrete to-dos for the employee, derived from their case */
function todosFor(c, myReqs) {
  const t = [];
  if (c.cert.state === "Insufficient")
    t.push({ tone: "t-red", what: "Your certification is missing required details. Submit the missing information before the cure deadline.", when: c.nextDeadline.when });
  else if (c.cert.state === "Pending")
    t.push({ tone: "t-amber", what: "Return your medical certification (WH-380) so HR can complete its review.", when: c.nextDeadline.when });
  const dd = daysFromToday(c.nextDeadline.when);
  if (c.cert.state !== "Insufficient" && c.cert.state !== "Pending" && dd <= 21)
    t.push({ tone: dd <= 7 ? "t-red" : "t-amber", what: c.nextDeadline.what, when: c.nextDeadline.when });
  if (!myReqs.length)
    t.push({ tone: "t-blue", what: "Need to change something — extend, return, or report a birth? Use “Request a Change.”", when: null });
  return t;
}

function EmpHome({ c, myReqs, go }) {
  const cap = c.mcgw ? 26 : 12;
  const remaining = (cap - c.used.fmla).toFixed(1);
  const todos = todosFor(c, myReqs);
  const plan = planFor(c);
  return (
    <div className="fade">
      <div className="emp-hero">
        <div className="emp-heads">
          <div className="emp-ava">{c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
          <div>
            <h2>Hi, {c.name.split(" ")[0]}</h2>
            <div className="sub2">{c.role} · {c.dept}<br />Your leave is <strong style={{ color: "#fff" }}>{c.status.toLowerCase()}</strong> — case <span className="fm-mono">{c.id}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {c.leaves.map((l) => <Tag key={l} c="t-blue">{l}</Tag>)}
        </div>
      </div>

      <div className="fm-grid g3" style={{ marginBottom: 22 }}>
        <div className="fm-card fm-kpi"><div className="n">{remaining}</div><div className="l">Weeks remaining</div><div className="d" style={{ color: "var(--muted)" }}>of {cap} protected weeks</div></div>
        <div className="fm-card fm-kpi"><div className="n" style={{ fontSize: 30, lineHeight: 1.15, paddingTop: 6 }}>{fmt(c.nextDeadline.when)}</div><div className="l">{c.nextDeadline.what}</div><div className="d" style={{ color: daysFromToday(c.nextDeadline.when) <= 7 ? "var(--red)" : "var(--amber)" }}>{daysFromToday(c.nextDeadline.when)} days away</div></div>
        <div className="fm-card fm-kpi"><div className="n" style={{ fontSize: 30, lineHeight: 1.15, paddingTop: 6 }}>{c.cert.state}</div><div className="l">Certification</div><div className="d" style={{ color: c.cert.state === "Sufficient" || c.cert.state === "Not required" ? "var(--green)" : "var(--red)" }}>{c.cert.state === "Sufficient" || c.cert.state === "Not required" ? "Nothing needed from you" : "Action needed"}</div></div>
      </div>

      <div className="fm-grid g2">
        <div>
          <div className="fm-card" style={{ marginBottom: 20 }}>
            <div className="fm-sec-h"><h3>What you need to do</h3></div>
            {todos.length ? todos.map((t, i) => (
              <div className="todo" key={i}>
                <div className={`tk fm-tag ${t.tone}`} style={{ borderRadius: 7 }}>{t.tone === "t-red" ? "!" : t.tone === "t-blue" ? "◆" : "•"}</div>
                <div style={{ fontSize: 15, lineHeight: 1.5 }}>{t.what}{t.when && <div className="fm-mono" style={{ fontSize: 13.4, color: "var(--muted)", marginTop: 3 }}>By {fmt(t.when)}</div>}</div>
              </div>
            )) : <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>You're all caught up — nothing needs your attention right now.</p>}
            <button className="fm-btn brass" style={{ marginTop: 6 }} onClick={() => go("request")}>Request a change of status →</button>
          </div>

          <div className="fm-card">
            <div className="fm-sec-h"><h3>Your leave balance</h3><Tag c="t-grey">Live</Tag></div>
            <div style={{ marginBottom: c.used.pdl || c.used.cfra ? 14 : 0 }}>
              <div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>{c.mcgw ? "FMLA — Military Caregiver (26 wk)" : "FMLA (12 wk)"}</div>
              <StatBar used={c.used.fmla} cap={cap} color={c.statusTag === "t-red" ? "var(--red)" : "var(--green)"} />
            </div>
            {c.used.pdl > 0 && <div style={{ marginBottom: 14 }}><div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>CA PDL (up to ~17.3 wk)</div><StatBar used={c.used.pdl} cap={17.3} color="var(--blue)" /></div>}
            {c.used.cfra > 0 && <div><div style={{ fontSize: 14.4, fontWeight: 600, marginBottom: 6 }}>CFRA (12 wk)</div><StatBar used={c.used.cfra} cap={12} color="var(--brass)" /></div>}
            <div className="guard" style={{ marginTop: 14 }}><span>◆</span> Your health benefits continue while you're out, and you're entitled to return to the same or an equivalent job.</div>
          </div>
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }}>
          <div className="fm-sec-h"><h3>Your leave plan</h3></div>
          <div className="tl">
            {plan.map((p, i) => (
              <div key={i} className={`tl-item ${p.state}`}><span className="pt" /><div className="th">{p.h}</div><div className="td">{p.d}</div></div>
            ))}
          </div>
          <p style={{ fontSize: 14.6, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 16, background: "var(--card)", padding: "12px 14px", borderRadius: 9, border: "1px solid var(--line)" }}>{c.summary}</p>
        </div>
      </div>
    </div>
  );
}

/* per-type request form */
function ChangeRequestModal({ type, c, onClose, onSubmit }) {
  const today = TODAY;
  const init = {
    lifeEvent: { event: "Birth", eventDate: today },
    absence: { absDate: today, hours: "8", note: "" },
    extend: { returnDate: addDays(today, 30), why: "" },
    schedule: { to: c.type === "Intermittent" ? "Continuous" : "Intermittent", frequency: "" },
    rtw: { returnDate: addDays(today, 14), accommodation: "" },
    contact: { phone: "", email: "", address: "" },
  }[type.key];
  const [f, setF] = useState(init);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const meta = {
    lifeEvent: { note: "Reporting your child's arrival lets HR move you from pregnancy disability leave (PDL) to CFRA bonding leave — up to 12 weeks, to be taken within 12 months of the birth. HR will issue an updated designation notice.", valid: !!f.eventDate },
    absence: { note: "Each reported episode draws hours from your 480-hour FMLA bank once HR confirms it. Reporting promptly keeps your record accurate and protects the absence.", valid: !!f.absDate && Number(f.hours) > 0 },
    extend: { note: "Extensions beyond your current entitlement are reviewed by HR and usually need an updated medical certification. If your protected leave is exhausted, HR may explore other options with you, such as an ADA accommodation.", valid: !!f.returnDate },
    schedule: { note: "Intermittent or reduced-schedule leave is available when it's medically necessary. HR will request a certification describing the expected frequency and duration before confirming the change.", valid: true },
    rtw: { note: "For your own serious health condition, HR may require a fitness-for-duty certification before you return. You're entitled to be restored to the same or an equivalent position.", valid: !!f.returnDate },
    contact: { note: "We use this to send your eligibility, rights, and designation notices. Updating it here doesn't change your leave — it just keeps your file current.", valid: !!(f.phone || f.email || f.address) },
  }[type.key];

  const summarize = () => ({
    lifeEvent: `${f.event} reported, event date ${fmt(f.eventDate)} — requesting transition to CFRA bonding leave.`,
    absence: `Intermittent absence on ${fmt(f.absDate)}, ${f.hours} hour(s)${f.note ? ` — ${f.note}` : ""}.`,
    extend: `Requesting to extend leave; intended return ${fmt(f.returnDate)}${f.why ? ` — ${f.why}` : ""}.`,
    schedule: `Requesting change to ${f.to} leave${f.frequency ? ` — proposed frequency: ${f.frequency}` : ""}.`,
    rtw: `Planning return to work on ${fmt(f.returnDate)}${f.accommodation ? ` — accommodation note: ${f.accommodation}` : ""}.`,
    contact: `Updated contact details: ${[f.phone && `phone ${f.phone}`, f.email && `email ${f.email}`, f.address && `address ${f.address}`].filter(Boolean).join("; ")}.`,
  }[type.key]);

  const submit = () => meta.valid && onSubmit({ caseId: c.id, empName: c.name, type: type.key, title: type.title, detail: summarize() });

  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" style={{ width: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="lt-head"><h4>{type.title}</h4><button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button></div>
        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>
          <div className="fm-form">
            {type.key === "lifeEvent" && <>
              <label className="fm-field"><span>Event</span><select value={f.event} onChange={(e) => set("event", e.target.value)}><option>Birth</option><option>Adoption</option><option>Foster placement</option></select></label>
              <label className="fm-field"><span>Event date</span><input type="date" value={f.eventDate} onChange={(e) => set("eventDate", e.target.value)} /></label>
            </>}
            {type.key === "absence" && <>
              <label className="fm-field"><span>Absence date</span><input type="date" value={f.absDate} onChange={(e) => set("absDate", e.target.value)} /></label>
              <label className="fm-field"><span>Hours used</span><input type="number" min="1" max="12" value={f.hours} onChange={(e) => set("hours", e.target.value)} /></label>
              <label className="fm-field fm-col2"><span>Note <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></span><input value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="e.g. migraine episode, left mid-shift" /></label>
            </>}
            {type.key === "extend" && <>
              <label className="fm-field"><span>New intended return date</span><input type="date" value={f.returnDate} onChange={(e) => set("returnDate", e.target.value)} /></label>
              <label className="fm-field fm-col2"><span>Reason for the extension</span><input value={f.why} onChange={(e) => set("why", e.target.value)} placeholder="e.g. provider extended recovery by 3 weeks" /></label>
            </>}
            {type.key === "schedule" && <>
              <label className="fm-field"><span>Change to</span><select value={f.to} onChange={(e) => set("to", e.target.value)}><option>Intermittent</option><option>Reduced schedule</option><option>Continuous</option></select></label>
              <label className="fm-field fm-col2"><span>Expected frequency / duration</span><input value={f.frequency} onChange={(e) => set("frequency", e.target.value)} placeholder="e.g. about 2 days per month, up to 1 day each" /></label>
            </>}
            {type.key === "rtw" && <>
              <label className="fm-field"><span>Intended return date</span><input type="date" value={f.returnDate} onChange={(e) => set("returnDate", e.target.value)} /></label>
              <label className="fm-field fm-col2"><span>Any accommodation you'll need <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>(optional)</span></span><input value={f.accommodation} onChange={(e) => set("accommodation", e.target.value)} placeholder="e.g. lifting restriction for first 2 weeks" /></label>
            </>}
            {type.key === "contact" && <>
              <label className="fm-field"><span>Phone</span><input value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(###) ###-####" /></label>
              <label className="fm-field"><span>Email</span><input value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="name@example.com" /></label>
              <label className="fm-field fm-col2"><span>Mailing address</span><input value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, city, state, ZIP" /></label>
            </>}
          </div>
          <div className="guard" style={{ marginTop: 18 }}><span>◆</span> {meta.note}</div>
        </div>
        <div className="lt-foot">
          <span className="lt-gen">◆ Goes to HR Shared Services for review · you'll see the status here</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 13 }} onClick={onClose}>Cancel</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 13 }} disabled={!meta.valid} onClick={submit}>Submit to HR</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmpRequest({ c, myReqs, onSubmit }) {
  const [active, setActive] = useState(null);
  const types = changeTypesFor(c);
  return (
    <div className="fade">
      <h2 className="fm-h">Request a change of status</h2>
      <p className="fm-sub">Tell HR what's changing — a birth, a longer recovery, a return date. You submit the request; HR reviews it and confirms the designation.</p>

      <div className="req-grid" style={{ marginBottom: 22 }}>
        {types.map((t) => (
          <button key={t.key} className="req-card" onClick={() => setActive(t)}>
            <span className="ri">{t.icon}</span>
            <span><h4>{t.title}</h4><p>{t.blurb}</p></span>
          </button>
        ))}
      </div>

      <div className="fm-card">
        <div className="fm-sec-h"><h3>Your requests</h3><Tag c="t-grey">{myReqs.length} submitted</Tag></div>
        {myReqs.length ? (
          <div>
            {myReqs.map((r) => (
              <div className="req-row" key={r.id}>
                <div>
                  <div className="emp">{r.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{r.detail}</div>
                  <div className="fm-mono" style={{ fontSize: 13, color: "var(--muted-2)", marginTop: 3 }}>{r.id} · submitted {fmt(r.submitted)}{r.decidedOn ? ` · decided ${fmt(r.decidedOn)}` : ""}</div>
                  {r.note && <div style={{ fontSize: 13.6, color: "var(--ink-2)", marginTop: 4, fontStyle: "italic" }}>HR note: {r.note}</div>}
                </div>
                <Tag c={reqStatusTag(r.status)}>{r.status}</Tag>
              </div>
            ))}
          </div>
        ) : <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>You haven't submitted any requests yet. Pick a change above to get started.</p>}
        <div className="guard" style={{ marginTop: 16 }}><span>◆</span> Submitting a request never changes your leave on its own. HR reviews every request and makes the official designation — the AI here only helps you understand your options.</div>
      </div>

      {active && <ChangeRequestModal type={active} c={c} onClose={() => setActive(null)} onSubmit={(r) => { onSubmit(r); setActive(null); }} />}
    </div>
  );
}

function EmpTime({ c, myReqs, onSubmit }) {
  const [open, setOpen] = useState(false);
  const absences = myReqs.filter((r) => r.type === "absence");
  const pendingHrs = absences.filter(isPendingReq).reduce((s, r) => s + (parseFloat((r.detail.match(/, ([\d.]+) hour/) || [])[1]) || 0), 0);
  const absType = changeTypesFor(c).find((t) => t.key === "absence");
  return (
    <div className="fade">
      <h2 className="fm-h">Report time</h2>
      <p className="fm-sub">Your leave is intermittent — log each qualifying absence so it's protected and counted correctly against your bank.</p>

      <div className="fm-grid g3" style={{ marginBottom: 20 }}>
        <div className="fm-card fm-kpi"><div className="n">{c.used.fmla}</div><div className="l">Weeks used (confirmed)</div><div className="d" style={{ color: "var(--muted)" }}>of 12 · HR-confirmed</div></div>
        <div className="fm-card fm-kpi"><div className="n">{absences.length}</div><div className="l">Absences you've reported</div><div className="d" style={{ color: "var(--amber)" }}>{pendingHrs} hrs awaiting HR confirmation</div></div>
        <div className="fm-card fm-kpi"><div className="n">{(12 - c.used.fmla).toFixed(1)}</div><div className="l">Weeks remaining</div><div className="d" style={{ color: "var(--green)" }}>protected time left</div></div>
      </div>

      <div className="fm-card">
        <div className="fm-sec-h"><h3>Reported absences</h3>{absType && <button className="fm-btn brass" onClick={() => setOpen(true)}>+ Report an absence</button>}</div>
        {absences.length ? (
          <table className="fm-tbl">
            <thead><tr><th>Reported</th><th>Details</th><th>Status</th></tr></thead>
            <tbody>
              {absences.map((r) => (
                <tr key={r.id}><td className="fm-mono">{fmt(r.submitted)}</td><td>{r.detail}</td><td><Tag c={reqStatusTag(r.status)}>{r.status}</Tag></td></tr>
              ))}
            </tbody>
          </table>
        ) : <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: "30px 18px", textAlign: "center", color: "var(--muted)", fontSize: 15.4 }}>No absences reported yet. Use “Report an absence” after a qualifying episode.</div>}
        <div className="guard" style={{ marginTop: 16 }}><span>◆</span> Reported hours are held as pending until HR confirms them against your certification — your official balance only moves on HR's review.</div>
      </div>

      {open && absType && <ChangeRequestModal type={absType} c={c} onClose={() => setOpen(false)} onSubmit={(r) => { onSubmit(r); setOpen(false); }} />}
    </div>
  );
}

/* notices the employee has received, keyed off the existing HR templates */
const EMP_NOTICES = {
  "FM-2026-0148": [{ key: "elig" }, { key: "rr" }],
  "FM-2026-0151": [{ key: "desig" }],
};

function EmpDocuments({ c }) {
  const [letter, setLetter] = useState(null);
  const [certSent, setCertSent] = useState(false);
  const notices = EMP_NOTICES[c.id] || [];
  const open = (key) => { const t = LETTER_TEMPLATES[key]; setLetter({ title: t.title, who: t.who, body: t.body, loading: false, ai: false }); };
  const needsCert = c.cert.state === "Pending" || c.cert.state === "Insufficient";
  return (
    <div className="fade">
      <h2 className="fm-h">My documents</h2>
      <p className="fm-sub">The notices HR has sent you, and the certifications you need to provide. Medical certifications go through a confidential channel, kept separate from your general file.</p>
      <LetterModal letter={letter} onClose={() => setLetter(null)} />

      <div className="fm-grid g2">
        <div className="fm-card">
          <div className="fm-sec-h"><h3>Notices from HR</h3><Tag c="t-grey">{notices.length}</Tag></div>
          {notices.length ? (
            <table className="fm-tbl">
              <thead><tr><th>Notice</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {notices.map((n) => {
                  const t = LETTER_TEMPLATES[n.key];
                  return <tr key={n.key}><td className="emp">{t.title}</td><td><Tag c="t-green">Received</Tag></td><td style={{ textAlign: "right" }}><button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => open(n.key)}>View</button></td></tr>;
                })}
              </tbody>
            </table>
          ) : <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>Your eligibility and designation notices will appear here once HR issues them.</p>}
        </div>

        <div className="fm-card" style={{ background: "var(--paper-2)" }}>
          <div className="fm-sec-h"><h3>Your certification</h3><Tag c={c.cert.state === "Sufficient" ? "t-green" : c.cert.state === "Insufficient" ? "t-red" : "t-grey"}>{c.cert.state}</Tag></div>
          {needsCert ? (
            certSent ? (
              <div className="fm-alert al-blue"><span className="ic">◎</span><div style={{ fontSize: 15.4 }}>Thanks — your certification was received through the confidential channel. HR will review it for completeness and follow up if anything's missing.</div></div>
            ) : (
              <>
                <div style={{ border: "1.5px dashed var(--line)", borderRadius: 10, padding: "28px 18px", textAlign: "center", color: "var(--muted)", fontSize: 15.4 }}>Drop your medical certification (WH-380) here</div>
                <button className="fm-btn brass" style={{ marginTop: 12 }} onClick={() => setCertSent(true)}>⤴ Upload certification</button>
                {c.cert.state === "Insufficient" && <div className="fm-alert al-amber" style={{ marginTop: 12 }}><span className="ic">⚑</span><div style={{ fontSize: 15 }}>HR flagged your certification as incomplete{c.cert.note ? ` — ${c.cert.note}` : ""}. Please provide the missing details before the cure deadline on {fmt(c.nextDeadline.when)}.</div></div>}
              </>
            )
          ) : (
            <div className="fm-alert al-blue"><span className="ic">◎</span><div style={{ fontSize: 15.4 }}>{c.cert.state === "Not required" ? "No medical certification is required for this type of leave." : "Your certification is on file and complete — nothing more is needed from you right now."}</div></div>
          )}
          <div className="guard" style={{ marginTop: 14 }}><span>◆</span> Your medical information is processed on a confidential, access-restricted path and kept separate from your general case file.</div>
        </div>
      </div>
    </div>
  );
}

function EmpAssistant({ c }) {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: `Hi ${c.name.split(" ")[0]} — I'm your leave assistant. Ask me anything about your own leave: how much time you have left, what happens to your benefits, or how a change of status works. I'll explain your options, but HR makes every official decision.` },
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
      const apiMsgs = history.map((m) => ({ role: m.role === "u" ? "user" : "assistant", content: m.text }));
      const res = await fetch("/api/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "chat", max_tokens: 1000, system: buildEmployeeContext(c), messages: apiMsgs }),
      });
      if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
      const data = await res.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setMsgs((m) => [...m, { role: "ai", text: text || "I couldn't generate a response just now." }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "ai", text: "I couldn't reach the assistant just now — in the production build this runs on LAWA's secured Claude tier." }]);
    } finally { setBusy(false); }
  };

  const chips = [
    "How many weeks of leave do I have left?",
    "What happens to my health insurance while I'm out?",
    c.stack ? "How does my disability leave turn into bonding leave?" : "Will I get my same job back when I return?",
    "Can I extend my leave if I need more time?",
  ];
  return (
    <div className="fade">
      <h2 className="fm-h">Ask a question</h2>
      <p className="fm-sub">A private assistant grounded in your own leave details — answers in plain language, any time, without waiting on an HR ticket.</p>
      <div className="chat-wrap">
        <div className="chat-log" ref={logRef}>
          {msgs.map((m, i) => (
            <div className="msg" key={i} style={{ flexDirection: m.role === "u" ? "row-reverse" : "row" }}>
              <div className={`av ${m.role === "u" ? "av-u" : "av-ai"}`}>{m.role === "u" ? c.name.split(" ").map((w) => w[0]).join("").slice(0, 2) : "◆"}</div>
              <div className={`bub ${m.role === "u" ? "bub-u" : "bub-ai"}`}>{m.text}</div>
            </div>
          ))}
          {busy && <div className="msg"><div className="av av-ai">◆</div><div className="bub bub-ai"><span className="dot" /> <span className="dot" style={{ animationDelay: ".2s" }} /> <span className="dot" style={{ animationDelay: ".4s" }} /></div></div>}
        </div>
        <div style={{ display: "flex", gap: 6, padding: "10px 14px 0", flexWrap: "wrap" }}>
          {chips.map((c2) => <button key={c2} className="chip" onClick={() => send(c2)} disabled={busy}>{c2}</button>)}
        </div>
        <div className="chat-in">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about your leave, benefits, or a change of status…" />
          <button className="fm-btn brass" onClick={() => send()} disabled={busy}>Send</button>
        </div>
      </div>
      <div className="guard" style={{ marginTop: 12 }}><span>◆</span> The assistant explains your rights and options — it will never approve, deny, or designate your leave. Those decisions are always made by HR.</div>
    </div>
  );
}

function EmployeePortal({ c, eTab, setETab, requests, onSubmit }) {
  const myReqs = requests.filter((r) => r.caseId === c.id);
  const tabs = [["myleave", "My Leave"], ["request", "Request a Change"], ...(c.type === "Intermittent" ? [["time", "Report Time"]] : []), ["documents", "My Documents"], ["help", "Ask a Question"]];
  return (
    <>
      <div className="fm-nav">
        <div className="fm-shell" style={{ width: "100%", display: "flex", gap: 2 }}>
          {tabs.map(([k, l]) => <button key={k} className={eTab === k ? "on" : ""} onClick={() => setETab(k)}>{l}</button>)}
        </div>
      </div>
      <div className="fm-shell">
        <div className="fm-body">
          {eTab === "myleave" && <EmpHome c={c} myReqs={myReqs} go={setETab} />}
          {eTab === "request" && <EmpRequest c={c} myReqs={myReqs} onSubmit={onSubmit} />}
          {eTab === "time" && <EmpTime c={c} myReqs={myReqs} onSubmit={onSubmit} />}
          {eTab === "documents" && <EmpDocuments c={c} />}
          {eTab === "help" && <EmpAssistant c={c} />}
        </div>
      </div>
    </>
  );
}

/* ---------------- guided tour ---------------- */
const TOUR = [
  { tab: "dash", target: null, title: "Welcome to LAWA Leave & FMLA", body: "A 60-second tour of how HR runs federal FMLA stacked with California CFRA & PDL — with AI assisting and humans making every call. Use Next / Back, ← → keys, or Esc to exit." },
  { tab: "dash", target: "kpis", title: "Compliance at a glance", body: "Live counts of active cases, deadlines inside 14 days, certifications to cure, and employees approaching eligibility — all computed from case data, not hand-tracked." },
  { tab: "dash", target: "ai-flags", title: "AI surfaces, HR decides", body: "The AI flags patterns and risks for review — an absence cluster, an incomplete cert, a nearly-exhausted entitlement. It never makes a designation; that stays with HR." },
  { tab: "cases", target: "cases-table", title: "Stacked leave, tracked", body: "Each case stacks FMLA, CFRA and PDL where they apply. Click any row to open the balance engine and the designation decision — recorded under the signed-in HR user." },
  { tab: "cases", target: "new-case", title: "Create or import a case", body: "Open a new case from scratch here — or import one by promoting an employee from the Roster tab, which prefills their details." },
  { tab: "emp", target: "roster", title: "Eligibility from a Workday export", body: "No HRIS integration: the 1,250-hour / 12-month test runs on an uploaded payroll export. Hit “Start case” on a row to import that employee into a new case." },
  { tab: "cert", target: "certs", title: "Certification intake", body: "Upload a WH-380; the tool extracts dates, frequency and duration, checks sufficiency, and — if it’s incomplete — drafts a return-for-cure letter for HR to send." },
  { tab: "notice", target: "notices", title: "DOL notices, ready to sign", body: "The required FMLA notices pre-fill from case data so statutory deadlines aren’t missed — but nothing leaves the system without an HR signature." },
  { tab: "ai", target: "assistant", title: "A grounded assistant", body: "Ask about balances, deadlines or eligibility and get answers grounded in live case data. Ask it to deny a leave and it hands the decision back to you — that boundary is the design." },
  { tab: "ai", target: "persona", title: "Two doors, one system", body: "Switch between the HR console and the employee’s own self-service portal here. Employees submit a change of status — a birth, a return date, an extension — and it lands back on this dashboard for HR to designate." },
  { tab: "ai", target: null, title: "That’s the tour", body: "AI does the busywork — parsing, drafting, flagging, computing. Every designation stays with HR; employees self-serve and request, HR decides. Explore freely, or restart the tour any time from the top bar." },
];

function Tour({ step, setStep, onClose }) {
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

/* ---------------- shell ---------------- */
export default function App() {
  const [tab, setTab] = useState("dash");
  const [caseId, setCaseId] = useState(null);
  const [cases, setCases] = useState(CASES);
  const [draft, setDraft] = useState(null); // null = closed; object = open (optionally prefilled)
  const [tourStep, setTourStep] = useState(-1); // -1 = inactive
  const [persona, setPersona] = useState("hr"); // hr | emp
  const [empId, setEmpId] = useState(CASES[0].id); // which employee the self-service portal is scoped to
  const [eTab, setETab] = useState("myleave");
  const [requests, setRequests] = useState([]); // changes of status submitted from the employee portal
  const go = (t, id = null) => { setTab(t); setCaseId(id); };
  const startCase = (prefill = {}) => setDraft(prefill);
  const startTour = () => { setPersona("hr"); setTourStep(0); };
  const closeTour = () => { try { localStorage.setItem("lawaTourSeen", "1"); } catch (e) {} setTourStep(-1); };
  useEffect(() => { if (tourStep >= 0) { setPersona("hr"); setTab(TOUR[tourStep].tab); setCaseId(null); setDraft(null); } }, [tourStep]);
  useEffect(() => { try { if (!localStorage.getItem("lawaTourSeen")) setTourStep(0); } catch (e) {} }, []);
  const saveCase = (newCase) => { setCases((cs) => [...cs, newCase]); setDraft(null); go("cases", newCase.id); };
  const submitRequest = (req) => setRequests((rs) => [{ ...req, id: `REQ-${String(rs.length + 1).padStart(4, "0")}`, submitted: TODAY, status: "Submitted — awaiting HR review" }, ...rs]);
  const reviewRequest = (id, decision, note) => setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, decision, note: note || "", decidedOn: TODAY, status: decision === "approved" ? "Approved by HR" : "Denied by HR" } : r)));
  const empCase = cases.find((c) => c.id === empId) || cases[0];
  const tabs = [["dash", "Dashboard"], ["cases", "Cases"], ["emp", "Roster & Hours"], ["cert", "Certifications"], ["notice", "Notices"], ["ai", "Assistant"]];
  return (
    <div className="fm-root">
      <style>{STYLES}</style>
      <div className="fm-topbar">
        <div className="fm-shell" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="fm-brand">
            <div className="fm-logo" aria-label="LAWA">
              <i style={{ height: 14, background: "var(--sky)" }} />
              <i style={{ height: 24, background: "var(--sky-2)" }} />
              <i style={{ height: 30, background: "var(--brass-2)" }} />
              <i style={{ height: 20, background: "#ffffff" }} />
              <i style={{ height: 11, background: "var(--sky)" }} />
            </div>
            <div><h1>LAWA Leave &amp; FMLA</h1><div className="sub">Los Angeles World Airports · {persona === "emp" ? "Employee Self-Service" : "HR Shared Services"}</div></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="seg" data-tour="persona">
              <button className={persona === "hr" ? "on" : ""} onClick={() => setPersona("hr")}>⬡ HR Console</button>
              <button className={persona === "emp" ? "on" : ""} onClick={() => setPersona("emp")}>◐ Employee</button>
            </div>
            {persona === "emp" && (
              <select className="emp-pick" value={empId} onChange={(e) => { setEmpId(e.target.value); setETab("myleave"); }} aria-label="View as employee">
                {cases.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <button className="tour-btn" onClick={startTour}>◆ Take the tour</button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span className="fm-poc">Proof of Concept</span>
              <div className="fm-by">Developed by <b>Savoi</b></div>
            </div>
          </div>
        </div>
      </div>
      <div className="fm-pylon">
        <span style={{ background: "var(--blue)" }} /><span style={{ background: "var(--sky)" }} /><span style={{ background: "var(--sky-2)" }} /><span style={{ background: "var(--brass-2)" }} /><span style={{ background: "var(--brass)" }} /><span style={{ background: "var(--ink-2)" }} /><span style={{ background: "var(--blue)" }} />
      </div>
      {persona === "hr" ? (
        <>
          <div className="fm-nav">
            <div className="fm-shell" style={{ width: "100%", display: "flex", gap: 2 }}>
              {tabs.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => go(k)}>{l}</button>)}
            </div>
          </div>
          <div className="fm-shell">
            <div className="fm-body">
              {tab === "dash" && <Dashboard go={go} cases={cases} requests={requests} onReview={reviewRequest} />}
              {tab === "cases" && <Cases openId={caseId} go={go} cases={cases} startCase={startCase} />}
              {tab === "emp" && <Employees startCase={startCase} />}
              {tab === "cert" && <Certs />}
              {tab === "notice" && <Notices />}
              {tab === "ai" && <Assistant cases={cases} />}
            </div>
            {draft && <NewCaseModal draft={draft} cases={cases} onClose={() => setDraft(null)} onSave={saveCase} />}
          </div>
        </>
      ) : (
        <EmployeePortal c={empCase} eTab={eTab} setETab={setETab} requests={requests} onSubmit={submitRequest} />
      )}
      <div className="fm-shell">
        {tourStep >= 0 && <Tour step={tourStep} setStep={setTourStep} onClose={closeTour} />}
        <footer className="fm-foot">
          <span>Developed by <b>Savoi</b> · AI-enabled leave &amp; FMLA compliance</span>
          <span>Proof of concept · balances and eligibility figures are illustrative · every designation stays with HR</span>
        </footer>
      </div>
    </div>
  );
}
