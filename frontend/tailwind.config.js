/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: 'class',
	theme: {
		extend: {
			keyframes: {
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				'modal-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'modal-out': {
					'0%': { opacity: '1', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(0.95)' },
				},
			},
			animation: {
				'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
				'fade-in': 'fade-in 0.2s ease-out forwards',
				'fade-out': 'fade-out 0.15s ease-in forwards',
				'modal-in': 'modal-in 0.2s ease-out forwards',
				'modal-out': 'modal-out 0.15s ease-in forwards',
			},
		},
	},
	plugins: [],
};
