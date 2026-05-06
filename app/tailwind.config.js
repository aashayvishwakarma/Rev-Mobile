/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "rev-bg": "#0a0a0a",
        "rev-surface": "#141414",
        "rev-accent": "#1D6BFF",
        "rev-accent-red": "#E8210A",
      },
    },
  },
  plugins: [],
};

