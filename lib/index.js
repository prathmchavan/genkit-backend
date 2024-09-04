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
// Use the cors middleware with specific origin or allow all origins
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001', 'https://learnium.coolify.top/'], // Replace with your frontend's origin
    methods: 'GET,POST', // Allow specific methods
    allowedHeaders: 'Content-Type', // Allow specific headers
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
app.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`);
});
//# sourceMappingURL=index.js.map