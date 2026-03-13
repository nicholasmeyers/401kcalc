import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "401kcalc retirement projection software";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoData = await readFile(join(process.cwd(), "public/images/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={195} height={30} />
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "980px" }}>
          <div style={{ fontSize: "68px", fontWeight: 700, lineHeight: 1.08 }}>
            401(k) retirement projections
          </div>
          <div style={{ fontSize: "34px", lineHeight: 1.32, color: "#334155" }}>
            Transparent assumptions, dual scenarios, and practical retirement planning guides.
          </div>
        </div>
      </div>
    ),
    size
  );
}
