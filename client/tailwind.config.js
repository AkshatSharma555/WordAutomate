/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Yahan humne tumhare College Colors define kiye hain
        primary: {
          DEFAULT: '#1AA3A3', // SIES Teal (Main Action Color)
          hover: '#148080',   // Thoda dark (Hover ke liye)
        },
        secondary: {
          DEFAULT: '#F54A00', // SIES Orange (Highlights/Buttons)
          hover: '#D14000',   // Thoda dark
        },
        cream: {
          DEFAULT: '#F3F2ED', // SIES Warm White (Text/Light BG)
        },
        dark: {
          950: '#020617',     // Slate-950 (Background Base)
          900: '#0f172a',     // Card Background
        }
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      // 👇 NEW: Animation for Shiny Text Effect
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        shine: 'shine 3s linear infinite',
      },
    },
  },
  plugins: [],
}