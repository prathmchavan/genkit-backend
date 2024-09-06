import { Router } from "express";
import { createReel, getIsLiked, getReel, getReels, toggleLike } from "../controllers/reel";
// import { verifyUser } from "../middlewares";
// import { addToCollection, createReel, getCollection, getIsLiked, getReel, getReels, toggleLike } from "../controllers";

const router = Router();

router.post("/",  createReel);
// router.get("/collection",  getSelection)
router.get("/", getReels);
router.put("/like/:id",  toggleLike)
router.get("/:id/likes",  getIsLiked)
// router.put("/add-to-collection/:id",  addToCollection);
router.get("/:id", getReel);

export { router as reelRouter };