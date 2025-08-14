/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'env-green': '#2d5016',
        'env-light': '#4ade80',
        'env-dark': '#166534'
      }
    },
  },
  plugins: [],
}
