export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, system } = req.body;
  const key = process.env.GEMINI_API_KEY;
  try {
    const contents = messages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));
    const body = {
      system_instruction: { parts: [{ text: system }] },
      contents: contents
    };
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tente novamente 😊";
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ content: [{ text: "Erro: " + err.message }] });
  }
      }
