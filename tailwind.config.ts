import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zneako: {
          black: '#0A0A0A',
          charcoal: '#1A1A1A',
          rubber: '#2C2C2C',
          sand: '#C8B891',
          gold: '#D4A843',
          cream: '#F5F0E8',
          green: '#4A7C59',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
