import express, { Application } from "express"
import dotenv from "dotenv"
import { callOaQuestionGenerationFlow } from "./services";


const app: Application = express();
dotenv.config({ path: '.env.local' });

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.json("working")
})

app.post('/q', async (req, res) => {
    try {
        const { level } = req.body;
        let result = await callOaQuestionGenerationFlow(level); // Use the level from the request body
        result = result
        .replace(/^```json|```$/g, '')
        .trim();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`)
})