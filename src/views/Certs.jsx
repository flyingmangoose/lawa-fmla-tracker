import React, { useState } from "react";
import { Tag, LetterModal } from "../components/ui";
import { fmt, TODAY } from "../lib/format";
import { draftCureLetter } from "../lib/ai";

export function Certs() {
  const [parsed, setParsed] = useState(false);
  const [letter, setLetter] = useState(null);

  const genCure = async () => {
    setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", body: "", loading: true, loadingText: "Drafting from the parsed certification…", ai: true, esign: true });
    try {
      const body = await draftCureLetter();
      setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", body: body || "Draft unavailable.", loading: false, ai: true, esign: true });
    } catch (e) {
      setLetter({ title: "Return-for-Cure Letter", who: "Robert Hayes", loading: false, ai: true, esign: true,
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
