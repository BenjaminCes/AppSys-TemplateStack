/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#252A3A',
          'navy-light': '#2d3548',
          'navy-dark': '#1a2030',
          orange: '#F1860B',
          'orange-hover': '#d9770a',
          cyan: '#37BEEA',
          green: '#A0C554',
          'green-deep': '#5b7a2f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
}
