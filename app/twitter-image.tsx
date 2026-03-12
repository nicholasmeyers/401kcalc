import { ImageResponse } from "next/og";

export const alt = "401kcalc retirement planning";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f8fafc",
          color: "#0f172a",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "66px 70px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #cbd5e1",
            borderRadius: "999px",
            height: "42px",
            padding: "0 18px",
            fontSize: "24px",
            color: "#1e293b",
            background: "rgba(255, 255, 255, 0.82)",
          }}
        >
          401kcalc
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "980px" }}>
          <div style={{ fontSize: "66px", fontWeight: 700, lineHeight: 1.1 }}>
            Model your 401(k) path with confidence
          </div>
          <div style={{ fontSize: "33px", lineHeight: 1.3, color: "#334155" }}>
            Calculator + benchmarks + methodology in one focused planning experience.
          </div>
        </div>
      </div>
    ),
    size
  );
}
