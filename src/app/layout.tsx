import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { getUserSession } from "./actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HopeConnect - Volunteer & Donation Platform",
  description: "Empowering communities through volunteering and donations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserSession();

  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <Navbar user={user} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
