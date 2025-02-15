import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarComponent from "@/components/ui/Navbar"; // Import your Navbar
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // Import the ThemeProvider
import { Inter } from "next/font/google"; // Import the Inter font
import { Manrope } from "next/font/google"; // Import the Manrope font
import { Poppins } from "next/font/google"; // Import the Poppins font

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you want to use
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you want to use
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you want to use
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
        <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} ${poppins.variable} antialiased`}>
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
