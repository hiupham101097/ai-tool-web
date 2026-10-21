import { STEPS } from "../../shared/schema";

export function Progress({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="panel" role="status" aria-live="polite">
      <h2>Đang tạo website của bạn</h2>
      <ol className="steps">
        {STEPS.map((s, i) => {
          const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "todo";
          return (
            <li key={s.id} className={state}>
              <span className="dot" aria-hidden />
              {s.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
