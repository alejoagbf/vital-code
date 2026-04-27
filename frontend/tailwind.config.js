/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f0fe',
          100: '#c5d5f8',
          200: '#9db8f2',
          300: '#6f96ec',
          400: '#4a7ae6',
          500: '#1E3A8A',
          600: '#1a3278',
          700: '#152866',
          800: '#101e54',
          900: '#0b1442',
        },
        accent: {
          50:  '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00ACC1',
          600: '#00838f',
          700: '#006064',
        },
        brand: {
          navy:  '#1E3A8A',
          cyan:  '#00ACC1',
          light: '#E8F4FD',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 2px 15px -3px rgba(0,0,0,.07), 0 10px 20px -2px rgba(0,0,0,.04)',
        'card-hover':'0 10px 40px -10px rgba(30,58,138,.18)',
        'glow-cyan':'0 0 24px rgba(0,172,193,.35)',
        'glow-navy':'0 0 24px rgba(30,58,138,.3)',
        'sidebar':  '4px 0 24px rgba(0,0,0,.12)',
      },
      backgroundImage: {
        'gradient-sidebar': 'linear-gradient(180deg, #101e54 0%, #1E3A8A 60%, #152866 100%)',
        'gradient-header':  'linear-gradient(135deg, #1E3A8A 0%, #101e54 100%)',
        'gradient-btn':     'linear-gradient(135deg, #1E3A8A 0%, #152866 100%)',
        'gradient-accent':  'linear-gradient(135deg, #00ACC1 0%, #006064 100%)',
      },
      animation: {
        'float':      'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
