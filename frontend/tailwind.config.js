/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1800px",
      },
    },
    extend: {
      colors: {
        border: "hsl(140, 13%, 91%)", // Xám nhạt pha xanh, giúp dịu mắt
        input: "hsl(140, 14%, 96%)", // Nền input sáng, tạo cảm giác thân thiện
        ring: "hsl(142, 100%, 40%)", // Xanh lá sáng, tạo điểm nhấn khi focus
        background: "hsl(140, 15%, 98%)", // Nền chung gần như trắng, nhẹ nhàng
        foreground: "hsl(140, 10%, 15%)", // Màu chữ chính, dễ đọc trên nền sáng
      
        primary: {
          DEFAULT: "hsl(142, 80%, 35%)", // **Xanh lá cây đậm** – biểu tượng của sức khỏe và sự sống
          foreground: "hsl(0, 0%, 100%)", // Chữ trắng trên nền xanh lá
        },
        secondary: {
          DEFAULT: "hsl(142, 65%, 75%)", 
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 72%, 50%)", // **Đỏ nhạt** – cảnh báo nguy hiểm hoặc lỗi
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(140, 13%, 90%)", // Xám nhẹ có pha chút xanh, phù hợp với giao diện y tế
          foreground: "hsl(140, 10%, 40%)",
        },
        accent: {
          DEFAULT: "hsl(195, 80%, 50%)", // **Xanh cyan** – tạo điểm nhấn hiện đại
          foreground: "hsl(0, 0%, 100%)",
        },
        popover: {
          DEFAULT: "hsl(140, 15%, 95%)", // Màu nền hộp thoại popover
          foreground: "hsl(140, 10%, 20%)",
        },
        card: {
          DEFAULT: "hsl(140, 17%, 97%)", // Màu nền thẻ card
          foreground: "hsl(140, 10%, 15%)",
        },
        hover: {
          DEFAULT: "hsl(140 40% 90%)", // Màu nền khi hover
        }
      },      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate")],
}