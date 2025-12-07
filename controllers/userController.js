import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getWatchlist = async (req, res) => {
  const userId = req.user.userId;
  const list = await prisma.watchlist.findMany({ where: { userId } });
  res.json(list);
};

export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tmdbId, title, posterPath } = req.body;

    const item = await prisma.watchlist.upsert({
      where: {
        ux_user_tmdb: {
          userId,
          tmdbId: Number(tmdbId),
        },
      },
      update: {},
      create: {
        userId,
        tmdbId: Number(tmdbId),
        title,
        posterPath,
      },
    });

    res.status(200).json(item);
  } catch (err) {
    console.error("addToWatchlist error:", err);
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const userId = req.user.userId;
  const id = Number(req.params.id);

  await prisma.watchlist.deleteMany({ where: { id, userId } });
  res.json({ success: true });
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const existing = await prisma.user.findFirst({
      where: {
        email,
        id: { not: Number(userId) }
      }
    });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const updated = await prisma.user.update({
      where: { id: Number(userId) },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    res.json({ user: updated });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
