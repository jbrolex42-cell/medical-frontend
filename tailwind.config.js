import { defineConfig } from "tailwindcss"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },

        ems: {
          navy: '#1e3799',
          dark: '#0a3d62',
          accent: '#20bf6b',
          soft: '#dff9fb',
          danger: '#e74c3c',
          warning: '#f39c12',
          success: '#27ae60'
        }
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },

      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      }
    }
  },

  plugins: []
}