import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google"
import Footer from "@/components/Footer";
import { GlobalThemeProvider } from "@/components/global-theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArcForm",
  description: "A app for architecture formula calculation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <GlobalThemeProvider>
            {children}
            <Footer />
          </GlobalThemeProvider>
          <Analytics />
          <SpeedInsights />
        </body>
        <GoogleAnalytics gaId="G-VQM3YWZS0D" />
      </html>
    </>
  );
}
