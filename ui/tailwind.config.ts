import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors
        magicBlue: {
          100: 'var(--magic-blue-100)',
          300: 'var(--magic-blue-300)',
          500: 'var(--magic-blue-500)',
          700: 'var(--magic-blue-700)',
          900: 'var(--magic-blue-900)',
        },
        nordicGray: {
          100: 'var(--nordic-gray-100)',
          200: 'var(--nordic-gray-200)',
          300: 'var(--nordic-gray-300)',
          400: 'var(--nordic-gray-400)',
          500: 'var(--nordic-gray-500)',
          600: 'var(--nordic-gray-600)',
          700: 'var(--nordic-gray-700)',
          800: 'var(--nordic-gray-800)',
          900: 'var(--nordic-gray-900)',
        },
        oceanTeal: {
          100: 'var(--ocean-teal-100)',
          200: 'var(--ocean-teal-200)',
          300: 'var(--ocean-teal-300)',
          400: 'var(--ocean-teal-400)',
          500: 'var(--ocean-teal-500)',
          600: 'var(--ocean-teal-600)',
          700: 'var(--ocean-teal-700)',
          800: 'var(--ocean-teal-800)',
          900: 'var(--ocean-teal-900)',
        },
        forestGreen: {
          100: 'var(--forest-green-100)',
          300: 'var(--forest-green-300)',
          500: 'var(--forest-green-500)',
          700: 'var(--forest-green-700)',
          900: 'var(--forest-green-900)',
        },
        goldenAmber: {
          100: 'var(--golden-amber-100)',
          300: 'var(--golden-amber-300)',
          500: 'var(--golden-amber-500)',
          700: 'var(--golden-amber-700)',
          900: 'var(--golden-amber-900)',
        },
        crimsonRed: {
          100: 'var(--crimson-red-100)',
          300: 'var(--crimson-red-300)',
          500: 'var(--crimson-red-500)',
          700: 'var(--crimson-red-700)',
          900: 'var(--crimson-red-900)',
        },
        rosePink: {
          100: 'var(--rose-pink-100)',
          300: 'var(--rose-pink-300)',
          500: 'var(--rose-pink-500)',
          700: 'var(--rose-pink-700)',
          900: 'var(--rose-pink-900)',
        },
        // Semantic colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
