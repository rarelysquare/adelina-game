import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#F7F3EE",
          100: "#EDE5D8",
          200: "#D8CCBA",
          300: "#B5C9B0",
          400: "#8EB89A",
          500: "#6FA882",
          600: "#5A9270",
          700: "#427558",
          800: "#2E5840",
          900: "#1C3D2A",
        },
        cream: {
          50:  "#FDFAF6",
          100: "#FAF4EC",
          200: "#F2E8D8",
        },
        blush: {
          100: "#F5DDD5",
          400: "#D9927A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
