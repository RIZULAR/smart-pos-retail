/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // Slate 900
        surface: '#1e293b',    // Slate 800
        border: '#334155',     // Slate 700
        primary: '#6366f1',    // Indigo 500
        success: '#10b981',    // Emerald 500
        danger: '#f43f5e',     // Rose 500
      },
    },
  },
  plugins: [],
}
