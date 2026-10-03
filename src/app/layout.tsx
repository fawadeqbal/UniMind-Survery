import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniMind | Student Mental Health & Well-being",
  description: "A professional survey on academic stress among university students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="w-full glass-panel border-b border-white/20 dark:border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                <Image src="/logo.jpg" alt="UniMind Logo" fill className="object-cover scale-110" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                UniMind
              </span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
