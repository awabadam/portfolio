import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateOGImage(title: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#a1a1aa",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}
          >
            AWAB DESIGN
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 24,
                color: "#a1a1aa",
                maxWidth: "700px",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            fontSize: 20,
            color: "#52525b",
          }}
        >
          awab.design
        </div>
      </div>
    ),
    { ...size }
  );
}
