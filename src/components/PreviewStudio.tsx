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
      {/* Sleek Compact Top Bar (Height: 46px) */}
      <header className="studio-topbar">
        <div className="studio-left">
          <div className="brand-badge">
            <span className="live-dot" />
            <strong className="brand-title">Xem trước</strong>
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
              📱 Mobile
            </button>
          </div>
        </div>

        <div className="studio-actions">
          <button
            className="btn btn-download-primary btn-sm"
            onClick={handleDownload}
            title="Tải trọn bộ file HTML & CSS độc lập về máy tính"
          >
            📥 <span>Tải HTML</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={handleCopyCode}>
            {copied ? "✓ Đã chép!" : "📋 Chép code"}
          </button>

          {projectId && (
            <button className="btn btn-ghost btn-sm" onClick={handleCopyLink} title="Chia sẻ liên kết trực tiếp">
              {copiedLink ? "✓ Đã chép link!" : "🔗 Chia sẻ"}
            </button>
          )}

          <button className="btn btn-ghost btn-sm" onClick={() => setShowCodeModal(true)}>
            {"</>"} Code
          </button>

          <button className="btn btn-ghost btn-sm" onClick={onStartOver}>
            Tạo mới
          </button>
          <button className="btn btn-ghost btn-sm btn-close" onClick={onClose} title="Đóng xem trước">
            ✕
          </button>
        </div>
      </header>

      {/* Floating Download Toast */}
      {downloadSuccess && (
        <div className="floating-download-toast">
          ✓ Đã tải file <code>my-website.html</code> thành công về máy của bạn!
        </div>
      )}

      {/* Viewport Frame - Fills the entire screen! */}
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

      {/* Floating Bottom Tweak Pill - Doesn't push the website down! */}
      <form className="floating-tweak-bar" onSubmit={handleTweakSubmit}>
        <div className="floating-tweak-inner">
          <span className="tweak-icon">💬</span>
          <input
            value={tweakText}
            onChange={e => setTweakText(e.target.value)}
            placeholder="Muốn đổi màu, thêm bảng giá, sửa tiêu đề...? Nhập tại đây..."
          />
          <button
            type="submit"
            className="btn btn-tweak-apply"
            disabled={!tweakText.trim()}
          >
            Áp dụng
          </button>
        </div>
      </form>

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

