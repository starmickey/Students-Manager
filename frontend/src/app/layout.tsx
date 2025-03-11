import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Set default font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "DuckyStore",
  description: "My art page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
