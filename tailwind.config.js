/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class", // Habilita a troca de tema via classe
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Open Sans"', "sans-serif"],
			},
			colors: {
				// Paleta Oficial DWL
				dwl: {
					blue: "#225378",
					cyan: "#ACF0F2",
					teal: "#179680",
					grey: "#70808F",
					light: "#E7FCE7",
				},
				// Mapeamento Semântico Dual-Theme
				app: {
					darkBg: "#0F172A",
					darkSurface: "#225378",
					lightBg: "#F8FAFC",
					lightSurface: "#FFFFFF",
					border: "#70808F",
				},
			},
		},
	},
	plugins: [],
};
