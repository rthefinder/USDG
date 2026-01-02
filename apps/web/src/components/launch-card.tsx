import Link from "next/link";
import { VerificationStatus } from "@oneguard/shared";
import { VerificationBadge } from "./verification-badge";

interface LaunchCardProps {
  launch: {
    id: string;
    tokenName: string;
    tokenSymbol: string;
    tokenMint: string;
    phase: string;
    createdAt: Date;
    verification?: {
      overallStatus: VerificationStatus;
    } | null;
  };
}

export function LaunchCard({ launch }: LaunchCardProps) {
  return (
    <Link href={`/launches/${launch.id}`}>
      <div className="p-6 border rounded-lg hover:border-primary transition cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">
              {launch.tokenName} ({launch.tokenSymbol})
            </h3>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {launch.tokenMint.slice(0, 8)}...{launch.tokenMint.slice(-8)}
            </p>
          </div>
          {launch.verification && (
            <VerificationBadge status={launch.verification.overallStatus} size="sm" />
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="px-2 py-1 bg-accent rounded text-xs font-medium">{launch.phase}</span>
          <span className="text-muted-foreground text-xs">
            {new Date(launch.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
