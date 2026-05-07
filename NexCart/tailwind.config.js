/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          light: "rgba(255, 255, 255, 0.15)", // Slightly more transparent
          dark: "rgba(0, 0, 0, 0.6)", // Dark glass
          border: "rgba(255, 255, 255, 0.2)",
        },
        // Explicitly define black/white palette if needed, but Tailwind defaults are usually fine.
        // We can add a very deep black for background
        midnight: "#050505",
      },
      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px", // Increased
        lg: "20px", // Increased
        xl: "30px", // Increased
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glass-hover": "0 12px 48px 0 rgba(0, 0, 0, 0.5)",
      },
      borderRadius: {
        "2xl-soft": "1.5rem",
      },
    },
  },
  plugins: [],
};
