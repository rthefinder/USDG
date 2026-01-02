import Link from "next/link";
import { Shield, TrendingUp, Lock, Eye } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="flex justify-center mb-6">
          <Shield className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4">ONEGUARD ($USDG)</h1>
        <p className="text-xl text-muted-foreground mb-2">Security-First Launchpad</p>
        <p className="text-lg">For BONK-style coins priced in USD1</p>
        
        <div className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="font-semibold text-destructive">⚠️ DISCLAIMER</p>
          <p className="mt-2 text-sm">
            This is NOT an investment platform. This is NOT a guarantee of profit.
            <br />
            This is a launch safety framework. Always verify launch parameters yourself.
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/launches"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            View Launches
          </Link>
          <Link
            href="/create"
            className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-accent transition"
          >
            Create Launch
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 border rounded-lg">
          <Shield className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Anti-Snipe</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Max buy per wallet enforced</li>
            <li>• Optional phased unlock</li>
            <li>• Fair launch delay</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <TrendingUp className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Anti-Bundle</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Bundle detection</li>
            <li>• One action per transaction</li>
            <li>• Wallet concentration limits</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <Lock className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Anti-Rug</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Fixed supply (immutable)</li>
            <li>• Authorities revoked on-chain</li>
            <li>• Optional LP lock</li>
          </ul>
        </div>
      </div>

      <div className="bg-accent/50 p-8 rounded-lg">
        <div className="flex items-start gap-4">
          <Eye className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Verify It Yourself</h3>
            <p className="text-muted-foreground mb-4">
              Every ONEGUARD launch includes a detailed verification report showing:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Anti-snipe configuration and enforcement</li>
              <li>✓ Anti-bundle detection results</li>
              <li>✓ Anti-rug authority verification</li>
              <li>✓ On-chain event logs</li>
              <li>✓ Token distribution analysis</li>
            </ul>
            <p className="mt-4 text-sm">
              The badge is informational, not a guarantee. Always do your own research.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold mb-1">Creator Configures Launch</h4>
              <p className="text-sm text-muted-foreground">
                Set anti-snipe, anti-bundle, and anti-rug parameters. All constraints enforced by
                code.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold mb-1">Launch on Solana</h4>
              <p className="text-sm text-muted-foreground">
                Anchor program enforces all rules on-chain. Mint/freeze authorities revoked.
                Events logged.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold mb-1">Verification Report Generated</h4>
              <p className="text-sm text-muted-foreground">
                Automated checks verify anti-snipe, anti-bundle, and anti-rug enforcement. Badge
                awarded.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold mb-1">Public Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                All launches visible. Full transparency. Users verify parameters themselves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
