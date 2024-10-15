import  { Router } from "express"
import { callOaQuestionGenerationFlow, callOaResultFlow, callQuestionGenerationFlow, callResultFlow } from "../services";

const router = Router();

router.post('/aptiquestion', async (req, res) => {
    try {
        // console.log("this is req body", req.body);
        const { level } = req.body;
        const result = await callQuestionGenerationFlow(level);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/aptiresult', async (req, res) => {
    try {
        // console.log("this is req boyd", req.body);
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

router.post('/oaquestion', async (req, res) => {
    try {
        // console.log("this is req boyd", req.body);
        const { level } = req.body;
        let result = await callOaQuestionGenerationFlow(level);
        result = result
            .replace(/^\s*```json\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
        result = result.replace(/`+/g, '').trim();
        result = result.replace(/[\r\n]+/g, '');
        const parsedRes = JSON.parse(result);
        res.send(parsedRes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/oaresult', async (req, res) => {
    try {
        // console.log("This is req.body", req.body);
        const { data } = req.body;
        if (data) {
            const dataString = JSON.stringify(data);
            console.log("Data as String:", dataString);
            let result = await callOaResultFlow(dataString);
            result = result.trim().replace(/^```json|```$/g, ''); 3
            const parsedRes = JSON.parse(result);
            res.send(parsedRes);
        } else {
            res.status(400).send("Bad Request: `data` is required");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


export { router as aiRouter };
