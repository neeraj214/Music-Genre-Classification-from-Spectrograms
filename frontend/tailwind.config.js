/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-violet':   '#6C63FF',
        'brand-pink':     '#FF6584',
        'brand-cyan':     '#38F9D7',
        'brand-green':    '#43E97B',
        'brand-amber':    '#F9A826',
        'bg-main':        '#F8F7FF',
        'bg-card':        '#FFFFFF',
        'bg-glass':       'rgba(255,255,255,0.72)',
        'text-primary':   '#0F0E17',
        'text-secondary': '#6E6D7A',
        'text-muted':     '#A0A0B0',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        sm:    '8px',
        md:    '14px',
        lg:    '20px',
        xl:    '28px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        sm:           '0 2px 8px rgba(108,99,255,0.08)',
        md:           '0 8px 32px rgba(108,99,255,0.12)',
        lg:           '0 24px 64px rgba(108,99,255,0.18)',
        'glow-violet': '0 0 30px rgba(108,99,255,0.4)',
        'glow-pink':   '0 0 30px rgba(255,101,132,0.4)',
        'glow-cyan':   '0 0 30px rgba(56,249,215,0.4)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
      },
      animation: {
        'float':          'float 4s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'spin-slow':      'spin-slow 8s linear infinite',
        'bounce-soft':    'bounce-soft 2s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108,99,255,0.3)' },
          '50%':       { boxShadow: '0 0 50px rgba(108,99,255,0.6)' },
        },
        'gradient-shift': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
  darkMode: false,
}
