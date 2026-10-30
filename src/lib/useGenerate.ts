import { useCallback, useState } from "react";
import { STEPS, type Spec } from "../../shared/schema";

type Status = "idle" | "generating" | "done" | "error";

export function useGenerate() {
  const [status, setStatus] = useState<Status>(() => {
    try {
      return sessionStorage.getItem("agy_last_spec") ? "done" : "idle";
    } catch {
      return "idle";
    }
  });
  const [stepIndex, setStepIndex] = useState(-1);
  const [spec, setSpec] = useState<Spec | null>(() => {
    try {
      const saved = sessionStorage.getItem("agy_last_spec");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [projectId, setProjectId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("agy_last_pid");
    } catch {
      return null;
    }
  });
  const [error, setError] = useState("");

  const generate = useCallback(async (prompt: string, currentSpec?: Spec | null, isTweak?: boolean) => {
    const id = projectId ?? crypto.randomUUID();
    setProjectId(id); setStatus("generating"); setStepIndex(0); setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, prompt, currentSpec, isTweak }),
      });
      if (!res.ok || !res.body) {
        const j: any = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Lỗi kết nối.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop()!;
        for (const p of parts) {
          const event = p.match(/event: (.+)/)?.[1];
          const data = JSON.parse(p.match(/data: (.+)/)?.[1] ?? "{}");
          if (event === "step") setStepIndex(STEPS.findIndex(s => s.id === data.id));
          if (event === "done") {
            setSpec(data.spec);
            setStatus("done");
            try {
              sessionStorage.setItem("agy_last_spec", JSON.stringify(data.spec));
              sessionStorage.setItem("agy_last_pid", data.projectId || id);
            } catch {}
          }
          if (event === "error") { setError(data.message); setStatus("error"); }
        }
      }
    } catch (e: any) {
      setError(e.message ?? "Có lỗi xảy ra."); setStatus("error");
    }
  }, [projectId]);

  const reset = useCallback(() => { setStatus("idle"); setStepIndex(-1); }, []);
  const startOver = useCallback(() => {
    setStatus("idle");
    setSpec(null);
    setProjectId(null);
    try {
      sessionStorage.removeItem("agy_last_spec");
      sessionStorage.removeItem("agy_last_pid");
    } catch {}
  }, []);
  return { status, stepIndex, spec, projectId, error, generate, reset, startOver };
}
