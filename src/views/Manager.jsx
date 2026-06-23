import React from "react";
import { Tag, Guard, Restricted } from "../components/ui";
import { fmt, daysFromToday } from "../lib/format";

/* Manager persona: schedule impact for direct reports — dates and coverage only.
   No diagnosis, no reason, no medical documents. */
const impact = (c) => {
  if (c.type === "Intermittent") return { label: "Intermittent — episodic absences", tag: "t-amber" };
  if (c.status === "Exhausting") return { label: "Out continuously — leave ending soon", tag: "t-red" };
  return { label: "Out — full schedule", tag: "t-blue" };
};

export function Manager({ manager, cases }) {
  const team = cases.filter((c) => c.manager === manager.name && c.status !== "Returned" && c.status !== "Closed");
  return (
    <div className="fade">
      <h2 className="fm-h">Team leave — schedule impact</h2>
      <p className="fm-sub">{manager.name} · {manager.title}. Plan coverage from the dates below. You do not see the reason for leave, certifications, or any medical detail — those stay with HR.</p>
      <div className="lock" style={{ marginBottom: 16 }}>🔒 Manager view — schedule and coverage only, no medical information</div>

      <div className="fm-grid g3" style={{ marginBottom: 20 }}>
        <div className="fm-card fm-kpi"><div className="n">{team.length}</div><div className="l">Reports on leave</div><div className="d" style={{ color: "var(--muted)" }}>in {manager.dept}</div></div>
        <div className="fm-card fm-kpi"><div className="n">{team.filter((c) => c.type === "Intermittent").length}</div><div className="l">Intermittent</div><div className="d" style={{ color: "var(--amber)" }}>episodic coverage</div></div>
        <div className="fm-card fm-kpi"><div className="n">{team.filter((c) => c.type !== "Intermittent").length}</div><div className="l">Continuous</div><div className="d" style={{ color: "var(--blue)" }}>full-shift coverage</div></div>
      </div>

      {team.length ? (
        <div className="fm-card" data-tour="manager">
          <div className="fm-sec-h"><h3>Coverage board</h3><Tag c="t-grey">{manager.dept}</Tag></div>
          <table className="fm-tbl">
            <thead><tr><th>Employee</th><th>Schedule impact</th><th>Out since</th><th>Expected through</th><th>Status</th></tr></thead>
            <tbody>
              {team.map((c) => {
                const im = impact(c);
                return (
                  <tr key={c.id}>
                    <td><div className="emp">{c.name}</div><div className="role">{c.role}</div></td>
                    <td><Tag c={im.tag}>{im.label}</Tag></td>
                    <td className="fm-mono" style={{ fontSize: 13.8 }}>{fmt(c.opened)}</td>
                    <td className="fm-mono" style={{ fontSize: 13.8 }}>{c.leaveThrough ? fmt(c.leaveThrough) : "open-ended"}{c.leaveThrough && daysFromToday(c.leaveThrough) < 0 ? " (HR following up)" : ""}</td>
                    <td><Tag c={c.statusTag}>{c.status}</Tag></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Guard style={{ marginTop: 14 }}>If you need to plan workload or backfill, raise it with HR. Never ask a report for their diagnosis or medical documents — that would breach the confidentiality boundary this view enforces.</Guard>
        </div>
      ) : <Restricted><div style={{ fontSize: 15.4 }}>None of your reports are currently on leave.</div></Restricted>}
    </div>
  );
}
