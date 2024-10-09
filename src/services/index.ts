'use server'

import * as z from 'zod';

// Import the Genkit core libraries and plugins.
import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, runFlow } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';
import { gemini15Flash } from '@genkit-ai/googleai';

configureGenkit({
  plugins: [
    // Load the Google AI plugin. You can optionally specify your API key
    // by passing in a config object; if you don't, the Google AI plugin uses
    // the value from the GOOGLE_GENAI_API_KEY environment variable, which is
    // the recommended practice.
    googleAI(),

  ],

  // Log debug output to tbe console.
  logLevel: "debug",
  // Perform OpenTelemetry instrumentation and enable trace collection.
  enableTracingAndMetrics: true,
});

// Define a simple flow that prompts an LLM to generate menu suggestions.
const questionGenerationFlow = defineFlow(
  {
    name: 'questionGenerationFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await generate({
      prompt: `Generate exactly 3 unique, multiple-choice aptitude questions for the difficulty level: ${subject}. Ensure questions cover a variety of topics and adhere to the following structure:

[
  {
    "id": 1,
    "text": "Question text goes here",
    "options": [
      { "id": "a", "text": "Option A" },
      { "id": "b", "text": "Option B" },
      { "id": "c", "text": "Option C" },
      { "id": "d", "text": "Option D" }
    ],
    "correctAnswer": "c"
  },
  {
    "id": 2,
    "text": "Second question text goes here",
    "options": [
      { "id": "a", "text": "Option A" },
      { "id": "b", "text": "Option B" },
      { "id": "c", "text": "Option C" },
      { "id": "d", "text": "Option D" }
    ],
    "correctAnswer": "a"
  },
  {
    "id": 3,
    "text": "Third question text goes here",
    "options": [
      { "id": "a", "text": "Option A" },
      { "id": "b", "text": "Option B" },
      { "id": "c", "text": "Option C" },
      { "id": "d", "text": "Option D" }
    ],
    "correctAnswer": "b"
  }
]

Guidelines:
1. Each question must have a unique id.
2. The "text" field must contain the question.
3. The "options" array must provide four unique choices, each with an id ('a', 'b', 'c', 'd').
4. The correct answer must be indicated in the "correctAnswer" field and match one of the option ids.
5. Ensure diversity in question topics across subjects and difficulty levels.
6. Minimize repetition of questions or topics across multiple generations.
7. The output must be in valid JSON format.

Please provide only the JSON output without additional explanations or characters.
`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });

    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
  }
);

const resultFlow = defineFlow(
  {
    name: 'resultFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await generate({
      prompt: `Please evaluate the user's answers and create a report card that includes:
        1. Total number of questions.
        2. Number of correct answers .
        3. Number of incorrect answers .
        4. Score as a percentage but it should not be float value it should be absolute value .
        5. A brief feedback message based on the score which should have top strength and areas of improvement , in top strength show which topic or topic is strong and in areas of improvement tell user about the weak areas or weak point which should user focus to improve on . 
        6. Create answersheet it should have question , user answer and correct answer .
        format of above should be followed by below format :
        {
          "reportCard": {
          "totalQuestions": 10,
          "correctAnswers": 1,
          "incorrectAnswers": 9,
          "score": 1,
          "feedback": {
            "strengths":"Your logical reasoing is good",
            "improvements":"focus on math"
          } 
        },
          "answerSheet": 
     [
       {
          "questionId": 1,
          "question":"this is question",
          "userAnswer": "a",
          "correctAnswer": "a"
        }
      ]
        
        the user answers and question set is in : ${subject}
        Give me the above response in json formate and don't provide me your **Explanation:** ,i just want the above respons json response.
        `,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });

    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
  }
);


const oaquestionFlow = defineFlow(
  {
    name: 'oaquestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await generate({
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
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });

    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
  }
);



const oaresultFlow = defineFlow(
  {
    name: 'oaresultFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    // Construct a request and send it to the model API.
    const llmResponse = await generate({
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
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });

    // Handle the response from the model API. In this sample, we just
    // convert it to a string, but more complicated flows might coerce the
    // response into structured output or chain the response into another
    // LLM call, etc.
    return llmResponse.text();
  }
);

export async function callQuestionGenerationFlow(difficulty: string) {
  // Invoke the flow. The value you pass as the second parameter must conform to
  // your flow's input schema.
  try {

    const flowResponse = await runFlow(questionGenerationFlow, difficulty);
    console.log(flowResponse);
    return flowResponse;
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function callOaQuestionGenerationFlow(difficulty: string) {
  // Invoke the flow. The value you pass as the second parameter must conform to
  // your flow's input schema.
  const flowResponse = await runFlow(oaquestionFlow, difficulty);
  console.log(flowResponse);
  return flowResponse;
}

export async function callResultFlow(data: string) {
  // Invoke the flow. The value you pass as the second parameter must conform to
  // your flow's input schema.
  const flowResponse = await runFlow(resultFlow, data);
  console.log(flowResponse);
  return flowResponse;
}

export async function callOaResultFlow(data: string) {
  // Invoke the flow. The value you pass as the second parameter must conform to
  // your flow's input schema.
  const flowResponse = await runFlow(oaresultFlow, data);
  console.log(flowResponse);
  return flowResponse;
}
