/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Open Sans"', "sans-serif"],
			},
			colors: {
				dwl: {
					blue: "#225378",
					cyan: "#ACF0F2",
					teal: "#179680",
					grey: "#70808F",
					light: "#E7FCE7",
				},
				app: {
					bg: "#0F172A",
					surface: "#225378",
					border: "#70808F",
				},
			},
		},
	},
	plugins: [],
};
