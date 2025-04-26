import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";

const montMed = localFont({
  src: "./fonts/montserrat-v26-latin-500.woff2",
  variable: "--mont-medium",
  weight: "500",
});
const montSemi = localFont({
  src: "./fonts/montserrat-v26-latin-600.woff2",
  variable: "--mont-semi",
  weight: "600",
});
const montBold = localFont({
  src: "./fonts/montserrat-v26-latin-700.woff2",
  variable: "--mont-bold",
  weight: "700",
});
const montReg = localFont({
  src: "./fonts/montserrat-v26-latin-regular.woff2",
  variable: "--mont-regular",
  weight: "500",
});

export const metadata = {
  title: "Ichki Ishlar Vazirligi Malaka oshirish instituti",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montReg.variable} ${montMed.variable} ${montSemi.variable} ${montBold.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
