const colors = require('tailwindcss/colors')

const customColors = {
  orange: {
    50: '#FFFAF7',
    100: '#FFE3D3',
    200: '#FEC6A4',
    300: '#FEAA77',
    400: '#FD8D49',
    500: '#FD711C',
  },
  blue: {
    100: '#CDDEF5',
    200: '#9CBDEA',
    300: '#6A9BE0',
    400: '#3A7BD6',
    500: '#0759CB',
  },
}

module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      orange: customColors.orange,
      blue: customColors.blue,
    },
    extend: {
      transformOrigin: {
        0: '0%',
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
