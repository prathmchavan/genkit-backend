import * as z from 'zod';
import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, runFlow } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';
import { gemini15Flash } from '@genkit-ai/googleai';

configureGenkit({
  plugins: [
    googleAI(),
  ],

  logLevel: "debug",
  enableTracingAndMetrics: true,
});

const questionGenerationFlow = defineFlow(
  {
    name: 'questionGenerationFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `Generate exactly 30 unique, multiple-choice aptitude questions for the difficulty level: ${subject}. Ensure questions cover a variety of topics and adhere to the following structure:
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

                Please provide only the JSON output without additional explanations or characters.`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });
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
    const llmResponse = await generate({
      prompt:
        `Create a coding online assessment question with the ${subject} difficulty level. Ensure that the question follows the structure below and is suitable for real online assessments, allowing it to be solvable in any programming language. Adhere strictly to the format provided:
            Format:
        {
          "id": 1,
          "text": "Write a function that prints all prime numbers from a given array of integers."
        }       
      Requirements:
        Provide a unique integer id for each question.
        The text should contain the question itself.
        The question must be solvable using any programming language and should fit the given difficulty level.
        Make sure the question is clear, concise, and tests fundamental coding skills effectively.`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });
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
    const llmResponse = await generate({
      prompt: `Evaluate the user's answers and generate a reportCard based on the provided question set in the field of ${subject}. Follow the requirements below to create a structured response:

      Requirements:
      1) Provide a brief feedback message based on the user's answer accuracy and correctness.
      2) Construct an answerSheet that displays each question, the user's answer (userAnswer), and the correct answer (correctAnswer).
      3) Ensure the correct answer is presented in the user's selected programming language.
    
      Output Format:
      {
          "reportCard":
          {
              "feedback": "",
              "answerSheet":
              [
                {
                  "question": "",
                  "userAnswer": "",
                  "correctAnswer": ""
                }
              ] 
          }
      }
  Make sure the feedback is concise and relevant, and that the answerSheet clearly highlights any discrepancies between the user's answers and the correct solutions.`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    });
    return llmResponse.text();
  }
);

export async function callQuestionGenerationFlow(difficulty: string) {
  try {
    const flowResponse = await runFlow(questionGenerationFlow, difficulty);
    console.log(flowResponse);
    return flowResponse;
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function callOaQuestionGenerationFlow(difficulty: string) {
  const flowResponse = await runFlow(oaquestionFlow, difficulty);
  console.log(flowResponse);
  return flowResponse;
}

export async function callResultFlow(data: string) {
  const flowResponse = await runFlow(resultFlow, data);
  console.log(flowResponse);
  return flowResponse;
}

export async function callOaResultFlow(data: string) {
  const flowResponse = await runFlow(oaresultFlow, data);
  console.log(flowResponse);
  return flowResponse;
}
