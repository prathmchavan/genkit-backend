import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";  // Import the cors package
import { callOaQuestionGenerationFlow ,callOaResultFlow,callQuestionGenerationFlow, callResultFlow } from "./services";

const app: Application = express();
dotenv.config({path:'.env.local'});
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ['http://localhost:3001', 
        'http://localhost:3000',
        'https://learnium.coolify.top',
         'https://learnium.coolify.top/ai/apti'],
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


//oa test routes
app.post('/qoa', async (req, res) => {  // Use POST instead of GET as discussed earlier
    try {
        console.log("this is req boyd",req.body);
        const { level } = req.body;
        let result = await callOaQuestionGenerationFlow(level);

        result = result
                .replace(/^\s*```json\s*/i, '')  // Remove leading ```json, case-insensitive
                .replace(/\s*```$/i, '')         // Remove trailing ```, case-insensitive
                .trim();                        // Trim any extra whitespace


            // Remove any remaining backticks or special characters
            result = result.replace(/`+/g, '').trim(); // Remove any backticks and extra whitespace

            // Ensure that any extra whitespace or formatting issues are removed
            result = result.replace(/[\r\n]+/g, ''); // Remove newline characters

            // Parse the cleaned response as JSON
            const parsedRes = JSON.parse(result);
        res.send(parsedRes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post('/resultoa', async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log("This is req.body", req.body);

        // Extract JSON object from req.body
        const { data } = req.body;

        if (data) {
            // Convert the JSON object to a string
            const dataString = JSON.stringify(data);

            console.log("Data as String:", dataString);

            // Call your function with the stringified data
            let result = await callOaResultFlow(dataString);

            // Process the result
            result = result.trim().replace(/^```json|```$/g, '');3
            

            // Parse the result to JSON if needed
            const parsedRes = JSON.parse(result);

            // Send the parsed result as the response
            res.send(parsedRes);
        } else {
            res.status(400).send("Bad Request: `data` is required");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});



app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`);
});
