/* ============================================================
   Single source of styling — one CSS template string, CSS
   variables, fm- prefixed classes. No Tailwind, no CSS modules,
   no theme library. Design tokens are pinned; do not drift.
   New screens reuse the variables and status semantics below.
   ============================================================ */
export const STYLES = `
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
.fm-field input,.fm-field select,.fm-field textarea{border:1px solid var(--line);border-radius:9px;padding:11px 13px;font-family:'Barlow',sans-serif;font-size:15px;color:var(--ink);background:#fff;outline:none}
.fm-field input:focus,.fm-field select:focus,.fm-field textarea:focus{border-color:var(--brass)}
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

/* lifecycle: persona note, stepper, audit timeline, walkthrough, sensitivity lock */
.persona-note{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--ink-2);background:var(--paper-2);border-bottom:1px solid var(--line);padding:9px 36px}
.persona-note b{color:var(--brass)}
.persona-note .pill{font-size:11px;text-transform:uppercase;letter-spacing:.6px;font-weight:700;color:#0a2647;background:var(--brass-2);padding:2px 8px;border-radius:5px}

.stepper{display:flex;align-items:center;margin:0 0 24px;flex-wrap:wrap;gap:6px 0}
.stepper .st{display:flex;align-items:center;gap:9px}
.stepper .st .num{width:30px;height:30px;border-radius:50%;background:var(--line);color:var(--muted);display:flex;align-items:center;justify-content:center;font-family:'Barlow Semi Condensed',sans-serif;font-weight:700;font-size:15px;flex-shrink:0}
.stepper .st.done .num{background:var(--green);color:#fff}
.stepper .st.now .num{background:var(--brass);color:#fff}
.stepper .st .lab{font-size:13px;font-weight:600;color:var(--muted);white-space:nowrap}
.stepper .st.now .lab,.stepper .st.done .lab{color:var(--ink)}
.stepper .ln{width:30px;height:2px;background:var(--line);margin:0 8px}
.stepper .ln.done{background:var(--green)}

.audit{position:relative;padding-left:22px;margin-top:6px}
.audit::before{content:'';position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:var(--line)}
.audit .ev{position:relative;padding:0 0 14px}
.audit .ev:last-child{padding-bottom:0}
.audit .ev .pd{position:absolute;left:-18px;top:4px;width:9px;height:9px;border-radius:50%;background:var(--brass-2);border:2px solid #fff;box-shadow:0 0 0 2px var(--line)}
.audit .ev .ea{font-size:14.4px;font-weight:600}
.audit .ev .em{font-size:12.8px;color:var(--muted)}

.wf-rail{display:flex;flex-direction:column;gap:10px}
.wf-step{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;border:1px solid var(--line);border-radius:12px;background:var(--card);cursor:pointer;transition:.15s;width:100%;text-align:left;font-family:'Barlow',sans-serif}
.wf-step:hover{border-color:var(--brass);box-shadow:0 6px 20px rgba(10,38,71,.08)}
.wf-step.on{border-color:var(--brass);background:var(--paper-2)}
.wf-step .wn{width:34px;height:34px;border-radius:9px;background:var(--ink);color:#eef4fb;display:flex;align-items:center;justify-content:center;font-family:'Barlow Semi Condensed',sans-serif;font-weight:700;flex-shrink:0}
.wf-step.on .wn{background:var(--brass)}
.wf-step h4{margin:0 0 2px;font-family:'Barlow Semi Condensed',sans-serif;font-size:16px;font-weight:600;color:var(--ink)}
.wf-step p{margin:0;font-size:13.6px;color:var(--muted);line-height:1.5}
.persona-chip{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;padding:2px 8px;border-radius:5px;background:var(--blue-bg);color:var(--blue);white-space:nowrap}

.lock{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--red);background:var(--red-bg);border-radius:20px;padding:4px 11px}
.restricted{border:1px dashed var(--line);border-radius:12px;padding:26px 22px;text-align:center;color:var(--muted);background:var(--paper-2)}
.restricted .rk{font-size:26px;display:block;margin-bottom:8px}
`;
