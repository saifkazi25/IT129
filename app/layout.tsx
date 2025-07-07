import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Infinite Tsukuyomi",
  description: "Discover your ultimate fantasy with AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen">{children}</body>
    </html>
  );
}
