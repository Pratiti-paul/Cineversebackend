import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
  createCollection, 
  getMyCollections, 
  getCollection, 
  updateCollection, 
  deleteCollection,
  addItem,
  removeItem
} from "../controllers/collectionController.js";

const router = express.Router();

router.use(verifyToken); // All routes require auth

router.post("/", createCollection);
router.get("/", getMyCollections);
router.get("/:id", getCollection);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);

router.post("/:id/items", addItem);
router.delete("/:id/items/:tmdbId", removeItem);

export default router;
