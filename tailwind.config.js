// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0b0225",            // General dark background
        primary: "#832A9B",               // Used for footer, navbar background
        secondary: "#210187",             // Main accent (buttons, XP highlights)
        secondaryHover: "#45c0db",        // Hover effect for secondary
        surface: "#1E1E2F",               // Panels or card backgrounds
        codeBlock: "oklch(53.2% 0.157 131.589)",             // For code snippets and console background
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

// $primary: #832A9B;
// $secondary: #210187;
// $bg: #1C0663; 
