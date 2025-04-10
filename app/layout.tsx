import type { Metadata } from "next";

import NavbarComponent from "@/components/ui/Navbar"; // Import your Navbar
import "./globals.css";

import Footer from "@/components/ui/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/auth-options";
import Providers from "@/components/providers/providers";
import { Background } from "@/components/ui/Background";
import localFont from 'next/font/local';

const myFont = localFont({ src: './fonts/ClashDisplay-Variable.woff2' })



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
    <html lang="en">
      <head />
      <body 
       className={`${myFont.className} light overflow-x-hidden`}
      
      >
        <Providers session={session}>
          <div className="flex min-h-screen flex-col">
            <NavbarComponent />
            <Background>
              <main className="flex-grow">
                {children}
              </main>
              <Footer className="mt-6" />
            </Background>
          </div>
        </Providers>
      </body>
    </html>
  );
}
