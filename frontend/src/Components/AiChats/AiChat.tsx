import React, { useState } from 'react';
import './AiChat.scss'; 

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userText = prompt;
    setPrompt('');

    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/AiAgent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.response || `خطأ في السيرفر: ${res.status}` }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.response || 'لم يتم استلام رد' }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `خطأ في الاتصال: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      {!isOpen ? (
        <button className="chat-open-btn" onClick={() => setIsOpen(true)}>
          💬 Ki
        </button>
      ) : (
        <div className="chat-box">
          <div className="chat-header">
            <strong>🤖 KI Assisten</strong>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>

          <input
            type="text"
            className="chat-input"
            placeholder="frage mich "
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'warte ich such mal' :'Senden'}
          </button>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className='message-item'>
               
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};