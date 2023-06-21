const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#151415',
        'background': '#f8f7f7',
        'primary': '#a5a1a5',
        'secondary': '#eeeded',
        'accent': '#999498',
      },
      animation: {
        'iconFadeIn': 'iconFadeIn 5s ease-in-out',
        'slideUp': 'slideUp .5s ease-out'
      },
      keyframes: {
        'iconFadeIn': {
          '0%': 'opacity: 0',
          '100%': 'opacity: 1',
        },
        'slideUp': {
          '0%': {'transform': 'translateY(190px)'},
          '100%': {'transform': 'translateY(0px)'}
        }
      }
    },
  },
  plugins: [],
}

