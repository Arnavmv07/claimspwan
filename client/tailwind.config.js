/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High quality dark mode palettes & platform brand colors
        dark: {
          bg: '#0B0F19',        // Deep Space Blue/Black
          card: '#161F32',      // Glass-like card
          nav: 'rgba(11, 15, 25, 0.75)',
          border: '#24324D'     // Modern border
        },
        platform: {
          steam: '#101822',
          epic: '#121212',
          gog: '#1b0e2b',
          amazon: '#232f3e',
          playstation: '#003087',
          xbox: '#107c10',
          nintendo: '#e60012',
          itch: '#fa5c5c',
          humble: '#3b3e48',
          other: '#2d3748'
        },
        accent: {
          neon: '#00F2FE',       // High glowing cyan
          glow: '#4FACFE',       // High glowing blue
          purple: '#B624FF',     // Vivid premium purple
          gold: '#FFD700'        // Exquisite gold for badges
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 242, 254, 0.4)',
        'glow-purple': '0 0 15px rgba(182, 36, 255, 0.4)',
        'glow-green': '0 0 15px rgba(16, 124, 16, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2.5s infinite'
      }
    },
  },
  plugins: [],
}
