import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import mongoose from "mongoose";

const app: Application = express();
dotenv.config({ path: '.env.local' });
app.use(express.json());

const PORT = process.env.PORT || 8000;
const uri = process.env.URI
app.use(cors({
    origin: [
        'http://localhost:3001',
        'http://localhost:3000',
        'https://learnium.coolify.top'
    ],
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "x-client-key",
        "x-client-token",
        "x-client-secret",
        "Authorization"
    ],
    credentials: true,
}));

app.use("/", router);
if (uri) {
    mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000,      
    });
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
        console.log(`Mongoose connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });
    
    
}
app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`);
});
