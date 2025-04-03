"use client";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Clan India Lifestyle ERP",
//   description: "Enterprise Resource Planning System",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full`}>
        {children}
      </body>
    </html>
  );
}
