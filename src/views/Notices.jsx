import React, { useState } from "react";
import { Tag, LetterModal } from "../components/ui";
import { fmt, TODAY } from "../lib/format";
import { draftCureLetter, draftLetter } from "../lib/ai";
import { LETTER_TEMPLATES } from "../data/seed";

const letterTag = (st) => (st === "Sent" || st === "Signed" ? "t-green" : st === "Out for signature" ? "t-blue" : "t-amber");

/* fallback bodies when the live model is unavailable */
const FALLBACK = {
  cure: `${fmt(TODAY)}\n\nRobert Hayes\n\nDear Mr. Hayes:\n\nThank you for your certification (WH-380-F). It does not state the probable duration of the condition or the frequency and duration of care you will provide. Please supply the missing information within 7 calendar days, by ${fmt("2026-06-09")}.\n\nSincerely,\nHR Shared Services — Leave Administration\nLos Angeles World Airports`,
  followup15: `${fmt(TODAY)}\n\nLinda Tran\n\nRe: Request for Updated Documentation — 15-Day Notice\n\nDear Ms. Tran:\n\nOur records show your approved leave was authorized through May 29, 2026, and we have not yet received updated documentation supporting a continued need for leave. Please provide updated certification within 15 calendar days of this notice so we can keep your leave protected and current.\n\nIf you have returned to work or your circumstances have changed, let us know and no action is needed. This letter requests information; it is not a determination on your leave.\n\nSincerely,\nHR Shared Services — Leave Administration\nLos Angeles World Airports`,
  followup30: `${fmt(TODAY)}\n\nAisha Bennett\n\nRe: Request for Updated Documentation — 30-Day Notice\n\nDear Ms. Bennett:\n\nThis letter follows up on your approved leave. Please provide updated documentation supporting your continued need for leave within 30 calendar days of this notice so your leave remains current and protected.\n\nThis letter requests information; it is not a determination on your leave.\n\nSincerely,\nHR Shared Services — Leave Administration\nLos Angeles World Airports`,
};

export function Notices({ letters, onUpdateLetter }) {
  const [letter, setLetter] = useState(null);

  const open = async (l) => {
    if (l.tplKey === "cure" || l.tplKey === "followup15" || l.tplKey === "followup30") {
      setLetter({ title: l.type, who: l.who, body: "", loading: true, loadingText: "Drafting…", ai: true, esign: l.esign });
      try {
        const body = l.tplKey === "cure"
          ? await draftCureLetter()
          : await draftLetter({ kind: l.type, facts: `Employer: LAWA. Date: ${fmt(TODAY)}. Employee: ${l.who}. This is a ${l.type} requesting updated documentation to keep an approved leave current; the recipient has ${l.tplKey === "followup15" ? "15" : "30"} calendar days to respond. It is not a determination.` });
        setLetter({ title: l.type, who: l.who, body: body || FALLBACK[l.tplKey], loading: false, ai: true, esign: l.esign });
      } catch (e) {
        setLetter({ title: l.type, who: l.who, body: FALLBACK[l.tplKey], loading: false, ai: true, esign: l.esign });
      }
    } else {
      const t = LETTER_TEMPLATES[l.tplKey];
      setLetter({ title: t ? t.title : l.type, who: l.who, body: t ? t.body : "Template unavailable.", loading: false, ai: false, esign: l.esign });
    }
  };

  return (
    <div className="fade">
      <h2 className="fm-h">Letters &amp; e-signature</h2>
      <p className="fm-sub">Required notices pre-populate from case data and hold for human sign-off. Deterministic notices fill from templates; judgment letters (cure, follow-up) are AI-drafted with a clean fallback. Mandated forms route for DocuSign-style e-signature.</p>
      <LetterModal letter={letter} onClose={() => setLetter(null)} />
      <div className="fm-card" data-tour="notices">
        <table className="fm-tbl">
          <thead><tr><th>Letter</th><th>Employee</th><th>Source</th><th>E-signature</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {letters.map((l) => (
              <tr key={l.id}>
                <td className="emp">{l.type}<div className="role fm-mono">{l.id} · {fmt(l.generated)}</div></td>
                <td>{l.who}</td>
                <td><Tag c={l.method === "AI-drafted" ? "t-grey" : "t-blue"}>{l.method}</Tag></td>
                <td>{l.esign ? <Tag c="t-blue">DocuSign</Tag> : <span style={{ fontSize: 14, color: "var(--muted-2)" }}>Manual</span>}</td>
                <td><Tag c={letterTag(l.status)}>{l.status}</Tag></td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => open(l)}>View</button>
                  {l.esign && (l.status === "Ready — HR sign-off" || l.status === "Queued") &&
                    <button className="fm-btn brass" style={{ padding: "6px 12px", fontSize: 14, marginLeft: 6 }} onClick={() => onUpdateLetter(l.id, "Out for signature")}>Route for e-sign</button>}
                  {l.esign && l.status === "Out for signature" &&
                    <button className="fm-btn ghost" style={{ padding: "6px 12px", fontSize: 14, marginLeft: 6 }} onClick={() => onUpdateLetter(l.id, "Signed")}>Mark signed</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="guard"><span>◆</span> The e-signature step is simulated for the concept — production would integrate a real provider (DocuSign/Adobe Sign) with its own credentials. Nothing leaves the system without an HR signature.</div>
      </div>
    </div>
  );
}
