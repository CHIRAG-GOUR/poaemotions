/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        emotion: {
          joy: "#FCD34D",
          sad: "#93C5FD",
          anger: "#FCA5A5",
          fear: "#C4B5FD",
          disgust: "#86EFAC",
        }
      }
    },
  },
  plugins: [],
}
