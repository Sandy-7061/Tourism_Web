/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8eef7',
          100: '#c5d4eb',
          200: '#9fb8dd',
          300: '#779bcf',
          400: '#5785c5',
          500: '#3370ba',
          600: '#2a5fa0',
          700: '#1e4a80',
          800: '#133460',
          900: '#0B1929',
          950: '#060d14',
        },
        brand: {
          blue: '#1E5CB3',
          orange: '#F97316',
          navy: '#0B1929',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
        'glass-dark': 'linear-gradient(135deg, rgba(11,25,41,0.85), rgba(11,25,41,0.65))',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(11, 25, 41, 0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
        'glass-lg': '0 20px 60px rgba(11, 25, 41, 0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
        'card': '0 4px 24px rgba(11, 25, 41, 0.08)',
        'card-hover': '0 16px 48px rgba(11, 25, 41, 0.18)',
        'orange': '0 8px 24px rgba(249, 115, 22, 0.35)',
        'blue': '0 8px 24px rgba(30, 92, 179, 0.35)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
