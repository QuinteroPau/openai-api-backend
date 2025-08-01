
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prompt = req.body?.prompt || "Hola";
  res.status(200).json({ response: `Echo: ${prompt}` });
}
