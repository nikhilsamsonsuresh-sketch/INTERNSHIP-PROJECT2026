export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  // 2. Fetch the key from Vercel's Environment Variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'GEMINI_API_KEY is not configured on Vercel.' } });
  }

  try {
    // 3. Forward the frontend payload directly to Google's API endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // 4. Return the exact response and status back to the frontend
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
}