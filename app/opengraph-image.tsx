import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 45%, #d1fae5 100%)",
          color: "#064e3b"
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800 }}>{siteConfig.name}</div>
        <div>
          <div style={{ maxWidth: 920, fontSize: 68, fontWeight: 900, lineHeight: 1.05 }}>{siteConfig.tagline}</div>
          <div style={{ marginTop: 28, maxWidth: 840, fontSize: 28, color: "#0f766e" }}>
            Symptom guidance • Health education • Public health intelligence • Africa
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#065f46" }}>{siteConfig.domain}</div>
      </div>
    ),
    size
  );
}
