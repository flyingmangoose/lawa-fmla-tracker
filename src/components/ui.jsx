import React from "react";
import { fmt } from "../lib/format";

/* ---------------- shared presentational components ---------------- */
export const Tag = ({ c, children }) => <span className={`fm-tag ${c}`}>{children}</span>;

export const Guard = ({ children, style }) => (
  <div className="guard" style={style}><span>◆</span> {children}</div>
);

export function StatBar({ used, cap, color }) {
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

/* reusable centered modal sheet (header on navy, scrollable body, footer) */
export function Sheet({ title, width = 600, onClose, footer, children }) {
  return (
    <div className="lt-bg" onClick={onClose}>
      <div className="lt-sheet" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="lt-head"><h4>{title}</h4><button className="x" style={{ color: "#9fb0bd" }} onClick={onClose}>×</button></div>
        <div style={{ padding: "24px 28px", maxHeight: "70vh", overflowY: "auto" }}>{children}</div>
        {footer && <div className="lt-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* letterhead modal used by Notices, Certs, employee documents */
export function LetterModal({ letter, onClose }) {
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
            ? <div style={{ color: "var(--brass)", fontSize: 15.6 }}><span className="dot" /> <span className="dot" style={{ animationDelay: ".2s" }} /> <span className="dot" style={{ animationDelay: ".4s" }} /> {letter.loadingText || "Drafting…"}</div>
            : letter.body}
        </div>
        <div className="lt-foot">
          <span className="lt-gen">{letter.ai ? "◆ Drafted by AI" : "◆ Filled from case data"} · {letter.esign ? "routed for e-signature" : "held for HR signature"}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fm-btn ghost" style={{ padding: "7px 13px", fontSize: 15 }} onClick={onClose}>Close</button>
            <button className="fm-btn brass" style={{ padding: "7px 13px", fontSize: 15 }} disabled={letter.loading}>{letter.esign ? "Send for e-signature" : "Sign & send"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* horizontal lifecycle stepper: steps = [{label}], current = index */
export function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className={`st ${i < current ? "done" : i === current ? "now" : ""}`}>
            <div className="num">{i < current ? "✓" : i + 1}</div>
            <div className="lab">{s.label}</div>
          </div>
          {i < steps.length - 1 && <div className={`ln ${i < current ? "done" : ""}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* audit / events timeline for a case */
export function Audit({ events }) {
  if (!events.length) return <p style={{ fontSize: 14.5, color: "var(--muted)", margin: 0 }}>No recorded events yet.</p>;
  return (
    <div className="audit">
      {events.map((e) => (
        <div className="ev" key={e.id}>
          <span className="pd" />
          <div className="ea">{e.action}</div>
          <div className="em fm-mono">{fmt(e.when)} · {e.actor}</div>
        </div>
      ))}
    </div>
  );
}

/* restricted-data placeholder for personas without visibility */
export function Restricted({ children }) {
  return (
    <div className="restricted">
      <span className="rk">🔒</span>
      {children}
    </div>
  );
}
