import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import { connectDB } from "@microproj/mongodb-connector";

const app: Application = express();
dotenv.config({ path: '.env.local' });
app.use(express.json());

const PORT = process.env.PORT || 8000;
const uri = process.env.URI
app.use(cors({
    origin: ['http://localhost:3001',
        'http://localhost:3000',
        'https://learnium.coolify.top',
        'https://learnium.coolify.top/ai/apti',
        "https://api.learnium.coolify.top/reel"
    ],
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
    allowedHeaders: 'Content-Type',
}));


//initialize router
app.use("/", router);
if (uri) {
    connectDB(uri);
}
app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`);
});
