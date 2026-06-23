import React, { useState, useEffect } from "react";

/* ============================================================
   LAWA Leave & Return-to-Work — concept demo for a CHRO.
   Front-end only. All state is in-memory and resets on refresh.
   AI assists (parsing, drafting, flagging); humans decide. Access
   is shown via a DEMO persona switch — production uses real RBAC.
   ============================================================ */

import { STYLES } from "./lib/styles";
import { TODAY, fmt, addDays, nextId } from "./lib/format";
import {
  CASES, INTAKE, ACCOMMODATIONS, LETTERS, EVENTS, DOCUMENTS, MANAGER,
} from "./data/seed";

import { Dashboard } from "./views/Dashboard";
import { Cases, NewCaseModal } from "./views/Cases";
import { Roster } from "./views/Roster";
import { Certs } from "./views/Certs";
import { Notices } from "./views/Notices";
import { Assistant } from "./views/Assistant";
import { EmployeePortal, employeeTabs } from "./views/Employee";
import { Intake } from "./views/Intake";
import { Requests } from "./views/Requests";
import { Accommodations } from "./views/Accommodations";
import { ReturnToWork } from "./views/ReturnToWork";
import { Payroll } from "./views/Payroll";
import { Manager } from "./views/Manager";
import { Walkthrough } from "./views/Walkthrough";
import { TOUR, Tour } from "./components/Tour";

const HR_TABS = [
  ["dash", "Dashboard"], ["requests", "Requests"], ["cases", "Cases"], ["roster", "Roster & Hours"],
  ["certs", "Certifications"], ["notices", "Letters"], ["accommodations", "Accommodations"],
  ["rtw", "Return to Work"], ["payroll", "Payroll"], ["ai", "Assistant"], ["walkthrough", "Walkthrough"],
];
const MGR_TABS = [["manager", "Team Leave"], ["accommodations", "Accommodations"]];

const PERSONA_NOTE = {
  employee: <>You're viewing as an <b>Employee</b> — you see only your own intake, documents, and status. Never another employee's case or any medical detail.</>,
  hr: <>You're viewing as <b>HR / Leave Admin</b> — full access to every case, document, and accommodation, with the authority to make determinations.</>,
  manager: <>You're viewing as a <b>Manager</b> — schedule impact and dates for your reports only. Never a diagnosis, certification, or medical document.</>,
};

