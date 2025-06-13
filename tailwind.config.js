// tailwind.config.js
export default {
  darkMode: 'class', // <--- HARUS ADA
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'),
    
  ],
}
