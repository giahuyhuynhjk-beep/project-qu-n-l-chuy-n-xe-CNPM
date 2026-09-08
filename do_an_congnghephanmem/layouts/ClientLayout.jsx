import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bus, Search, Bell, X, Send } from 'lucide-react';

// ============================================================
// CLIENT LAYOUT – Navbar + Outlet + Footer + Chatbot Bubble
// ============================================================
export default function ClientLayout() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Tôi có thể giúp bạn tìm chuyến xe, tra cứu vé hoặc hỗ trợ các vấn đề liên quan. Bạn cần gì?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: input },
      { from: 'bot', text: 'Cảm ơn bạn đã liên hệ! Nhân viên hỗ trợ sẽ phản hồi sớm nhất có thể.' },
    ]);
    setInput('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>

      {/* ---- NAVBAR ---- */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#2563eb', borderRadius: 10, padding: '6px 8px', display: 'flex' }}>
              <Bus size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#0f172a', letterSpacing: '-0.5px' }}>Vận Trình</span>
          </div>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="/client" style={{ color: '#64748b', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Trang chủ</a>
            <a href="/client/search" style={{ color: '#64748b', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Tìm chuyến xe</a>
            <a href="/client/my-tickets" style={{ color: '#64748b', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Vé của tôi</a>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={20} />
            </button>
            <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Đăng nhập
            </button>
          </div>
        </div>
      </header>

      {/* ---- PAGE CONTENT ---- */}
      <main>
        <Outlet />
      </main>

      {/* ---- FOOTER ---- */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '48px 24px 32px', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ background: '#2563eb', borderRadius: 8, padding: '4px 6px' }}>
                <Bus size={16} color="#fff" />
              </div>
              <span style={{ color: '#f1f5f9', fontWeight: 900, fontSize: 16 }}>Vận Trình</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Hệ thống quản lý nhà xe hiện đại, kết nối hành khách và nhà xe trên toàn quốc.</p>
          </div>
          <div>
            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>LIÊN HỆ</p>
            <p style={{ fontSize: 13, lineHeight: 2 }}>📧 support@vantrinh.vn</p>
            <p style={{ fontSize: 13, lineHeight: 2 }}>📞 1900 6789</p>
            <p style={{ fontSize: 13, lineHeight: 2 }}>🕐 7:00 – 22:00 hàng ngày</p>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '40px auto 0', borderTop: '1px solid #1e293b', paddingTop: 20, textAlign: 'center', fontSize: 12 }}>
          © 2026 Vận Trình. Hệ thống quản lý nhà xe.
        </div>
      </footer>

      {/* ---- CHATBOT BUBBLE ---- */}
      {/* Nút mở chat */}
      <button
        onClick={() => setChatOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
          border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
          display: chatOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        title="Hỗ trợ trực tuyến"
      >
        <span style={{ fontSize: 24 }}>💬</span>
        {/* Badge thông báo */}
        <span style={{
          position: 'absolute', top: -2, right: -2,
          background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 900,
          borderRadius: '50%', width: 18, height: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff',
        }}>1</span>
      </button>

      {/* Cửa sổ chat */}
      {chatOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          width: 360, height: 500, borderRadius: 20,
          background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header chat */}
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>🤖 Hỗ trợ Vận Trình</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Thường trả lời trong vài phút</p>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.from === 'user' ? '#2563eb' : '#f1f5f9',
                  color: msg.from === 'user' ? '#fff' : '#1e293b',
                  fontSize: 13, fontWeight: 500, lineHeight: 1.5,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập câu hỏi của bạn..."
              style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 12, padding: '8px 14px', fontSize: 13, outline: 'none' }}
            />
            <button
              onClick={sendMessage}
              style={{ background: '#2563eb', border: 'none', borderRadius: 12, padding: '8px 14px', cursor: 'pointer', color: '#fff' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
