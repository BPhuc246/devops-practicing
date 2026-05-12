/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"DM Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-out": "fadeOut 0.25s ease-in forwards",
        "bounce-in": "bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateY(-12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.95)" },
        },
        bounceIn: {
          "0%": { opacity: 0, transform: "scale(0.8)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
};
