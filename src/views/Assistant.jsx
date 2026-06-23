import React, { useState, useEffect, useRef } from "react";
import { callMessages, buildContext } from "../lib/ai";

export function Assistant({ cases }) {
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
      const text = await callMessages({ task: "chat", system: buildContext(cases), messages: apiMsgs });
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
