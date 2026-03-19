import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = "user123";

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.output.response,
        agent: data.output.agent
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Error connecting to backend!",
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        🤖 Multi-Agent Copilot
      </div>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === "user" ? styles.userMsg : styles.botMsg}>
            {msg.agent && <span style={styles.agentTag}>{msg.agent}</span>}
            <p style={{ margin: 0 }}>{msg.content}</p>
          </div>
        ))}
        {loading && <div style={styles.botMsg}>Thinking...</div>}
      </div>
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything..."
        />
        <button style={styles.button} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#1a1a2e",
    color: "white",
    padding: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userMsg: {
    background: "#0084ff",
    color: "white",
    padding: "12px 16px",
    borderRadius: "18px 18px 4px 18px",
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  botMsg: {
    background: "white",
    color: "#333",
    padding: "12px 16px",
    borderRadius: "18px 18px 18px 4px",
    alignSelf: "flex-start",
    maxWidth: "70%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  agentTag: {
    background: "#e8f4fd",
    color: "#0084ff",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    marginBottom: "6px",
    display: "inline-block",
  },
  inputArea: {
    display: "flex",
    padding: "16px",
    background: "white",
    borderTop: "1px solid #ddd",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    background: "#0084ff",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "24px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default App;