export default function App() {
  const [persona, setPersona] = useState("hr"); // employee | hr | manager
  const [tab, setTab] = useState("dash");        // HR nav
  const [eTab, setETab] = useState("myleave");   // employee nav
  const [mgrTab, setMgrTab] = useState("manager");// manager nav
  const [caseId, setCaseId] = useState(null);
  const [empId, setEmpId] = useState(CASES[0].id);

  // in-memory collections (reset on refresh, by design)
  const [cases, setCases] = useState(CASES);
  const [requests, setRequests] = useState([]);          // employee change-of-status requests
  const [intake, setIntake] = useState(INTAKE);          // new applications from the front door
  const [accommodations, setAccommodations] = useState(ACCOMMODATIONS);
  const [letters, setLetters] = useState(LETTERS);
  const [events, setEvents] = useState(EVENTS);
  const [draft, setDraft] = useState(null);              // NewCaseModal
  const [tourStep, setTourStep] = useState(-1);

  const empCase = cases.find((c) => c.id === empId) || cases[0];

  /* ---- navigation ---- */
  const go = (t, id = null) => { setTab(t); setCaseId(id); };
  const goTo = (p, t, id = null) => {
    setPersona(p); setCaseId(id); setDraft(null);
    if (p === "hr") setTab(t); else if (p === "employee") setETab(t); else setMgrTab(t);
  };
  const switchPersona = (p) => {
    setPersona(p); setCaseId(null); setDraft(null);
    if (p === "hr") setTab("dash"); else if (p === "employee") setETab("myleave"); else setMgrTab("manager");
  };

  /* ---- tour ---- */
  const startTour = () => { setPersona("hr"); setTourStep(0); };
  const closeTour = () => { try { localStorage.setItem("lawaTourSeen", "1"); } catch (e) {} setTourStep(-1); };
  useEffect(() => { if (tourStep >= 0) { setPersona("hr"); setTab(TOUR[tourStep].tab); setCaseId(null); setDraft(null); } }, [tourStep]);
  useEffect(() => { try { if (!localStorage.getItem("lawaTourSeen")) setTourStep(0); } catch (e) {} }, []);

  /* ---- handlers (deterministic state, human-in-the-loop) ---- */
  const addEvent = (cId, actor, action) => setEvents((prev) => [...prev, { id: nextId("EV", prev), caseId: cId, when: TODAY, actor, action }]);

  const startCase = (prefill = {}) => setDraft(prefill);
  const saveCase = (newCase) => {
    setCases((cs) => [...cs, newCase]);
    addEvent(newCase.id, "HR (Leave Admin)", "Case opened and balances initialized");
    setDraft(null);
    go("cases", newCase.id);
  };

  const submitRequest = (req) => setRequests((rs) => [{ ...req, id: nextId("REQ", rs), submitted: TODAY, status: "Submitted — awaiting HR review" }, ...rs]);
  const reviewRequest = (id, decision, note) => setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, decision, note: note || "", decidedOn: TODAY, status: decision === "approved" ? "Approved by HR" : "Denied by HR" } : r)));

  const submitIntake = (item) => {
    const id = nextId("IN", intake);
    setIntake((prev) => [{ ...item, id, submitted: TODAY, status: "New" }, ...prev]);
    return id;
  };
  const determineIntake = (item, action) => {
    if (action === "openCase") {
      setIntake((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "Determined", outcome: "Case opened" } : i)));
      startCase({ name: item.name, role: item.role, dept: item.dept, reason: item.reason, personalEmail: item.personalEmail });
    } else if (action === "accommodation") {
      setIntake((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "Determined", outcome: "Accommodation opened" } : i)));
      setAccommodations((prev) => [{
        id: nextId("RA", prev), name: item.name, role: item.role, dept: item.dept,
        kind: "Light / modified duty", request: item.reason, status: "Pending",
        accommodation: "To be determined in the interactive process", startDate: null,
        reviewDate: addDays(TODAY, 30), linkedCaseId: null, confidential: true,
      }, ...prev]);
      go("accommodations");
    } else {
      setIntake((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "Denied", outcome: "Denied" } : i)));
    }
  };

  const updateAccommodation = (id, patch) => setAccommodations((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const updateLetter = (id, status) => setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  const onReturn = (cId, info) => {
    const c = cases.find((x) => x.id === cId);
    setCases((prev) => prev.map((x) => (x.id === cId ? { ...x, status: "Returned", statusTag: "t-grey", returnedOn: TODAY, nextDeadline: { what: "Returned to work", when: info.returnDate } } : x)));
    addEvent(cId, "HR (Leave Admin)", `Confirmed return to work on ${fmt(info.returnDate)}${info.fitness ? " · fitness-for-duty on file" : ""}${info.accommodation ? ` · accommodation: ${info.accommodation}` : ""}; case closed`);
    if (c) setLetters((prev) => [{ id: nextId("LT", prev), caseId: cId, who: c.name, type: "Return-to-Work Confirmation", tplKey: "rtw", method: "Template", esign: false, status: "Ready — HR sign-off", generated: TODAY }, ...prev]);
    go("rtw", null);
  };

  /* ---- nav model by persona ---- */
  const navTabs = persona === "hr" ? HR_TABS : persona === "manager" ? MGR_TABS : employeeTabs(empCase).concat([["apply", "Apply for Leave"]]);
  const activeNav = persona === "hr" ? tab : persona === "manager" ? mgrTab : eTab;
  const onNav = persona === "hr" ? (k) => go(k) : persona === "manager" ? setMgrTab : setETab;

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
            <div><h1>LAWA Leave &amp; FMLA</h1><div className="sub">Los Angeles World Airports · {persona === "hr" ? "HR Shared Services" : persona === "manager" ? "Manager — Facilities" : "Employee Self-Service"}</div></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="seg" data-tour="persona">
              <button className={persona === "employee" ? "on" : ""} onClick={() => switchPersona("employee")}>◐ Employee</button>
              <button className={persona === "hr" ? "on" : ""} onClick={() => switchPersona("hr")}>⬡ HR / Leave Admin</button>
              <button className={persona === "manager" ? "on" : ""} onClick={() => switchPersona("manager")}>◳ Manager</button>
            </div>
            {persona === "employee" && (
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

      <div className="persona-note">
        <span className="pill">Demo control</span>
        <span>{PERSONA_NOTE[persona]}</span>
        <span style={{ marginLeft: "auto", color: "var(--muted-2)" }}>Production uses real role-based access (SSO + RBAC).</span>
      </div>

      <div className="fm-nav">
        <div className="fm-shell" style={{ width: "100%", display: "flex", gap: 2 }}>
          {navTabs.map(([k, l]) => <button key={k} className={activeNav === k ? "on" : ""} data-tour={persona === "hr" && k === "walkthrough" ? "walkthrough" : undefined} onClick={() => onNav(k)}>{l}</button>)}
        </div>
      </div>

      <div className="fm-shell">
        <div className="fm-body">
          {persona === "hr" && <>
            {tab === "dash" && <Dashboard go={go} cases={cases} requests={requests} onReview={reviewRequest} />}
            {tab === "requests" && <Requests intake={intake} onDetermine={determineIntake} />}
            {tab === "cases" && <Cases openId={caseId} go={go} cases={cases} startCase={startCase} events={events} documents={DOCUMENTS} />}
            {tab === "roster" && <Roster startCase={startCase} />}
            {tab === "certs" && <Certs />}
            {tab === "notices" && <Notices letters={letters} onUpdateLetter={updateLetter} />}
            {tab === "accommodations" && <Accommodations persona="hr" accommodations={accommodations} onUpdate={updateAccommodation} />}
            {tab === "rtw" && <ReturnToWork cases={cases} openId={caseId} onReturn={onReturn} go={go} />}
            {tab === "payroll" && <Payroll cases={cases} />}
            {tab === "ai" && <Assistant cases={cases} />}
            {tab === "walkthrough" && <Walkthrough goTo={goTo} />}
          </>}

          {persona === "manager" && <>
            {mgrTab === "manager" && <Manager manager={MANAGER} cases={cases} />}
            {mgrTab === "accommodations" && <Accommodations persona="manager" accommodations={accommodations} />}
          </>}

          {persona === "employee" && <>
            {eTab === "apply" && <Intake prefill={{ name: empCase.name, role: empCase.role, dept: empCase.dept }} onSubmit={submitIntake} />}
            {eTab === "accommodations" && <Accommodations persona="employee" accommodations={accommodations} empName={empCase.name} />}
            {!["apply", "accommodations"].includes(eTab) && <EmployeePortal c={empCase} eTab={eTab} setETab={setETab} requests={requests} onSubmit={submitRequest} />}
          </>}
        </div>

        {draft && <NewCaseModal draft={draft} cases={cases} onClose={() => setDraft(null)} onSave={saveCase} />}
      </div>

      <div className="fm-shell">
        {tourStep >= 0 && <Tour step={tourStep} setStep={setTourStep} onClose={closeTour} />}
        <footer className="fm-foot">
          <span>Developed by <b>Savoi</b> · AI-enabled leave, FMLA &amp; return-to-work compliance</span>
          <span>Proof of concept · in-memory demo data · access shown via a demo persona switch (production uses real RBAC) · every designation stays with HR</span>
        </footer>
      </div>
    </div>
  );
}
