import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getWatchlist = async (req, res) => {
  const userId = req.user.userId;
  const list = await prisma.watchlist.findMany({ where: { userId } });
  res.json(list);
};

export const addToWatchlist = async (req, res) => {
  const userId = req.user.userId;
  const { tmdbId, title, poster } = req.body;

  const item = await prisma.watchlist.create({
    data: { userId, tmdbId, title, poster }
  });

  res.status(201).json(item);
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
        // add any public profile fields here
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

    // Optionally validate email uniqueness if changing email
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // If email has changed, ensure it's not taken
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
