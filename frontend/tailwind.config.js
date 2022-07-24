/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    fontFamily: {
      sans: ["Barlow", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#93C08C",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(100px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 1s ease-in-out",
        "fade-in-top": "fade-in-top 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
};
