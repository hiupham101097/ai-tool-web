import { useEffect, useState } from "react";
import { STEPS } from "../../shared/schema";

interface ProgressProps {
  stepIndex: number;
  promptText?: string;
}

const TIPS = [
  "💡 AI đang phối bảng màu phù hợp với ngành nghề và phong cách bạn chọn.",
  "✨ Toàn bộ mã nguồn HTML & CSS chuẩn chỉnh sẽ sẵn sàng để bạn tải về máy.",
  "📱 Website được tự động tối ưu hiển thị đẹp mắt trên cả máy tính, máy tính bảng và điện thoại.",
  "🎯 Bạn có thể thoải mái xem trước và yêu cầu AI tinh chỉnh lại theo ý muốn.",
  "⚡ Không cần biết lập trình, mở file tải về là chạy ngay trên bất kỳ trình duyệt nào.",
];

export function Progress({ stepIndex, promptText }: ProgressProps) {
  const [seconds, setSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 4500);
    return () => clearInterval(tipTimer);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m > 0 ? `${m}m ` : ""}${s < 10 ? `0${s}` : s}s`;
  };

  return (
    <div className="panel progress-panel" role="status" aria-live="polite">
      <div className="ai-thinking-header">
        <div className="ai-avatar-pulse">
          <div className="pulse-ring" />
          <div className="ai-icon">✨</div>
        </div>
        <div className="ai-header-text">
          <h2 className="ai-title">AI đang suy nghĩ và tạo website...</h2>
          <p className="ai-sub-notice">
            <span className="wait-badge">⏳ Vui lòng chờ trong ít phút</span>
            <span className="time-elapsed">Đã xử lý: {formatTime(seconds)}</span>
          </p>
        </div>
      </div>

      {promptText && (
        <div className="prompt-preview-box">
          <span className="prompt-label">Yêu cầu của bạn:</span>
          <p className="prompt-content">"{promptText}"</p>
        </div>
      )}

      <ol className="steps">
        {STEPS.map((s, i) => {
          const isDone = i < stepIndex;
          const isActive = i === stepIndex;
          const state = isDone ? "done" : isActive ? "active" : "todo";
          return (
            <li key={s.id} className={`step-item ${state}`}>
              <div className="step-indicator">
                {isDone ? (
                  <span className="step-check">✓</span>
                ) : (
                  <span className="dot" aria-hidden />
                )}
              </div>
              <div className="step-info">
                <span className="step-name">{s.label}</span>
                {isActive && <span className="step-status-tag">Đang xử lý...</span>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="tip-box">
        <div className="tip-text">{TIPS[tipIndex]}</div>
      </div>
    </div>
  );
}
