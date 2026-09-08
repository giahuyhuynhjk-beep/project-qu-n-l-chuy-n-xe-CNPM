import React, { useState, useRef } from 'react';
import { AlertTriangle, Camera, Send, CheckCircle, X } from 'lucide-react';

// ============================================================
// INCIDENT REPORT – Báo cáo sự cố + AI camera placeholder
// ============================================================
const INCIDENT_TYPES = [
  'Nổ lốp xe',
  'Va chạm giao thông',
  'Hỏng động cơ',
  'Tai nạn',
  'Kẹt xe / Chậm trễ',
  'Khách hàng gây rối',
  'Phát hiện buồn ngủ (AI)',
  'Khác',
];

export default function IncidentReport() {
  const [type, setType]         = useState('');
  const [desc, setDesc]         = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [aiAlert, setAiAlert]   = useState(null); // AI detection result
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Mở camera (AI nhận diện khuôn mặt placeholder)
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamActive(true);

      // Simulate AI detection after 3 seconds
      setTimeout(() => {
        setAiAlert({
          type: 'drowsy',
          message: '⚠️ Phát hiện dấu hiệu buồn ngủ! Khuyến cáo dừng xe nghỉ ngơi.',
          severity: 'high',
        });
      }, 3000);
    } catch (err) {
      alert('Không thể truy cập camera: ' + err.message);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCamActive(false);
    setAiAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !desc) return;
    setSubmitting(true);

    // TODO: gọi API POST /su-co/ khi backend có endpoint
    await new Promise((r) => setTimeout(r, 1200));

    setSubmitted(true);
    setSubmitting(false);
    stopCamera();
  };

  if (submitted) return (
    <div style={{ padding: 24, textAlign: 'center', color: '#f1f5f9' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Đã gửi báo cáo!</h3>
      <p style={{ color: '#94a3b8', marginBottom: 24 }}>Hệ thống đã nhận sự cố. Nhân viên điều phối sẽ liên hệ sớm.</p>
      <button
        onClick={() => { setSubmitted(false); setType(''); setDesc(''); setLocation(''); }}
        style={{ background: '#22d3ee', color: '#0f172a', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}
      >
        Báo cáo mới
      </button>
    </div>
  );

  return (
    <div style={{ padding: '20px 16px', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <AlertTriangle size={20} color="#f59e0b" />
          <h2 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 900, margin: 0 }}>Báo cáo sự cố</h2>
        </div>
        <p style={{ color: '#64748b', fontSize: 13 }}>Ghi nhận và gửi sự cố đến trung tâm điều hành ngay lập tức.</p>
      </div>

      {/* ---- AI CAMERA SECTION ---- */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,211,238,0.2)',
        borderRadius: 16, padding: 16, marginBottom: 20,
      }}>
        <p style={{ color: '#22d3ee', fontSize: 11, fontWeight: 800, marginBottom: 10, letterSpacing: '0.08em' }}>
          🤖 GIÁM SÁT AI – NHẬN DIỆN KHUÔN MẶT
        </p>

        {/* AI Alert */}
        {aiAlert && (
          <div style={{
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 12,
            color: '#fca5a5', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>{aiAlert.message}</span>
            <button onClick={() => setAiAlert(null)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {camActive ? (
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{ width: '100%', borderRadius: 12, aspectRatio: '16/9', objectFit: 'cover', background: '#000' }}
            />
            {/* AI overlay */}
            <div style={{
              position: 'absolute', top: 8, right: 8,
              background: aiAlert ? 'rgba(239,68,68,0.9)' : 'rgba(34,197,94,0.9)',
              color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6,
            }}>
              {aiAlert ? '⚠️ CẢNH BÁO' : '✅ BÌNH THƯỜNG'}
            </div>
            <button
              onClick={stopCamera}
              style={{ width: '100%', marginTop: 8, padding: '10px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', fontWeight: 700, cursor: 'pointer' }}
            >
              Tắt camera
            </button>
          </div>
        ) : (
          <button
            onClick={startCamera}
            style={{
              width: '100%', padding: '14px', borderRadius: 12, border: '1px dashed rgba(34,211,238,0.3)',
              background: 'rgba(34,211,238,0.05)', color: '#22d3ee', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13,
            }}
          >
            <Camera size={18} />
            Bật camera giám sát AI
          </button>
        )}
      </div>

      {/* ---- FORM BÁO CÁO ---- */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Loại sự cố */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Loại sự cố *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {INCIDENT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{
                  padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, textAlign: 'left',
                  background: type === t ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                  color: type === t ? '#fbbf24' : '#94a3b8',
                  outline: type === t ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Vị trí */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Vị trí xảy ra
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ví dụ: Km 45, Quốc lộ 1A, Bình Dương"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#f1f5f9', fontSize: 13, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Mô tả */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Mô tả chi tiết *
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Mô tả tình huống, mức độ nghiêm trọng và hành động đã thực hiện..."
            rows={4}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#f1f5f9', fontSize: 13, outline: 'none',
              resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!type || !desc || submitting}
          style={{
            padding: '14px', borderRadius: 12, border: 'none',
            background: (!type || !desc || submitting) ? '#374151' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: (!type || !desc || submitting) ? '#64748b' : '#fff',
            fontWeight: 900, fontSize: 14, cursor: (!type || !desc || submitting) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Send size={16} />
          {submitting ? 'Đang gửi...' : 'Gửi báo cáo khẩn'}
        </button>
      </form>
    </div>
  );
}
