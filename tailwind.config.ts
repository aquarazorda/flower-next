/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      inter: ["var(--font-inter)", "sans-serif"],
      shippori: ["var(--font-shippori)", "serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateColumns: {
        "auto-fill": "repeat(auto-fill, minmax(145px, 1fr))", // 200px being the minimum size of the item.
      },
      colors: {
        primary: "#515B57",
        secondary: "#788473",
        secondaryHover: "#535850",
        textPrimary: "#798781",
        textSecondary: "#7B7D7C",
        text2nd: "#899385",
        faily: "#B78F8F",
        failyBtn: "#CDA7A7",
      },
      lineHeight: {
        "extra-tight": "0.8",
      },
      boxShadow: {
        "landing-btn": "0px 12px 32px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "landing-gradient":
          "linear-gradient(180deg, rgba(10, 12, 12, 0.61) 42.71%, rgba(15, 23, 23, 0.65) 46.88%, rgba(10, 23, 23, 0.00) 100%)",
        "text-gradient": "linear-gradient(180deg,#fff,hsla(0,0%,100%,.85))",
        "mobile-gradient":
          "linear-gradient(180deg, rgba(10, 12, 12, 0.25) 0%, rgba(15, 23, 23, 0.25) 0.01%, rgba(10, 23, 23, 0.25) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
