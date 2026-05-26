import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 42,
          background: "linear-gradient(135deg, #118255, #14b8a6)",
          color: "white",
          fontSize: 82,
          fontWeight: 900
        }}
      >
        AP
      </div>
    ),
    size
  );
}
