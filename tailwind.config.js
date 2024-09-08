/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        BebasNeueSemiExpBold: ['BebasNeueSemiExpBold'],
      },
      colors: {
        'bggray': '#F7F7F7',
        'bggrayhover': '#E8E8E8',
        'primarycolor': "#007bff",
        'primarycolorhover': "#0056b3",
        'secondrycolor': "#00703C",
        'secondrycolorhover': "#004131",
        'fontlight': "#2A2A2A",
        'fontdark': "#828282",
        'dangercolor': "#C60000",
        'grayborder': '#ACACAC',
        'bgf5': '#F5F5F5'
      },
    },
  },
  plugins: [],
}