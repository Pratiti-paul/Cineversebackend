import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a new collection
export const createCollection = async (req, res) => {
  console.log("createCollection request body:", req.body);
  console.log("createCollection user:", req.user);
  try {
    const userId = req.user.userId;
    const { title, description, isPublic } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });

    const collection = await prisma.collection.create({
      data: {
        userId,
        title,
        description,
        isPublic: !!isPublic
      }
    });

    res.status(201).json(collection);
  } catch (err) {
    console.error("createCollection error:", err);
    res.status(500).json({ error: "Failed to create collection" });
  }
};

// Get current user's collections
export const getMyCollections = async (req, res) => {
  try {
    const userId = req.user.userId;
    const collections = await prisma.collection.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        items: {
          take: 4, // Preview images
          select: { posterPath: true }
        }
      }
    });
    res.json(collections);
  } catch (err) {
    console.error("getMyCollections error:", err);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};

// Get a specific collection
export const getCollection = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!collection) return res.status(404).json({ error: "Collection not found" });

    // Privacy check: Allow if owner OR if public
    if (collection.userId !== userId && !collection.isPublic) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(collection);
  } catch (err) {
    console.error("getCollection error:", err);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
};

// Update collection metadata
export const updateCollection = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;
    const { title, description, isPublic } = req.body;

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    if (collection.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        title: title || collection.title,
        description: description !== undefined ? description : collection.description,
        isPublic: isPublic !== undefined ? isPublic : collection.isPublic
      }
    });

    res.json(updated);
  } catch (err) {
    console.error("updateCollection error:", err);
    res.status(500).json({ error: "Failed to update collection" });
  }
};

// Delete collection
export const deleteCollection = async (req, res) => {
  console.log("deleteCollection id:", req.params.id);
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    if (collection.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.collection.delete({ where: { id } });
    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error("deleteCollection error:", err);
    res.status(500).json({ error: "Failed to delete collection" });
  }
};

// Add item to collection
export const addItem = async (req, res) => {
  console.log("addItem params:", req.params, "body:", req.body);
  try {
    const collectionId = Number(req.params.id);
    const userId = req.user.userId;
    const { tmdbId, title, posterPath, releaseDate } = req.body;

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    if (collection.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Check duplicate
    const existing = await prisma.collectionItem.findUnique({
      where: {
        collectionId_tmdbId: {
          collectionId,
          tmdbId: Number(tmdbId)
        }
      }
    });

    if (existing) return res.status(409).json({ error: "Item already in collection" });

    const item = await prisma.collectionItem.create({
      data: {
        collectionId,
        tmdbId: Number(tmdbId),
        title,
        posterPath,
        releaseDate
      }
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("addItem error:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
};

// Remove item from collection
export const removeItem = async (req, res) => {
  console.log("removeItem params:", req.params);
  try {
    const collectionId = Number(req.params.id);
    const itemId = Number(req.params.itemId); // This can be item.id OR item.tmdbId depending on route design. Let's assume tmdbId for ease, or we lookup item id first? 
    // Usually removing by TMDB ID from a collection is easier from the UI (movie page).
    // Let's support removing by tmdbId for consistency with "toggle" behavior.
    
    // BUT, wait. If we are on "Collection Details" we have the Item ID. If we are on "Movie Details" we have TMDB ID.
    // Let's stick to valid resource ID style: DELETE /collections/:id/items/:itemId 
    // And also maybe DELETE /collections/:id/movies/:tmdbId ?
    
    // Simplest: The controller receives the TMDB ID from the body OR param.
    // Let's implement removing by TMDB ID as that's most flexible.
    
    const userId = req.user.userId;
    const tmdbId = Number(req.params.tmdbId);

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    if (collection.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.collectionItem.delete({
      where: {
        collectionId_tmdbId: {
          collectionId,
          tmdbId
        }
      }
    });

    res.json({ message: "Item removed" });
  } catch (err) {
    if (err.code === 'P2025') {
        // Record not found
        return res.status(404).json({ error: "Item not found in collection" });
    }
    console.error("removeItem error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};
