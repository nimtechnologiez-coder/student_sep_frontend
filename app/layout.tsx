import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIM AI Career Academy - Student Portal & Dashboard",
  description: "Official Student Portal & AI Dashboard for NIM Academy.",
  icons: {
    icon: [
      {
        url: "/nimlogo.webp",
        type: "image/webp",
      },
    ],
    shortcut: "/nimlogo.webp",
    apple: "/nimlogo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/nimlogo.webp" type="image/webp" />
        <link rel="shortcut icon" href="/nimlogo.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/nimlogo.webp" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
