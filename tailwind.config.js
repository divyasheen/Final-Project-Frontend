// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(12.9% 0.042 264.695)",            // General dark background
        primary: "oklch(40.1% 0.17 325.612)",               // Used for footer, navbar background
        secondary: "oklch(48.8% 0.243 264.376)",             // Main accent (buttons, XP highlights)
        secondaryHover: "#45c0db",        // Hover effect for secondary
        surface: "#1E1E2F",               // Panels or card backgrounds
        codeBlock: "oklch(53.2% 0.157 131.589)",             // For code snippets and console background
        glow: "rgba(87, 224, 254, 0.3)",  // Subtle hover glow
        gradientToR: "bg-gradient-to-r from-fuchsia-900 to-indigo-900", // gradient primary to r

        gradientToL: "linear-gradient(90deg,rgba(131, 42, 155, 1) 0%, rgba(28, 6, 99, 1) 100%)",
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
