/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#171717', // Charcoal
          hover: '#262626',
        },
        background: '#F5F5F2', // Off White
        secondary: {
          DEFAULT: '#A3A3A3', // Concrete Gray
          muted: '#737373',
        },
        accent: {
          DEFAULT: '#C66A4A', // Terracotta
          hover: '#B05739',
          light: '#F8EBE6',
        },
        card: '#FFFFFF', // White
        text: {
          main: '#222222', // Primary Text
          secondary: '#A3A3A3', // Secondary Text
        },
        border: {
          DEFAULT: '#E2E2DF',
          muted: '#A3A3A3',
        },
        status: {
          success: '#16A34A',
          error: '#DC2626',
          warning: '#C66A4A',
        },
      },
    },
  },
  plugins: [],
}
