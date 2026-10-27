import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./middleware/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "rich-black": "#141414",
        "off-black": "#1c1c1c",
        cream: "#f5f5f0",
        "gold-accent": "#d4af37",
        muted: "#888888",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
