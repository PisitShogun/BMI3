import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BMI Tracking App",
  description: "Track your BMI and health progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen pb-24">
          {children}
        </div>
        <footer className="fixed bottom-0 left-0 w-full py-4 text-center text-2xl font-bold text-gray-700 border-t bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 z-50">
          67162110101-9
        </footer>
      </body>
    </html>
  );
}
