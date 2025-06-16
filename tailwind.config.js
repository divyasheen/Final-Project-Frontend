// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0E0E1A", // General dark background
        primary: "#0E2741", // Used for footer, navbar background
        secondary: "#57E0FE", // Main accent (buttons, XP highlights)
        secondaryHover: "#45c0db", // Hover effect for secondary
        surface: "#1E1E2F", // Panels or card backgrounds
        codeBlock: "#282C34", // For code snippets and console background
        glow: "rgba(87, 224, 254, 0.3)", // Subtle hover glow
      },
      fontFamily: {
        vt323: ['"VT323"', "monospace"],
      },
      boxShadow: {
        glow: "0 0 8px rgba(87, 224, 254, 0.4)",
      },
      // keyframes: {
      //   glitch: {
      //     "0%": { transform: "translate(0)" },
      //     "20%": { transform: "translate(-2px, 2px)" },
      //     "40%": { transform: "translate(-2px, -2px)" },
      //     "60%": { transform: "translate(2px, 2px)" },
      //     "80%": { transform: "translate(2px, -2px)" },
      //     "100%": { transform: "translate(0)" },
      //   },
      //   glitchTop: {
      //     "0%": { clipPath: "inset(0 0 85% 0)" },
      //     "10%": { clipPath: "inset(10% 0 70% 0)" },
      //     "20%": { clipPath: "inset(0 0 85% 0)" },
      //   },
      //   glitchBottom: {
      //     "0%": { clipPath: "inset(85% 0 0 0)" },
      //     "10%": { clipPath: "inset(70% 0 10% 0)" },
      //     "20%": { clipPath: "inset(85% 0 0 0)" },
      //   },
      // },
      // animation: {
      //   glitch: "glitch 1s infinite linear alternate-reverse",
      //   glitchTop: "glitchTop 1s infinite linear",
      //   glitchBottom: "glitchBottom 1s infinite linear",
      // },
    },
  },
  plugins: [],
};

// Glitch animation LandingPage "Coderealm"
