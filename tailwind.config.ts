/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#722F37", // Merlot: A deep, rich wine red
          light: "#9E424E", // Rose: Lighter, softer red for accents/highlights
          dark: "#4A1A21", // Dregs: A very deep, almost brown-red for hover states
        },
        app: {
          bg: "#161213", // Warm Black: Deep charcoal with a tiny hint of red warmth
          card: "#241E20", // Dark Mulberry: Distinct from bg, but blends with the theme
          text: "#F3E9EB", // Paper White: Soft off-white (better for reading than #FFF)
          muted: "#A89CA0", // Warm Gray: Muted text with warm undertones
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        // I recommend adding a Serif font for actual story content:
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
