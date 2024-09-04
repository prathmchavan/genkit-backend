import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";  // Import the cors package
import { callOaQuestionGenerationFlow ,callQuestionGenerationFlow, callResultFlow } from "./services";

const app: Application = express();
dotenv.config({path:'.env.local'});
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ['http://localhost:3001', 'https://learnium.coolify.top', 'https://learnium.coolify.top/ai/apti'],
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type',
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
