/* ============================================================
   Shared deterministic helpers — dates, ids, status, compliance.
   All compliance logic (eligibility, follow-up lapse detection,
   status mapping) is plain JS. No AI here.
   ============================================================ */

export const TODAY = "2026-06-05";

export const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const daysFromToday = (d) => Math.round((new Date(d) - new Date(TODAY)) / 864e5);
export const addDays = (d, n) => { const t = new Date(d + "T00:00:00"); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10); };
export const statusToTag = (s) => (s === "Active" ? "t-green" : s === "Exhausting" ? "t-red" : s === "Returned" || s === "Closed" ? "t-grey" : "t-amber");
export const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);

/* next FM-YYYY-#### id from the highest existing numeric suffix */
export function nextCaseId(cases) {
  const year = TODAY.slice(0, 4);
  const max = cases.reduce((m, c) => Math.max(m, parseInt(c.id.split("-").pop(), 10) || 0), 0);
  return `FM-${year}-${String(max + 1).padStart(4, "0")}`;
}

/* generic next id for prefixed in-memory collections (REQ-####, RA-####, LT-####) */
export const nextId = (prefix, list) => {
  const max = list.reduce((m, r) => Math.max(m, parseInt(String(r.id).split("-").pop(), 10) || 0), 0);
  return `${prefix}-${String(max + 1).padStart(4, "0")}`;
};

/* ---- employee change-of-status request status helpers (HR + employee views) ---- */
export const isPendingReq = (r) => !(r.status.startsWith("Approved") || r.status.startsWith("Denied"));
export const reqStatusTag = (status) => (status.startsWith("Approved") ? "t-green" : status.startsWith("Denied") ? "t-red" : "t-amber");

/* ---- follow-up automation (deterministic) ----
   "No one watches a spreadsheet." A leave is authorized through a date
   (leaveThrough). If that date passes with no newer documentation on file
   (lastDoc), the leave has lapsed and the correct follow-up letter is due.
   15-day letter for a recent lapse, 30-day for a longer one. */
export function followUp(c) {
  if (!c.leaveThrough || c.status === "Returned" || c.status === "Closed") return null;
  const over = daysFromToday(c.leaveThrough); // negative once the date has passed
  if (over >= 0) return null; // still authorized
  const docFresh = c.lastDoc && c.lastDoc > c.leaveThrough; // newer documentation received
  if (docFresh) return null;
  const overdue = -over;
  const kind = overdue <= 15 ? "15-day" : "30-day";
  return {
    lapsed: true,
    kind,
    overdue,
    letter: `${kind} follow-up letter`,
    text: `Leave authorized through ${fmt(c.leaveThrough)} lapsed ${overdue} day(s) ago with no new documentation on file. Queue the ${kind} follow-up letter.`,
    dueBy: addDays(c.leaveThrough, kind === "15-day" ? 15 : 30),
  };
}
