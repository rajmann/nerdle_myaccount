module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "sans-serif"],
      },
      colors: {
        background: "#17202A",
        dialog: "#F4F8FA",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
