import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getGuideBySlug } from "@/lib/guides/guides";

export const alt = "401kcalc retirement planning guide";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type OpengraphImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GuideOpengraphImage({ params }: OpengraphImageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            color: "#64748b",
            fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            fontSize: 24,
          }}
        >
          Guide not found
        </div>
      ),
      size
    );
  }

  const logoData = await readFile(join(process.cwd(), "public/images/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  const title = guide.title.length > 70 ? `${guide.title.slice(0, 67)}...` : guide.title;
  const category = guide.category ?? "401(k) Planning";

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
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            {category}
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.12 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#334155", maxWidth: "800px" }}>
            {guide.excerpt}
          </div>
        </div>
      </div>
    ),
    size
  );
}
