import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Add a review
export const addReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tmdbId, content, rating } = req.body;

    if (!tmdbId || !content) {
      return res.status(400).json({ error: "Movie ID and content are required." });
    }

    // Optional: Check if user already reviewed this movie to prevent duplicates
    // For now, we allow multiple, or you can uncomment below:
    /*
    const existing = await prisma.review.findFirst({
      where: { userId, tmdbId: Number(tmdbId) }
    });
    if (existing) return res.status(409).json({ error: "You reviewed this already." });
    */

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

// Get reviews for a movie
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
      take: 20 // Limit to recent 20
    });

    res.json(reviews);
  } catch (err) {
    console.error("getReviews error:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
};
