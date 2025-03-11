import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarComponent from "@/components/ui/Navbar"; // Import your Navbar
import "./globals.css";
import { Inter } from "next/font/google"; // Import the Inter font
import { Manrope } from "next/font/google"; // Import the Manrope font
import { Poppins } from "next/font/google"; // Import the Poppins font
import Footer from "@/components/ui/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Providers from "@/components/providers/providers";

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
  title: "AutoGrade",
  description: "AutoGrade is a platform for automatic grading of exams",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} ${poppins.variable} antialiased`}>
        <Providers session={session}>
          <div className="flex min-h-screen flex-col">
            <NavbarComponent />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
