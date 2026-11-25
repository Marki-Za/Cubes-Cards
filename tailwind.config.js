module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        navy: "#17223B",
        cream: "#FFF7E8",
        sun: "#FFC857",
        "sun-hover": "#F5A914",
        "sun-active": "#DC9200",
        coral: "#FF6B5A",
        mint: "#5CC8A1",
        "coral-dark": "#B02E24",
        rating: "#805600",
        "text-muted": "#48536A",
        "line-soft": "#D8DEEA"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 16px rgb(23 34 59 / 8%)",
        "card-hover": "0 12px 28px rgb(23 34 59 / 12%)",
        button: "0 4px 12px rgb(255 200 87 / 28%)"
      }
    }
  }
};
