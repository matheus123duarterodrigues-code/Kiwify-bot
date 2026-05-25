export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, system } = req.body;
  const key = process.env.GEMINI_API_KEY;
  try {
    const contents = [];
    for (const m of messages) {
      contents.push({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      });
    }
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + key;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        generationConfig: { maxOutputTokens: 500 }
      })
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(200).json({ content: [{ text: "Tente novamente 😊" }] });
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(200).json({ content: [{ text: "Erro: " + err.message }] });
  }
        }
