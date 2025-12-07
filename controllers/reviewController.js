import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tmdbId, content, rating } = req.body;

    if (!tmdbId || !content) {
      return res.status(400).json({ error: "Movie ID and content are required." });
    }
    const review = await prisma.review.create({
      data: {
        userId,
        tmdbId: Number(tmdbId),
        content,
        rating: rating ? Number(rating) : null,
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("addReview error:", err);
    res.status(500).json({ error: "Failed to post review." });
  }
};
export const getReviews = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { tmdbId: Number(tmdbId) },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20 
    });

    res.json(reviews);
  } catch (err) {
    console.error("getReviews error:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
};
