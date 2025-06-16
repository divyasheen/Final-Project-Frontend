// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0E0E1A",            // General dark background
        primary: "#0E2741",               // Used for footer, navbar background
        secondary: "#57E0FE",             // Main accent (buttons, XP highlights)
        secondaryHover: "#45c0db",        // Hover effect for secondary
        surface: "#1E1E2F",               // Panels or card backgrounds
        codeBlock: "#282C34",             // For code snippets and console background
        glow: "rgba(87, 224, 254, 0.3)",  // Subtle hover glow
      },
      fontFamily: {
        vt323: ['"VT323"', "monospace"],
      },
      boxShadow: {
        glow: "0 0 8px rgba(87, 224, 254, 0.4)",
      },
    },
  },
  plugins: [],
};
