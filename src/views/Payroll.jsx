import React from "react";
import { Tag, Guard } from "../components/ui";
import { fmt, TODAY, addDays } from "../lib/format";

/* Integration boundary, shown honestly. An approved leave's coding WOULD flow to
   Workday payroll as a scheduled batch — not a live real-time feed. */
const codeFor = (c) => {
  if (c.used.pdl > 0) return { code: "PDL-DIS / FMLA-CONC", pay: "Disability pay (PDL) + protected" };
  if (c.mcgw) return { code: "FMLA-MILCG", pay: "Unpaid protected (accruals optional)" };
  if (c.type === "Intermittent") return { code: "FMLA-INT", pay: "Intermittent — hours coded per occurrence" };
  if (/bond/i.test(c.reason)) return { code: "CFRA-BOND", pay: "Protected bonding" };
  return { code: "FMLA-CONT", pay: "Continuous protected" };
};

export function Payroll({ cases }) {
  const batch = cases.filter((c) => c.status !== "Returned" && c.status !== "Closed");
  return (
    <div className="fade">
      <h2 className="fm-h">Payroll integration boundary</h2>
      <p className="fm-sub">Where this system stops and Workday begins. Approved leave codings are prepared here and handed to payroll — by scheduled batch, not a live feed.</p>

      <div className="fm-alert al-amber" style={{ marginBottom: 18 }}>
        <span className="ic">⚑</span>
        <div style={{ fontSize: 15.4 }}><strong>Concept boundary — not a live integration.</strong> This screen shows what an approved leave's payroll coding would look like and how it would transfer. A production build would push this to Workday on a nightly/pay-period batch with its own credentials and field mapping. Nothing here writes to payroll.</div>
      </div>

      <div className="fm-card">
        <div className="fm-sec-h">
          <h3>Next batch — leave codings to transfer</h3>
          <Tag c="t-grey">Scheduled · {fmt(addDays(TODAY, 1))} 02:00</Tag>
        </div>
        <table className="fm-tbl">
          <thead><tr><th>Employee</th><th>Case</th><th>Payroll code</th><th>Pay treatment</th><th>Effective</th></tr></thead>
          <tbody>
            {batch.map((c) => {
              const k = codeFor(c);
              return (
                <tr key={c.id}>
                  <td><div className="emp">{c.name}</div><div className="role">{c.role}</div></td>
                  <td className="fm-mono" style={{ fontSize: 13.8 }}>{c.id}</td>
                  <td><span className="fm-mono" style={{ fontSize: 13.8, color: "var(--ink-2)", fontWeight: 600 }}>{k.code}</span></td>
                  <td style={{ fontSize: 14.5, color: "var(--muted)" }}>{k.pay}</td>
                  <td className="fm-mono" style={{ fontSize: 13.8 }}>{fmt(c.opened)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center" }}>
          <button className="fm-btn ghost" disabled>⤓ Export batch to Workday (concept)</button>
          <span style={{ fontSize: 13.5, color: "var(--muted-2)" }}>Disabled in the demo — no real payroll connection.</span>
        </div>
        <Guard style={{ marginTop: 14 }}>Determinations stay in this system; payroll execution stays in Workday. The boundary is intentional — coding flows one way, on a batch, after HR designates.</Guard>
      </div>
    </div>
  );
}
