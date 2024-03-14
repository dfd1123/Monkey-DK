import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const pretendard = localFont({
  src: '../../static/assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
  weight: '100 200 300 400 500 600 700 800 900'
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}