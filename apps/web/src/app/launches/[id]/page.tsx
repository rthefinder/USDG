import { prisma, VerificationStatus as DbVerificationStatus } from "@oneguard/db";
import { notFound } from "next/navigation";
import { Shield, CheckCircle, AlertTriangle, XCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { VerificationBadge } from "@/components/verification-badge";

export default async function LaunchDetailPage({ params }: { params: { id: string } }) {
  const launch = await prisma.launch.findUnique({
    where: { id: params.id },
    include: {
      verification: true,
      authorities: true,
      events: {
        orderBy: { timestamp: "desc" },
        take: 20,
      },
    },
  });

  if (!launch) {
    notFound();
  }

  const config = launch.config as any;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {launch.tokenName} ({launch.tokenSymbol})
            </h1>
            <p className="text-muted-foreground">Token Mint: {launch.tokenMint}</p>
            <p className="text-sm text-muted-foreground">
              Created {format(new Date(launch.createdAt), "PPP")}
            </p>
          </div>
          {launch.verification && (
            <VerificationBadge status={launch.verification.overallStatus} />
          )}
        </div>

        {/* Verification Report */}
        {launch.verification && (
          <div className="mb-8 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Verification Report
            </h2>

            <div className="space-y-4">
              <VerificationSection
                title="Anti-Snipe"
                status={launch.verification.antiSnipeStatus}
                checks={launch.verification.antiSnipeChecks as any}
              />
              <VerificationSection
                title="Anti-Bundle"
                status={launch.verification.antiBundleStatus}
                checks={launch.verification.antiBundleChecks as any}
              />
              <VerificationSection
                title="Anti-Rug"
                status={launch.verification.antiRugStatus}
                checks={launch.verification.antiRugChecks as any}
              />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Generated {format(new Date(launch.verification.generatedAt), "PPpp")}
              <br />
              Verified by: {launch.verification.verifiedBy}
            </p>
          </div>
        )}

        {/* Configuration */}
        <div className="mb-8 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Launch Configuration</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Anti-Snipe Settings</h3>
              <ul className="text-sm space-y-1">
                <li>Max Buy Per Wallet: {config.antiSnipe.maxBuyPerWallet.toLocaleString()}</li>
                <li>Phased Unlock: {config.antiSnipe.phasedUnlock ? "Yes" : "No"}</li>
                {config.antiSnipe.unlockDuration && (
                  <li>Unlock Duration: {config.antiSnipe.unlockDuration}s</li>
                )}
                {config.antiSnipe.fairLaunchDelay && (
                  <li>Fair Launch Delay: {config.antiSnipe.fairLaunchDelay}s</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Anti-Bundle Settings</h3>
              <ul className="text-sm space-y-1">
                <li>Bundle Detection: {config.antiBundle.detectBundles ? "Enabled" : "Disabled"}</li>
                <li>Max Wallet Concentration: {config.antiBundle.maxWalletConcentration}%</li>
                <li>
                  One Action Per TX: {config.antiBundle.oneActionPerTx ? "Enforced" : "Not Enforced"}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Anti-Rug Settings</h3>
              <ul className="text-sm space-y-1">
                <li>Fixed Supply: {config.antiRug.fixedSupply ? "Yes" : "No"}</li>
                <li>
                  Revoke Mint Authority: {config.antiRug.revokeMintAuthority ? "Yes" : "No"}
                </li>
                <li>
                  Revoke Freeze Authority: {config.antiRug.revokeFreezeAuthority ? "Yes" : "No"}
                </li>
                {config.antiRug.lpLockDuration && (
                  <li>LP Lock Duration: {config.antiRug.lpLockDuration / (24 * 60 * 60)} days</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">USD1 Launch Settings</h3>
              <ul className="text-sm space-y-1">
                <li>Total Supply: {config.usd1Config.totalSupply.toLocaleString()}</li>
                <li>Initial Price: {config.usd1Config.initialPrice} USD1</li>
                <li>Liquidity Amount: {config.usd1Config.liquidityAmount.toLocaleString()}</li>
                <li>Creator Allocation: {config.usd1Config.creatorAllocation.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Token Authorities */}
        {launch.authorities && (
          <div className="mb-8 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Token Authorities</h2>
            <ul className="text-sm space-y-1">
              <li>
                Mint Authority:{" "}
                {launch.authorities.mintAuthority ? launch.authorities.mintAuthority : "✓ Revoked"}
              </li>
              <li>
                Freeze Authority:{" "}
                {launch.authorities.freezeAuthority
                  ? launch.authorities.freezeAuthority
                  : "✓ Revoked"}
              </li>
              <li>
                Verified: {launch.authorities.verified ? "Yes" : "No"}
                {launch.authorities.verified &&
                  ` (${format(new Date(launch.authorities.checkedAt), "PPpp")})`}
              </li>
            </ul>
          </div>
        )}

        {/* Events */}
        {launch.events.length > 0 && (
          <div className="mb-8 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Recent Events</h2>
            <div className="space-y-2">
              {launch.events.map((event) => (
                <div key={event.id} className="text-sm flex items-start gap-2 py-2 border-b">
                  <span className="font-mono text-xs text-muted-foreground">
                    {format(new Date(event.timestamp), "HH:mm:ss")}
                  </span>
                  <span className="font-semibold">{event.type}</span>
                  <a
                    href={`https://explorer.solana.com/tx/${event.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-primary hover:underline flex items-center gap-1"
                  >
                    View TX <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-accent/50 border rounded-lg">
          <p className="font-semibold mb-2">⚠️ Verify It Yourself</p>
          <p className="text-sm text-muted-foreground">
            This report is informational only. Always verify token parameters, authorities, and
            transaction history yourself on Solana Explorer before participating.
          </p>
        </div>
      </div>
    </div>
  );
}

function VerificationSection({
  title,
  status,
  checks,
}: {
  title: string;
  status: DbVerificationStatus;
  checks: { checks: Array<{ name: string; passed: boolean; message: string }> };
}) {
  const statusIcon = {
    PASS: <CheckCircle className="h-5 w-5 text-green-600" />,
    WARN: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    FAIL: <XCircle className="h-5 w-5 text-red-600" />,
  };

  const statusColor = {
    PASS: "text-green-600",
    WARN: "text-yellow-600",
    FAIL: "text-red-600",
  };

  return (
    <div className="border-l-4 pl-4" style={{ borderColor: status === "PASS" ? "green" : status === "WARN" ? "orange" : "red" }}>
      <div className="flex items-center gap-2 mb-2">
        {statusIcon[status]}
        <h3 className={`font-semibold ${statusColor[status]}`}>
          {title}: {status}
        </h3>
      </div>
      <ul className="text-sm space-y-1">
        {checks.checks.map((check, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span>{check.passed ? "✓" : "✗"}</span>
            <span>
              <strong>{check.name}:</strong> {check.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
