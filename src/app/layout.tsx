import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neelum Resort Taobat",
  description:
    "A riverside resort at the end of Neelum Valley, Azad Kashmir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
