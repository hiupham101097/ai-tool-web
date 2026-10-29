import { useState } from "react";
import type { Spec } from "../../shared/schema";
import { Renderer } from "./Renderer";
import { downloadWebsite, copyWebsiteHtml, generateStandaloneHtml } from "../lib/exportHtml";

interface PreviewStudioProps {
  spec: Spec;
  projectId: string | null;
  onTweak: (prompt: string) => void;
  onStartOver: () => void;
  onClose: () => void;
}

type Viewport = "desktop" | "tablet" | "mobile";

export function PreviewStudio({
  spec,
  projectId,
  onTweak,
  onStartOver,
  onClose,
}: PreviewStudioProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [tweakText, setTweakText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleDownload = () => {
    downloadWebsite(spec, "my-website.html");
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleCopyCode = async () => {
    const success = await copyWebsiteHtml(spec);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyLink = () => {
    if (!projectId) return;
    const shareUrl = `${window.location.origin}/p/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTweakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweakText.trim()) return;
    onTweak(tweakText.trim());
    setTweakText("");
  };

  const viewportWidths: Record<Viewport, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  return (
    <div className="preview-studio">
      {/* Top Bar */}
      <header className="studio-topbar">
        <div className="studio-left">
          <div className="brand-badge">
            <span className="live-dot" />
            <strong>Xem trước Website</strong>
          </div>

          <div className="viewport-toggles">
            <button
              className={`vp-btn ${viewport === "desktop" ? "active" : ""}`}
              onClick={() => setViewport("desktop")}
              title="Xem giao diện Máy tính"
            >
              🖥️ Máy tính
            </button>
            <button
              className={`vp-btn ${viewport === "tablet" ? "active" : ""}`}
              onClick={() => setViewport("tablet")}
              title="Xem giao diện Máy tính bảng"
            >
              📱 Tablet
            </button>
            <button
              className={`vp-btn ${viewport === "mobile" ? "active" : ""}`}
              onClick={() => setViewport("mobile")}
              title="Xem giao diện Điện thoại"
            >
              📱 Điện thoại
            </button>
          </div>
        </div>

        <div className="studio-actions">
          <button
            className="btn btn-download-primary"
            onClick={handleDownload}
            title="Tải trọn bộ file HTML & CSS độc lập về máy tính"
          >
            📥 <span>Tải về Website (.html)</span>
          </button>

          <button className="btn btn-secondary" onClick={handleCopyCode}>
            {copied ? "✓ Đã sao chép HTML!" : "📋 Sao chép Code"}
          </button>

          {projectId && (
            <button className="btn btn-ghost" onClick={handleCopyLink} title="Chia sẻ liên kết trực tiếp">
              {copiedLink ? "✓ Đã chép link!" : "🔗 Chia sẻ"}
            </button>
          )}

          <button className="btn btn-ghost" onClick={() => setShowCodeModal(true)}>
            {"</>"} Xem mã nguồn
          </button>

          <button className="btn btn-ghost" onClick={onStartOver}>
            Tạo mới
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            ✕ Đóng
          </button>
        </div>
      </header>

      {/* Decision Notification Banner */}
      <div className="decision-banner">
        <div className="decision-content">
          <span className="decision-icon">💡</span>
          <div>
            <strong>Xem giao diện và quyết định tải về:</strong>
            <span>
              {" "}Trang web đã được tạo hoàn tất. Bạn có thể kiểm tra trực tiếp, yêu cầu AI đổi màu/nội dung nếu chưa ưng ý, hoặc bấm <strong>"Tải về Website"</strong> để lưu file HTML độc lập và sử dụng ngay lập tức!
            </span>
          </div>
        </div>
        {downloadSuccess && (
          <div className="download-toast">
            ✓ Đã tải file <code>my-website.html</code> thành công về máy của bạn!
          </div>
        )}
      </div>

      {/* Tweak / Chat Bar */}
      <form className="tweak-toolbar" onSubmit={handleTweakSubmit}>
        <div className="tweak-input-wrap">
          <span className="tweak-icon">💬</span>
          <input
            value={tweakText}
            onChange={e => setTweakText(e.target.value)}
            placeholder="Muốn chỉnh sửa gì thêm? VD: 'Đổi màu chủ đạo sang xanh lá', 'Thêm phần đánh giá khách hàng'..."
          />
          <button
            type="submit"
            className="btn btn-tweak-apply"
            disabled={!tweakText.trim()}
          >
            Áp dụng tinh chỉnh
          </button>
        </div>
      </form>

      {/* Viewport Frame */}
      <main className="studio-viewport-container">
        <div
          className={`studio-frame-wrapper viewport-${viewport}`}
          style={{ maxWidth: viewportWidths[viewport] }}
        >
          {viewport !== "desktop" && (
            <div className="device-notch-bar">
              <span className="notch-speaker" />
            </div>
          )}
          <div className="studio-content-scroll">
            <Renderer spec={spec} />
          </div>
        </div>
      </main>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="overlay code-modal-overlay" onClick={() => setShowCodeModal(false)}>
          <div className="panel code-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="code-modal-header">
              <h3>Mã nguồn HTML độc lập (Standalone)</h3>
              <button className="btn btn-ghost" onClick={() => setShowCodeModal(false)}>✕</button>
            </div>
            <p className="code-modal-desc">
              Toàn bộ website đóng gói trong 1 file HTML, bao gồm nội dung, kiểu dáng responsive và Google Fonts. Bạn có thể mở trực tiếp hoặc tải về máy.
            </p>
            <textarea
              className="code-view-area"
              readOnly
              value={generateStandaloneHtml(spec)}
              rows={16}
            />
            <div className="row" style={{ marginTop: "1rem" }}>
              <button className="btn btn-ghost" onClick={handleCopyCode}>
                {copied ? "✓ Đã sao chép!" : "Sao chép toàn bộ"}
              </button>
              <button className="btn btn-download-primary" onClick={handleDownload}>
                📥 Tải file .html về máy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

