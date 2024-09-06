import express, { Router } from "express"
import { aiRouter } from "./ai";
import { reelRouter } from "./reel";

const router = Router();

router.get("/",(req, res)=>{
    res.status(201).json({msg:"working"})
})

router.use("/ai",aiRouter);
router.use("/reel",reelRouter)

export default router;