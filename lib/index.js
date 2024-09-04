"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import the cors package
const services_1 = require("./services");
const app = (0, express_1.default)();
dotenv_1.default.config({ path: '.env.local' });
app.use(express_1.default.json());
const PORT = process.env.PORT || 8000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001', 'https://learnium.coolify.top', 'https://learnium.coolify.top/ai/apti'],
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type',
}));
app.get('/', (req, res) => {
    res.send("working");
});
app.post('/q', async (req, res) => {
    try {
        console.log("this is req boyd", req.body);
        const { level } = req.body;
        const result = await (0, services_1.callQuestionGenerationFlow)(level);
        res.send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
app.post('/result', async (req, res) => {
    try {
        console.log("this is req boyd", req.body);
        const { data } = req.body;
        let result = await (0, services_1.callResultFlow)(data);
        result = result
            .replace(/^```json|```$/g, '');
        const parsedRes = JSON.parse(result);
        res.send(parsedRes);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
//oa test routes
app.post('/qoa', async (req, res) => {
    try {
        console.log("this is req boyd", req.body);
        const { level } = req.body;
        let result = await (0, services_1.callOaQuestionGenerationFlow)(level);
        result = result
            .replace(/^\s*```json\s*/i, '') // Remove leading ```json, case-insensitive
            .replace(/\s*```$/i, '') // Remove trailing ```, case-insensitive
            .trim(); // Trim any extra whitespace
        // Remove any remaining backticks or special characters
        result = result.replace(/`+/g, '').trim(); // Remove any backticks and extra whitespace
        // Ensure that any extra whitespace or formatting issues are removed
        result = result.replace(/[\r\n]+/g, ''); // Remove newline characters
        // Parse the cleaned response as JSON
        const parsedRes = JSON.parse(result);
        res.send(parsedRes);
    }
    catch (error) {
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
            let result = await (0, services_1.callOaResultFlow)(dataString);
            // Process the result
            result = result.trim().replace(/^```json|```$/g, '');
            // Parse the result to JSON if needed
            const parsedRes = JSON.parse(result);
            // Send the parsed result as the response
            res.send(parsedRes);
        }
        else {
            res.status(400).send("Bad Request: `data` is required");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`);
});
//# sourceMappingURL=index.js.map