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
