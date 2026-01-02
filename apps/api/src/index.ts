import express from "express";
import cors from "cors";
import { prisma } from "@oneguard/db";
import { generateVerificationReport } from "@oneguard/rules";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all launches
app.get("/api/launches", async (req, res) => {
  try {
    const launches = await prisma.launch.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        verification: true,
      },
    });

    res.json({ launches });
  } catch (error) {
    console.error("Error fetching launches:", error);
    res.status(500).json({ error: "Failed to fetch launches" });
  }
});

// Get launch by ID
app.get("/api/launches/:id", async (req, res) => {
  try {
    const launch = await prisma.launch.findUnique({
      where: { id: req.params.id },
      include: {
        verification: true,
        authorities: true,
        events: {
          orderBy: { timestamp: "desc" },
        },
        purchases: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!launch) {
      return res.status(404).json({ error: "Launch not found" });
    }

    res.json({ launch });
  } catch (error) {
    console.error("Error fetching launch:", error);
    res.status(500).json({ error: "Failed to fetch launch" });
  }
});

// Get launch stats
app.get("/api/launches/:id/stats", async (req, res) => {
  try {
    const stats = await prisma.launchStats.findUnique({
      where: { launchId: req.params.id },
    });

    if (!stats) {
      return res.status(404).json({ error: "Stats not found" });
    }

    res.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Get launch verification report
app.get("/api/launches/:id/verification", async (req, res) => {
  try {
    const verification = await prisma.verification.findUnique({
      where: { launchId: req.params.id },
    });

    if (!verification) {
      return res.status(404).json({ error: "Verification not found" });
    }

    res.json({ verification });
  } catch (error) {
    console.error("Error fetching verification:", error);
    res.status(500).json({ error: "Failed to fetch verification" });
  }
});

// Get launch events
app.get("/api/launches/:id/events", async (req, res) => {
  try {
    const events = await prisma.launchEvent.findMany({
      where: { launchId: req.params.id },
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    res.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get launch purchases
app.get("/api/launches/:id/purchases", async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { launchId: req.params.id },
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    res.json({ purchases });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

app.listen(PORT, () => {
  console.log(`ONEGUARD API running on port ${PORT}`);
});
