import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarComponent from "@/components/ui/Navbar"; // Import your Navbar
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // Import the ThemeProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A modern UI with Hero UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavbarComponent />  {/* Navbar will appear on every page */}
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
