/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './vueform.config.js',
      './node_modules/@vueform/vueform/themes/tailwind/**/*.vue',
      './node_modules/@vueform/vueform/themes/tailwind/**/*.js',
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  variants: {
    extend: {},
  },
  plugins: [
    require('@vueform/vueform/tailwind')
  ],
}

