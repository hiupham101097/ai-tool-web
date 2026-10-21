import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Renderer } from "../components/Renderer";
import type { Spec } from "../../shared/schema";

export default function Shared() {
  const { id } = useParams();
  const [spec, setSpec] = useState<Spec | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: any) => setSpec(d.spec))
      .catch(() => setErr("Không tìm thấy website này."));
  }, [id]);

  if (err) return <p className="center-msg">{err}</p>;
  if (!spec) return <p className="center-msg">Đang tải…</p>;
  return <Renderer spec={spec} />;
}
