import type { Metadata } from "next";
import { Micro_5, Kode_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

const micro5 = Micro_5({
  subsets: ["latin"],
  variable: "--font-header",
  weight: "400",
});

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Cat Cards - Your AI Study Buddy",
  description: "A cozy AI study companion that organizes your notes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
