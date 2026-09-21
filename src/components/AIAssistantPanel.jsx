import { useState } from "react";
import { useOcean } from "../context/OceanContext";
import "./AIAssistantPanel.css";

const QUICK_PROMPTS = [
  "Show temperature at 200 meters",
  "Show salinity in the Arabian Sea",
  "Animate ocean currents",
  "Show Argo floats and Gliders",
  "Set vertical exaggeration to 5",
];

export default function AIAssistantPanel() {
  const { executeAITool } = useOcean();
  const [isOpen, setIsOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am the SAGAR-X AI Ocean Assistant. Ask me to change variables, depth levels, regions, layers, or start animations using natural language.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (userText) => {
    const textToSend = userText || prompt;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/ai/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.message || "Command executed.",
          tools: data.tool_calls || [],
        },
      ]);

      // Execute returned structured tool calls on global application state
      if (Array.isArray(data.tool_calls)) {
        data.tool_calls.forEach((call) => {
          executeAITool(call.tool, call.arguments);
        });
      }
    } catch (err) {
      console.error("AI command failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error connecting to AI backend. Please check server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`sagarx-ai-container ${isOpen ? "open" : "collapsed"}`}>
      <div className="sagarx-ai-header" onClick={() => setIsOpen((v) => !v)}>
        <div className="sagarx-ai-title">
          <span className="ai-icon">🤖</span>
          <span>AI Ocean Assistant</span>
        </div>
        <button className="toggle-btn">{isOpen ? "▼" : "▲"}</button>
      </div>

      {isOpen && (
        <>
          <div className="sagarx-ai-messages">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-bubble ${m.sender}`}>
                <p>{m.text}</p>
                {m.tools && m.tools.length > 0 && (
                  <div className="tool-pills">
                    {m.tools.map((t, ti) => (
                      <span key={ti} className="tool-tag">
                        🔧 {t.tool}({JSON.stringify(t.arguments)})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="chat-bubble ai loading">Analyzing query...</div>}
          </div>

          <div className="sagarx-quick-prompts">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button key={idx} onClick={() => handleSubmit(qp)}>
                {qp}
              </button>
            ))}
          </div>

          <form
            className="sagarx-ai-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="text"
              placeholder="Ask AI command..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}
