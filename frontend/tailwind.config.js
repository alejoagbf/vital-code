/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Verde primario corporativo (más vivo, tipo emerald)
        verde: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Azul/negro oscuro corporativo (navy)
        navy: {
          50:  '#f0f4fa',
          100: '#dbe5f1',
          200: '#b8cae3',
          300: '#8fa9cf',
          400: '#5e7fb5',
          500: '#3a5a96',
          600: '#1f3b6d',
          700: '#13294a',
          800: '#0d1f3c',
          900: '#0a182e',
          950: '#06101f',
        },
        // Fondo gris muy claro
        canvas: '#f5f7f9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card:        '0 1px 2px rgba(15,30,60,.04), 0 6px 20px -6px rgba(15,30,60,.08)',
        'card-hover':'0 8px 30px -6px rgba(15,30,60,.14)',
        soft:        '0 10px 40px -12px rgba(15,30,60,.12)',
        sidebar:     '1px 0 0 0 #e5e7eb',
        'inset-soft':'inset 0 1px 0 0 rgba(255,255,255,0.06)',
        'glow-green':'0 8px 24px -8px rgba(5,150,105,0.45)',
        'glow-red':  '0 8px 24px -8px rgba(220,38,38,0.45)',
      },
      backgroundImage: {
        'navy-gradient':  'linear-gradient(135deg, #0a182e 0%, #0d2147 60%, #13294a 100%)',
        'green-gradient': 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
        'soft-canvas':    'linear-gradient(180deg, #f5f7f9 0%, #eef2f6 100%)',
      },
      borderRadius: {
        'xl':  '0.875rem',
        '2xl': '1.125rem',
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
