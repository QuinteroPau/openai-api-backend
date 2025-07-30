import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  const functions = [
    {
      name: "addCalendarTask",
      description: "Add a task to the user's calendar",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          date: { type: "string", format: "date" }
        },
        required: ["title", "date"]
      }
    }
  ];

  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo-0613',
        messages: [
          { role: 'system', content: 'You are a calendar assistant.' },
          { role: 'user', content: prompt }
        ],
        functions
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.status(200).json(openaiRes.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'OpenAI API error', details: err.response?.data || err.message });
  }
}
