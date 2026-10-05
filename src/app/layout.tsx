import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import FitnessPlanProvider from "@/context/fitnessplancontext";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Fit Log App",
  description: "Track your workouts and fitness plan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col`}
      >
        <FitnessPlanProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </FitnessPlanProvider>
      </body>
    </html>
  );
}