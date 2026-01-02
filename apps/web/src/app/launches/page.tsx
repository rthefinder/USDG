import { prisma } from "@oneguard/db";
import { LaunchCard } from "@/components/launch-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LaunchesPage() {
  const launches = await prisma.launch.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      verification: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Launches</h1>
        <p className="text-muted-foreground">
          Browse all ONEGUARD launches. Click for detailed verification report.
        </p>
      </div>

      {launches.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">No launches yet</p>
          <Link
            href="/create"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            Create First Launch
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {launches.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}
    </div>
  );
}
