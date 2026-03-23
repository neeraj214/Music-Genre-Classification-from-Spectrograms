/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main':        '#FAFBFF',
        'bg-card':        '#FFFFFF',
        'accent-primary': '#6C63FF',
        'accent-second':  '#FF6584',
        'accent-third':   '#43E97B',
        'accent-fourth':  '#38F9D7',
        'text-primary':   '#1A1A2E',
        'text-secondary': '#6B7280',
        'border':         '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: false,
}
