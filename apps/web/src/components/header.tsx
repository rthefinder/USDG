"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-6 w-6" />
          <span>ONEGUARD</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/launches" className="hover:text-primary transition">
            Launches
          </Link>
          <Link href="/create" className="hover:text-primary transition">
            Create Launch
          </Link>
          <Link href="/docs" className="hover:text-primary transition">
            Docs
          </Link>
          <WalletMultiButton />
        </nav>
      </div>
    </header>
  );
}
