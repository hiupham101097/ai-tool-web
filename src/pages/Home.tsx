import { useState, useRef } from "react";
import { useGenerate } from "../lib/useGenerate";
import { Progress } from "../components/Progress";
import { PreviewStudio } from "../components/PreviewStudio";

const INSPIRATION_CHIPS = [
  "☕ Landing page quán cà phê acoustic phong cách ấm áp, có menu đồ uống và form đặt bàn trước",
  "🏋️ Trang giới thiệu trung tâm Gym & Yoga với bảng giá các gói tập và lịch học trong tuần",
  "📷 Portfolio cá nhân cho nhiếp ảnh gia tự do với bộ sưu tập ảnh và thông tin liên hệ dịch vụ",
  "🚀 Landing page cho sản phẩm SaaS quản lý công việc với danh sách tính năng và bảng giá",
  "🍱 Trang giới thiệu nhà hàng sushi cao cấp với thực đơn đặc sắc và form đặt chỗ trực tuyến",
  "📚 Trang bán khóa học lập trình web thực chiến từ cơ bản đến nâng cao",
];

export default function Home() {
  const { status, stepIndex, spec, projectId, error, generate, reset, startOver } = useGenerate();
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const handleStartGeneration = (textToUse?: string) => {
    const text = (textToUse ?? prompt).trim();
    if (!text) return;
    setSubmittedPrompt(text);
    generate(text, spec);
  };

  const handleTweak = (tweakText: string) => {
    setSubmittedPrompt(tweakText);
    generate(tweakText, spec);
  };

  const scrollToInput = () => {
    promptInputRef.current?.focus();
    promptInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="landing-layout">
      {/* Navbar */}
      <header className="nav-container">
        <div className="nav-brand">
          <span className="brand-logo">⚡</span>
          <div>
            <strong className="brand-name">Dựng.site</strong>
            <span className="brand-badge-pill">AI Web Builder</span>
          </div>
        </div>
        <nav className="nav-menu">
          <a href="#how-it-works" className="nav-link">Cách hoạt động</a>
          <a href="#features" className="nav-link">Tính năng</a>
          <button className="btn btn-nav-cta" onClick={scrollToInput}>
            ✨ Bắt đầu tạo ngay
          </button>
        </nav>
      </header>

      {/* Hero Section with Direct Interactive Prompt Box */}
      <section className="hero-section">
        <div className="hero-pill-announcement">
          <span className="sparkle-icon">🚀</span>
          <span>Tạo website tức thì chỉ với một câu mô tả ý tưởng</span>
        </div>

        <h1 className="hero-main-title">
          Ý tưởng trong đầu bạn,<br />
          <span className="gradient-text">Website hoàn chỉnh chỉ sau ít phút</span>
        </h1>

        <p className="hero-description">
          Nhập mong muốn của bạn. AI sẽ suy nghĩ, thiết kế bố cục, viết nội dung và xuất bản ngay website trực tiếp để bạn xem trước và tải mã nguồn về dùng hoàn toàn miễn phí.
        </p>

        {/* Central AI Prompt Card */}
        <div className="main-prompt-card">
          <div className="prompt-card-header">
            <span className="prompt-header-icon">✨</span>
            <label htmlFor="prompt-box">Mô tả website bạn muốn tạo:</label>
          </div>

          <textarea
            id="prompt-box"
            ref={promptInputRef}
            className="prompt-textarea"
            rows={4}
            maxLength={1500}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ví dụ: Tạo landing page quán cà phê phong cách vintage ấm cúng, có bảng menu các món đặc trưng, bảng giá và form đăng ký đặt bàn trước..."
            onKeyDown={e => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleStartGeneration();
              }
            }}
          />

          <div className="prompt-card-footer">
            <span className="char-count">{prompt.length} / 1500 ký tự</span>
            <button
              className="btn btn-create-main"
              disabled={!prompt.trim() || status === "generating"}
              onClick={() => handleStartGeneration()}
            >
              🚀 Tạo Website Bằng AI
            </button>
          </div>

          {/* Inspiration Chips */}
          <div className="chips-section">
            <span className="chips-title">💡 Gợi ý nhanh:</span>
            <div className="chips-list">
              {INSPIRATION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="prompt-chip"
                  onClick={() => {
                    setPrompt(chip);
                    promptInputRef.current?.focus();
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow: 3 Steps */}
      <section id="how-it-works" className="section-block workflow-section">
        <div className="section-header">
          <span className="section-badge">Quy trình thông minh</span>
          <h2>Cách website của bạn ra đời</h2>
          <p>Đơn giản, tốc độ và bạn luôn là người nắm quyền quyết định tải về.</p>
        </div>

        <div className="workflow-grid">
          <div className="workflow-step">
            <div className="step-num">01</div>
            <div className="step-content">
              <h3>Đưa yêu cầu bằng lời nói</h3>
              <p>Mô tả tự nhiên ý tưởng website, ngành nghề kinh doanh, tông màu mong muốn hoặc đối tượng khách hàng của bạn.</p>
            </div>
          </div>

          <div className="workflow-step">
            <div className="step-num">02</div>
            <div className="step-content">
              <h3>AI suy nghĩ & tạo dựng</h3>
              <p>Hệ thống AI xử lý ngữ nghĩa, cấu trúc hóa từng section (Hero, Danh mục, Bảng giá, Form liên hệ, Footer) và phối màu hài hòa.</p>
            </div>
          </div>

          <div className="workflow-step">
            <div className="step-num">03</div>
            <div className="step-content">
              <h3>Xem trước & Tải về sử dụng</h3>
              <p>Trải nghiệm ngay website của bạn trên giao diện Máy tính và Điện thoại. Tải trọn bộ file HTML về máy chỉ với một click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="section-block features-section">
        <div className="section-header">
          <span className="section-badge">Ưu thế vượt trội</span>
          <h2>Không cần biết code, vẫn có website chuyên nghiệp</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📥</div>
            <h3>Tải mã nguồn HTML độc lập</h3>
            <p>Sau khi AI tạo xong, bạn có thể tải ngay file <code>index.html</code> hoàn chỉnh về máy tính. Mở đúp chuột là chạy ngay, không cần cài đặt phức tạp.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Tự động phối màu & Typography</h3>
            <p>AI tự động chọn bảng màu thương hiệu chuẩn thẩm mỹ và font chữ tiếng Việt sắc nét (Be Vietnam Pro, Bricolage Grotesque).</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Tương thích mọi thiết bị</h3>
            <p>Giao diện tự động co giãn và hiển thị mượt mà trên iPhone, Android, iPad cũng như màn hình máy tính lớn.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Tinh chỉnh liên tục theo ý bạn</h3>
            <p>Chưa hoàn toàn ưng ý? Chỉ cần yêu cầu tiếp: "Đổi màu", "Viết lại lời giới thiệu" - AI sẽ lập tức cập nhật lại trước khi bạn tải về.</p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="cta-bottom-banner">
        <h2>Sẵn sàng biến ý tưởng thành website?</h2>
        <p>Bắt đầu ngay bây giờ hoàn toàn miễn phí. Chỉ mất ít phút để thấy kết quả!</p>
        <button className="btn btn-cta-large" onClick={scrollToInput}>
          🚀 Tạo website của bạn ngay
        </button>
      </section>

      {/* Footer */}
      <footer className="lp-footer-container">
        <div className="footer-top">
          <div>
            <strong>Dựng.site</strong> – Nền tảng tạo website thông minh bằng AI
          </div>
          <p>© {new Date().getFullYear()} Dựng.site. Bản quyền được bảo lưu.</p>
        </div>
      </footer>

      {/* Loading Modal: AI Suy Nghĩ ("Vui lòng chờ trong ít phút") */}
      {status === "generating" && (
        <div className="overlay" role="dialog" aria-modal="true">
          <Progress stepIndex={stepIndex} promptText={submittedPrompt} />
        </div>
      )}

      {/* Result: Live Preview Studio for Evaluation & Download */}
      {status === "done" && spec && (
        <div className="overlay overlay-fullscreen" role="dialog" aria-modal="true">
          <PreviewStudio
            spec={spec}
            projectId={projectId}
            onTweak={handleTweak}
            onStartOver={startOver}
            onClose={reset}
          />
        </div>
      )}

      {/* Error Modal */}
      {status === "error" && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="panel error-panel">
            <div className="error-icon">⚠️</div>
            <h2>Chưa thể hoàn thành website</h2>
            <p className="error-msg">{error || "Đã xảy ra sự cố khi kết nối với AI. Vui lòng thử lại sau."}</p>
            <div className="row" style={{ marginTop: "1.5rem" }}>
              <button className="btn btn-ghost" onClick={reset}>
                Đóng
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleStartGeneration(submittedPrompt)}
              >
                Thử lại ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
