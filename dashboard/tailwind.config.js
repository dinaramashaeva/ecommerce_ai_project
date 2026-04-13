/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "red-gradient": "linear-gradient(135deg, #ef4444, #dc2626)",
        "dark-gradient": "linear-gradient(135deg, #1e293b, #0f172a)",
      },
    },
  },
  plugins: [],
};