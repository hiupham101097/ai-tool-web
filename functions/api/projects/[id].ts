// GET /api/projects/:id  → bản template mới nhất để chia sẻ link /p/:id
export const onRequestGet: PagesFunction<{ DB: D1Database }> = async ({ params, env }) => {
  const row = await env.DB.prepare(
    "SELECT spec, version FROM templates WHERE project_id = ? ORDER BY version DESC LIMIT 1"
  ).bind(params.id).first<{ spec: string; version: number }>();
  if (!row) return Response.json({ error: "Không tìm thấy." }, { status: 404 });
  return Response.json({ spec: JSON.parse(row.spec), version: row.version });
};
