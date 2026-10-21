import { useState } from "react";
import { useGenerate } from "../lib/useGenerate";
import { Renderer } from "../components/Renderer";
import { Progress } from "../components/Progress";

const EXAMPLES = [
  "Landing page quán cà phê, tông nâu, có menu và form đặt bàn",
  "Trang giới thiệu phòng gym với bảng giá và lịch tập",
  "Portfolio cho nhiếp ảnh gia cưới, có form liên hệ",
];

export default function Home() {
  const { status, stepIndex, spec, projectId, error, generate, reset, startOver } = useGenerate();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [tweak, setTweak] = useState("");

  const close = () => { setOpen(false); reset(); };

  return (
    <>
      <header className="nav">
        <strong>Dựng.site</strong>
        <button className="btn" onClick={() => setOpen(true)}>Tạo website</button>
      </header>

      <section className="lp-hero">
        <h1>Nói bạn cần gì,<br />website tự hiện ra.</h1>
        <p>Mô tả bằng một đoạn chat. Chúng tôi dựng bố cục, viết nội dung và cho bạn xem kết quả ngay.</p>
        <button className="btn btn-lg" onClick={() => setOpen(true)}>Tạo website của bạn</button>
      </section>

      <section className="lp-features">
        <div><h3>Mô tả tự nhiên</h3><p>Viết như đang nhắn tin cho một người thiết kế.</p></div>
        <div><h3>Xem quá trình dựng</h3><p>Theo dõi từng bước từ phân tích đến hoàn thiện.</p></div>
        <div><h3>Chỉnh bằng lời</h3><p>"Đổi nút sang màu xanh" – không cần chạm vào code.</p></div>
      </section>

      <section className="lp-pricing">
        <h2>Giá</h2>
        <div className="plans">
          <div className="plan"><h3>Dùng thử</h3><p className="price">0đ</p><p>10 lần tạo mỗi giờ</p></div>
          <div className="plan"><h3>Pro</h3><p className="price">199.000đ/tháng</p><p>Không giới hạn, xuất bản tên miền riêng</p></div>
        </div>
      </section>

      <footer className="lp-footer">© {new Date().getFullYear()} Dựng.site</footer>

      {open && (
        <div className="overlay" role="dialog" aria-modal="true">
          {status === "idle" && (
            <div className="panel">
              <h2>{spec ? "Chỉnh sửa website" : "Bạn muốn website như thế nào?"}</h2>
              <>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} maxLength={1500}
                    placeholder="VD: Landing page quán cà phê, tông nâu, có menu và bản đồ" />
                  <div className="chips">
                    {EXAMPLES.map(x => <button key={x} className="chip" onClick={() => setPrompt(x)}>{x}</button>)}
                  </div>
                  <div className="row">
                    <button className="btn ghost" onClick={close}>Đóng</button>
                    <button className="btn" disabled={!prompt.trim()} onClick={() => generate(prompt, spec)}>Bắt đầu tạo</button>
                  </div>
                </>
            </div>
          )}

          {status === "generating" && <Progress stepIndex={stepIndex} />}

          {status === "done" && spec && (
            <div className="result">
              <div className="toolbar">
                <input value={tweak} onChange={e => setTweak(e.target.value)} placeholder='Chỉnh tiếp, vd: "đổi màu chủ đạo sang xanh lá"'
                  onKeyDown={e => { if (e.key === "Enter" && tweak.trim()) { generate(tweak, spec); setTweak(""); } }} />
                <button className="btn" disabled={!tweak.trim()} onClick={() => { generate(tweak, spec); setTweak(""); }}>Áp dụng</button>
                <button className="btn ghost" onClick={() => navigator.clipboard.writeText(`${location.origin}/p/${projectId}`)}>Sao chép link</button>
                <button className="btn ghost" onClick={startOver}>Tạo mới</button>
                <button className="btn ghost" onClick={close}>Đóng</button>
              </div>
              <div className="preview"><Renderer spec={spec} /></div>
            </div>
          )}

          {status === "error" && (
            <div className="panel">
              <h2>Chưa tạo được</h2>
              <p>{error}</p>
              <div className="row">
                <button className="btn ghost" onClick={close}>Đóng</button>
                <button className="btn" onClick={reset}>Thử lại</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
