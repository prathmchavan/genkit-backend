import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";  // Import the cors package
import { callOaQuestionGenerationFlow ,callQuestionGenerationFlow, callResultFlow } from "./services";

const app: Application = express();
dotenv.config({path:'.env.local'});
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Use the cors middleware with specific origin or allow all origins
app.use(cors({
    origin: 'http://localhost:3001', // Replace with your frontend's origin
    methods: 'GET,POST',             // Allow specific methods
    allowedHeaders: 'Content-Type',  // Allow specific headers
}));

app.get('/', (req, res) => {
    res.send("working");
});

app.post('/q', async (req, res) => {  // Use POST instead of GET as discussed earlier
    try {
        console.log("this is req boyd",req.body);
        const { level } = req.body;
        const result = await callQuestionGenerationFlow(level);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/result', async (req, res) => {  // Use POST instead of GET as discussed earlier
    try {
        console.log("this is req boyd",req.body);
        const { data } = req.body;
        let result = await callResultFlow(data);
         result = result
                .replace(/^```json|```$/g, '')

       const parsedRes = JSON.parse(result);
        res.send(parsedRes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`);
});
