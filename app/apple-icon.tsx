import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "38px",
          background: "linear-gradient(140deg, #2563eb, #0f172a)",
          color: "#f8fafc",
          fontSize: 70,
          fontWeight: 700,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        401k
      </div>
    ),
    size
  );
}
