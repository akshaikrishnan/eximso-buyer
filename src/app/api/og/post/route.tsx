// og/post/route.tsx

import { ImageResponse } from "next/og";

// Since this is for a dynamic OG image, it will need to run on the Edge
export const runtime = "edge";

// Standard OG Image dimensions (1.91:1 aspect ratio)
const size = {
  width: 1200,
  height: 630,
};

const contentType = "image/png";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
// Custom font loading function (you'll need to adjust the path to your actual font file)
// Note: next/og supports a limited set of fonts, and 'Geist' might need explicit loading.
// For simplicity in this example, we'll use a placeholder for the font data.
const fetchFont = async () => {
  // Replace '/path/to/Geist.ttf' with the actual path to your font file
  // and load it as an ArrayBuffer. For a real project, consider using a hosted
  // font or a custom local path setup that works with the Vercel build/edge runtime.
  // For a basic example, we will skip custom font loading or use a system font.
  // If you *must* load a custom font, it might look like this:
  /*
  const fontFile = await fetch(
    new URL('./Geist.ttf', import.meta.url)
  );
  return fontFile.arrayBuffer();
  */

  return null; // Using system fonts as fallback
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 1. Get query parameters with fallbacks
  const title = searchParams.get("title") ?? "Untitled Blog Post";
  const imageUrl = searchParams.get("image"); // Main blog post image
  const authorName = searchParams.get("author") ?? "The Author";
  const theme = (searchParams.get("theme") ?? "light").toLowerCase();
  const isDark = theme !== "light";

  // 2. Define colors based on theme
  const background = isDark
    ? "linear-gradient(135deg, #0a0c1b 0%, #181c33 55%, #1f2440 100%)"
    : "linear-gradient(135deg, #f5f7ff 0%, #dde6ff 55%, #ffffff 100%)";
  const primaryColor = "#818cf8"; // Accent purple
  const textPrimary = isDark ? "#f8fafc" : "#0f172a";
  const textMuted = isDark ? "rgba(226,232,255,0.8)" : "rgba(15,23,42,0.72)";
  // 3. Load custom font (if necessary and configured)
  // const fontData = await fetchFont();

  // 4. Return the ImageResponse
  return new ImageResponse(
    <div
      style={{
        // Note: using 'system-ui' as a reliable font for the Edge runtime
        fontFamily: "system-ui, sans-serif",
        background,
        color: textPrimary,
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "row", // Horizontal layout for the post OG image
        alignItems: "stretch",
        justifyContent: "space-between",
      }}
    >
      {/* Background gradient effects (optional but sophisticated) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "radial-gradient(circle at 20% 20%, rgba(129,140,248,0.35), transparent 60%), radial-gradient(circle at 80% 80%, rgba(34,211,238,0.2), transparent 55%)"
            : "radial-gradient(circle at 20% 20%, rgba(129,140,248,0.25), transparent 60%), radial-gradient(circle at 80% 80%, rgba(34,211,238,0.18), transparent 55%)",
        }}
      />

      {/* 5. Left Section: Title and Author Info */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px 60px 80px",
          width: "60%", // Takes up 60% of the space
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: 0,
            // Truncate title to fit
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            // Note: Line clamping might not be perfectly supported by Satori/next/og
            // A safer approach might be to truncate the string length.
            maxHeight: "350px",
          }}
        >
          {title}
        </h1>

        {/* Author info at the bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 40,
          }}
        >
          {/* Author Name */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: primaryColor,
              }}
            >
              Written by
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: textPrimary,
                marginTop: 4,
              }}
            >
              {authorName}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Right Section: Blog Post Image */}
      <div
        style={{
          display: "flex",
          width: "40%", // Takes up 40% of the space
          // Add an overlay gradient for a stylish transition
          background: isDark
            ? `linear-gradient(to left, ${
                background.split(",")[0]
              } 0%, transparent 10%)`
            : `linear-gradient(to left, ${
                background.split(",")[0]
              } 0%, transparent 10%)`,
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Post thumbnail"
            // Image must fill the container
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              right: 0,
              top: 0,
              zIndex: 5,
            }}
          />
        )}

        {/* Semi-transparent overlay to ensure text contrast on the left (if needed) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to right, ${
              background.split(",")[0]
            } 30%, transparent 90%)`,
            zIndex: 10, // Must be above the image
          }}
        />
      </div>
    </div>,
    {
      ...size,
      // fonts: fontData ? [{ name: "Geist", data: fontData, style: "normal", weight: 400 }] : [],
    },
  );
}
