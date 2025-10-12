import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#1f2937',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
          200: '#e5e7eb',
          100: '#f3f4f6',
        },
        indigo: {
          900: '#312e81',
          800: '#3730a3',
          700: '#4338ca',
          600: '#4f46e5',
          500: '#6366f1',
          400: '#818cf8',
          300: '#a5b4fc',
          200: '#c7d2fe',
          100: '#e0e7ff',
        },
        purple: {
          600: '#7c3aed',
          300: '#c4b5fd',
        },
        blue: {
          600: '#2563eb',
          300: '#93c5fd',
        },
        pink: {
          600: '#db2777',
          300: '#f9a8d4',
        },
        green: {
          600: '#059669',
          300: '#6ee7b7',
        },
        yellow: {
          600: '#ca8a04',
          300: '#fcd34d',
        },
        red: {
          600: '#dc2626',
          300: '#fca5a5',
        },
        teal: {
          600: '#0d9488',
          300: '#5eead4',
        },
        orange: {
          600: '#ea580c',
          300: '#fdba74',
        },
        cyan: {
          600: '#0891b2',
          300: '#67e8f9',
        },
      },
      opacity: {
        '20': '0.2',
        '30': '0.3',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(purple|blue|indigo|pink|green|yellow|red|teal|orange|cyan)-600/,
      variants: ['hover'],
    },
    {
      pattern: /text-(purple|blue|indigo|pink|green|yellow|red|teal|orange|cyan)-300/,
    },
    {
      pattern: /opacity-\d+/,
    },
  ],
}
export default config