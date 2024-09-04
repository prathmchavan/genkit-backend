"use strict";
'use server';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callQuestionGenerationFlow = callQuestionGenerationFlow;
exports.callOaQuestionGenerationFlow = callOaQuestionGenerationFlow;
exports.callResultFlow = callResultFlow;
exports.callOaResultFlow = callOaResultFlow;
const z = __importStar(require("zod"));
// Import the Genkit core libraries and plugins.
const ai_1 = require("@genkit-ai/ai");
const core_1 = require("@genkit-ai/core");
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const googleai_2 = require("@genkit-ai/googleai");
(0, core_1.configureGenkit)({
    plugins: [
        // Load the Google AI plugin. You can optionally specify your API key
        // by passing in a config object; if you don't, the Google AI plugin uses
        // the value from the GOOGLE_GENAI_API_KEY environment variable, which is
        // the recommended practice.
        (0, googleai_1.googleAI)(),
    ],
    // Log debug output to tbe console.
    logLevel: "debug",
    // Perform OpenTelemetry instrumentation and enable trace collection.
    enableTracingAndMetrics: true,
});
// Define a simple flow that prompts an LLM to generate menu suggestions.
const questionGenerationFlow = (0, flow_1.defineFlow)({
    name: 'questionGenerationFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await (0, ai_1.generate)({
        prompt: `Generate exactly 3 multiple-choice aptitude questions for the ${subject} difficulty level. Each question should adhere to the following structure:

[
  {
    "id": 1,
    "text": "What is the capital of France?",
    "options": [
      { "id": "a", "text": "Berlin" },
      { "id": "b", "text": "Madrid" },
      { "id": "c", "text": "Paris" },
      { "id": "d", "text": "Rome" }
    ],
    "correctAnswer": "c"
  },
  {
    "id": 2,
    "text": "If a train travels at 60 miles per hour, how far will it travel in 3 hours?",
    "options": [
      { "id": "a", "text": "120 miles" },
      { "id": "b", "text": "180 miles" },
      { "id": "c", "text": "240 miles" },
      { "id": "d", "text": "300 miles" }
    ],
    "correctAnswer": "b"
  },
  {
    "id": 3,
    "text": "What is the next number in the sequence: 2, 4, 6, 8, ...?",
    "options": [
      { "id": "a", "text": "10" },
      { "id": "b", "text": "12" },
      { "id": "c", "text": "14" },
      { "id": "d", "text": "16" }
    ],
    "correctAnswer": "a"
  }
]
1.Ensure each question has a unique id.
2.The text field should be the question itself.
3.The options array must contain four choices, each with a unique id ('a', 'b', 'c', 'd') and corresponding text.
4.The correctAnswer field should match the id of the correct option.
5. The output must be a valid JSON array following the structure provided.
 Please respond only with the JSON format as specified above without any additional explanations or characters..`,
        model: googleai_2.gemini15Flash,
        config: {
            temperature: 1,
        },
    });
    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
});
const resultFlow = (0, flow_1.defineFlow)({
    name: 'resultFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await (0, ai_1.generate)({
        prompt: `Please evaluate the user's answers and create a report card that includes:
        1. Total number of questions.
        2. Number of correct answers .
        3. Number of incorrect answers .
        4. Score as a percentage .
        5. A brief feedback message based on the score . 
        6. Create answersheet in that show user answer and correct answer.
        format of above should be followed by below format :
        {
          "reportCard": {
          "totalQuestions": 10,
          "correctAnswers": 1,
          "incorrectAnswers": 9,
          "score": 1,
          "feedback": "You answered 1 out of 10 questions correctly. Keep practicing and you'll improve!"  
        },
          "answerSheet": 
     [
       {
          "questionId": 1,
          "userAnswer": "a",
          "correctAnswer": "a"
        }
      ]
        
        the user answers and question set is in : ${subject}
        Give me the above response in json formate and don't provide me your e **Explanation:** ,i just want the above respons json response.
        `,
        model: googleai_2.gemini15Flash,
        config: {
            temperature: 1,
        },
    });
    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
});
const oaquestionFlow = (0, flow_1.defineFlow)({
    name: 'oaquestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await (0, ai_1.generate)({
        prompt: `Please create 1 coding Online Assesment question of ${subject} difficulty which will be asked in real online assesment test , with the following structure for each question:
      {
    "id": 1,
    "text": "What is the capital of France?"
    }

    Please follow this format closely:
    1) Provide a unique id for each question.
    2) text should be the question itself.
    3) the question should be solvable in any language.
        `,
        model: googleai_2.gemini15Flash,
        config: {
            temperature: 1,
        },
    });
    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
});
const oaresultFlow = (0, flow_1.defineFlow)({
    name: 'oaresultFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await (0, ai_1.generate)({
        prompt: `Please evaluate the user's answers and create a reportCard that includes:
        1. A brief feedback message based on the useranswer. 
        2. Create answersheet in that show user answer and correct answer.
      
        
        the user answers and question set is in : ${subject} as well as provide the correct answer in user selected language that 
        
        Give me the above response in below json format
        {
        "reportCard": {
          "feedback": "",
          "answerSheet": [
            {
              "question": "",
              "userAnswer": "",
              "correctAnswer": ""
            }
          ]
        }
      }
     
        `,
        model: googleai_2.gemini15Flash,
        config: {
            temperature: 1,
        },
    });
    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
});
async function callQuestionGenerationFlow(difficulty) {
    // Invoke the flow. The value you pass as the second parameter must conform to
    // your flow's input schema.
    try {
        const flowResponse = await (0, flow_1.runFlow)(questionGenerationFlow, difficulty);
        console.log(flowResponse);
        return flowResponse;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
async function callOaQuestionGenerationFlow(difficulty) {
    // Invoke the flow. The value you pass as the second parameter must conform to
    // your flow's input schema.
    const flowResponse = await (0, flow_1.runFlow)(oaquestionFlow, difficulty);
    console.log(flowResponse);
    return flowResponse;
}
async function callResultFlow(data) {
    // Invoke the flow. The value you pass as the second parameter must conform to
    // your flow's input schema.
    const flowResponse = await (0, flow_1.runFlow)(resultFlow, data);
    console.log(flowResponse);
    return flowResponse;
}
async function callOaResultFlow(data) {
    // Invoke the flow. The value you pass as the second parameter must conform to
    // your flow's input schema.
    const flowResponse = await (0, flow_1.runFlow)(oaresultFlow, data);
    console.log(flowResponse);
    return flowResponse;
}
//# sourceMappingURL=index.js.map