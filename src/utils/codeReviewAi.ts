// A "High Logic" AI Model for code analysis
// i.e. gpt-o1 for high accuracy code reviews and logic analysis
import OpenAi from 'openai';
import type { OpenAI } from 'openai/src/index.js';
import type { IssueContextObj } from './aiTypes.js';

const codeReviewAiClient = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });
