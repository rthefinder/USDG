import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ONEGUARD ($USDG) - Security-First Launchpad",
  description:
    "The first security-first launchpad for BONK-style coins priced in USD1. Prevention by design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 mt-12">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>
                  ONEGUARD is a launch safety framework. Not investment advice. No profit
                  guarantees.
                </p>
                <p className="mt-2">Always verify launch parameters yourself.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
