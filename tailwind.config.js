// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0E1A",
        footer: "#0E2741",
        accent: "#57E0FE",
        accentHover: "#45c0db",
      },
      fontFamily: {
        vt323: ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
}
