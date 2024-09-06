import express ,{ NextFunction, Request, Response } from "express";
// import { CustomError } from "../errors";
import Reel, { IReel } from "../models/Reel";
// import User from "../models/User";
// import Collection, { ICollection } from "../models/Collection";

// Create a new reel
export const createReel = async (req: Request, res: Response) => {
    try {
        const { video, thumbnail, description, caption, ownerId } = req.body;
        

        const reel = new Reel({
            video,
            thumbnail,
            description,
            caption,
            ownerId
        });

        await reel.save();
        return res.status(201).json({ message: "Reel created!", reel });
    } catch (error) {
        return console.log(error)
    }
};

// Get a specific reel
export const getReel = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const reel = await Reel.findById(id).populate('ownerId', 'name avatar id'); // Populate User details

        if (!reel) {
            return res.status(404).json({ message: "Reel not found", reel: {} });
        }

        return res.status(200).json({ message: "Reel fetched!", postedBy: reel.ownerId, reel });
    } catch (error) {
        return console.log(error)
    }
};

// Get multiple reels with pagination
export const getReels = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0 } = req.query;

    try {
        const reels = await Reel.find()
            .limit(Number(limit))
            .skip(Number(offset))
            .populate('ownerId', 'name avatar id');
        return res.status(200).json({ message: "Reels fetched!", reels });
    } catch (error) {
        return console.log(error)
    }
};

// Toggle like on a reel
export const toggleLike = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.headers

    try {
        const reel = await Reel.findById(id);

        if (!reel) {
            throw new Error("Reel does not exist!");
        }

        const likes = reel.likes.includes(Number(userId))
            ? reel.likes.filter(like => like.toString() !== userId.toString())
            : [...reel.likes, Number(userId)];

        reel.likes = likes;
        await reel.save();

        return res.status(200).json({ message: "Like updated!" });
    } catch (error) {
        return console.log(error)
    }
};

// Check if the reel is liked by the user
export const getIsLiked = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.headers;

    try {
        const reel = await Reel.findById(id);

        if (!reel) {
            throw new Error("Reel does not exist!");
        }

        const isLiked = reel.likes.includes(Number(userId));

        return res.status(200).json({ message: isLiked ? "Liked already!" : "Post is not liked!", liked: isLiked });
    } catch (error) {
        return console.log(error)
    }
};

// Add or remove a reel from the user's collection
// export const addToCollection = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = res.locals.user.id;
//         const reelId = req.params.id;

//         const reel = await Reel.findById(reelId);

//         if (!reel) {
//             throw new Error("Reel not found!");
//         }

//         let collection = await Collection.findOne({ ownerId: userId });

//         if (!collection) {
//             collection = new Collection({ ownerId: userId });
//         }

//         const isInCollection = collection.reels.includes(reelId);
//         if (isInCollection) {
//             collection.reels = collection.reels.filter(id => id.toString() !== reelId.toString());
//             await collection.save();
//             return res.status(200).json({ message: "Removed reel from collection!", collection: collection.reels });
//         } else {
//             collection.reels.push(reelId);
//             await collection.save();
//             return res.status(200).json({ message: "Added reel to collection!", collection: collection.reels });
//         }
//     } catch (error) {
//         next(error);
//     }
// };

// Get the user's collection
// export const getCollection = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = res.locals.user.id;
//         let collection = await Collection.findOne({ ownerId: userId });

//         if (!collection) {
//             collection = new Collection({ ownerId: userId });
//             await collection.save();
//         }

//         return res.status(200).json({ message: "Collection fetched!", collection });
//     } catch (error) {
//         throw new Error(String(error))   
//     }
// };
