import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const QUICK = ['Workout plan?', 'Nutrition tips?', 'My streak?', 'Protein advice?'];

const parseMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
};

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 0,
      from: 'bot',
      text: `Hi ${user?.username}! I'm Pulse, your AI fitness companion. How can I help you today?`,
      time: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now(), from: 'user', text: text.trim(), time: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' }) };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/chat/message', { message: text.trim() });
      setMessages(m => [...m, {
        id: Date.now() + 1,
        from: 'bot',
        text: data.botResponse,
        time: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' }),
      }]);
    } catch {
      setMessages(m => [...m, { id: Date.now()+1, from:'bot', text: "Sorry, I couldn't process that. Try again!", time:'' }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.back} onClick={() => navigate('/home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div style={styles.botInfo}>
          <div style={styles.botAvatar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div>
            <p style={styles.botName}>Pulse AI</p>
            <p style={styles.botStatus}>● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.msgs}>
        {messages.map(msg => (
          <div key={msg.id} style={{ ...styles.msgRow, justifyContent: msg.from==='user' ? 'flex-end' : 'flex-start' }}>
            {msg.from === 'bot' && <div style={styles.botAvatarSm}>P</div>}
            <div style={{ maxWidth:'78%' }}>
              <div
                style={{ ...styles.bubble, ...(msg.from==='user' ? styles.userBubble : styles.botBubble) }}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
              />
              {msg.time && <p style={{ ...styles.time, textAlign: msg.from==='user' ? 'right' : 'left' }}>{msg.time}</p>}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.msgRow, justifyContent:'flex-start' }}>
            <div style={styles.botAvatarSm}>P</div>
            <div style={{ ...styles.bubble, ...styles.botBubble }}>
              <span style={styles.typing}>
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div style={styles.quickWrap}>
        {QUICK.map(q => (
          <button key={q} style={styles.quick} onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={styles.inputBar}>
        <input
          style={styles.chatInput}
          placeholder="Ask Pulse AI?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          maxLength={500}
        />
        <button style={{ ...styles.sendBtn, opacity: input.trim() ? 1 : 0.4 }} onClick={() => send(input)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>

      <style>{`
        @keyframes typing { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
        .typing span { width:6px;height:6px;border-radius:50%;background:var(--text3);display:inline-block;margin:0 2px;animation:typing 1s infinite; }
        .typing span:nth-child(2){animation-delay:0.2s}
        .typing span:nth-child(3){animation-delay:0.4s}
      `}</style>
    </div>
  );
}

const styles = {
  wrap: { display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)' },
  header: { display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:'1px solid var(--border)', background:'var(--bg2)', flexShrink:0 },
  back: { width:36, height:36, borderRadius:9, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', display:'flex', alignItems:'center', justifyContent:'center' },
  botInfo: { display:'flex', alignItems:'center', gap:10 },
  botAvatar: { width:40, height:40, borderRadius:'50%', background:'var(--accent-dim)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' },
  botName: { fontSize:15, fontWeight:600 },
  botStatus: { fontSize:11, color:'#4caf50' },
  msgs: { flex:1, overflowY:'auto', padding:'20px 16px', display:'flex', flexDirection:'column', gap:12 },
  msgRow: { display:'flex', alignItems:'flex-end', gap:8 },
  botAvatarSm: { width:28, height:28, borderRadius:'50%', background:'var(--accent)', color:'#0e0e12', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  bubble: { padding:'12px 14px', borderRadius:16, fontSize:14, lineHeight:1.6 },
  userBubble: { background:'var(--accent)', color:'#0e0e12', borderBottomRightRadius:4, fontWeight:500 },
  botBubble: { background:'var(--bg2)', color:'var(--text)', borderBottomLeftRadius:4, border:'1px solid var(--border)' },
  time: { fontSize:10, color:'var(--text3)', marginTop:3, paddingInline:2 },
  typing: { display:'flex', alignItems:'center', height:16 },
  quickWrap: { display:'flex', gap:8, padding:'8px 16px', overflowX:'auto', flexShrink:0 },
  quick: { whiteSpace:'nowrap', padding:'7px 14px', borderRadius:100, background:'var(--bg2)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:12, cursor:'pointer', flexShrink:0 },
  inputBar: { display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderTop:'1px solid var(--border)', background:'var(--bg2)', flexShrink:0 },
  chatInput: { flex:1, background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:100, padding:'11px 18px', color:'var(--text)', fontSize:14 },
  sendBtn: { width:42, height:42, borderRadius:'50%', background:'var(--accent)', color:'#0e0e12', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'opacity 0.2s' },
};
