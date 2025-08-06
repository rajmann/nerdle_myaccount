module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ["Barlow", "sans-serif"],
        barlow: ["Barlow", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
        retro: ["VT323", "monospace"],
      },
      colors: {
        // Nerdle Brand Colors
        nerdle: {
          primary: "#820458",     // Primary purple/magenta
          secondary: "#398874",   // Secondary teal/green  
          accent: "#989484",      // Accent gray
          correct: "#4CAF50",     // Game green - correct
          wrongPosition: "#9C27B0", // Game purple - wrong position
          incorrect: "#424242",   // Game black - incorrect
        },
        background: "#17202A",
        dialog: "#F4F8FA",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
