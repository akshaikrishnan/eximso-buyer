import type { Config } from "tailwindcss";
const aspectRatio = require("@tailwindcss/aspect-ratio");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        shine: "shine 1s",
      },
      keyframes: {
        shine: {
          "100%": { left: "125%" },
        },
      },
      colors: {
        body: "#5A5A5A",
        eximblue: {
          "50": "#eff0fe",
          "100": "#e1e4fe",
          "200": "#c9ccfc",
          "300": "#a8aaf9",
          "400": "#8b85f4",
          "500": "#7868ec",
          "600": "#6749df",
          "700": "#5b3dc5",
          "800": "#4a349f",
          "900": "#3f317e",
          "950": "#251d49",
        },
        gray: {
          50: "#FBFBFB",
          100: "#F1F1F1",
          150: "#F4F4F4",
          175: "#F9F9F9",
        },
      },
    },
  },
  plugins: [aspectRatio],
};
export default config;
