import React, { useContext, useState } from 'react';
import './AiChat.scss'; 
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
 const { user } = useContext(AuthContext) as AuthContextType;

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt('');

    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/AiAgent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await res.json().catch(() => ({}));
      const reply =
        data.response ?? data.reply ?? data.answer ?? data.message ?? '';

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: reply || `Serverfehler: ${res.status}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: reply || 'Keine Antwort erhalten.' },
        ]);
      }
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Verbindungsfehler: ${
            err instanceof Error ? err.message : 'Unbekannter Fehler'
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // return muss ein einzelnes JSX-Element liefern – daher frueh raus,
  // statt {user && ...} direkt nach return zu schreiben (wird als
  // Objektliteral geparst und bricht den Build).
  if (!user) return null;

  return (
    <div className="ai-chat-container">
      {!isOpen  ? (
        <button className="chat-open-btn" onClick={() => setIsOpen(true)}>
          💬 Ki
        </button>
      ) : (
        <div className="chat-box">
          <div className="chat-header">
            <strong>🤖 KI-Assistent</strong>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Chat schließen"
            >
              ✕
            </button>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <p className="messages-container__empty">
                Stell mir eine Frage zu deinen Rezepten.
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-item message-item--${msg.sender}`}
                >
                  <span>{msg.text}</span>
                </div>
              ))
            )}

            {loading && <p className="messages-container__empty">…</p>}
          </div>

          <input
            type="text"
            className="chat-input"
            placeholder="Frage eingeben …"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'Warte …' : 'Senden'}
          </button>
        </div>
      )}
    </div>
  );
};