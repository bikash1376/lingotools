import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { LingoDotDevEngine } from "lingo.dev/sdk";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/health', (req, res) => {
  return res.json({ message: 'hello from server' });
});

// init lingo.dev
const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
}); 

app.post('/translate', async (req, res) => {
  const { html, targetLocale = 'es', sourceLocale = 'en' } = req.body || {};
  if (!html) return res.status(400).json({ error: 'Missing html in request body' });

  try {
    const translatedHtml = await lingo.localizeHtml(html, { sourceLocale, targetLocale });
    return res.json({ translatedHtml });
  } catch (err) {
    console.error('Translate error', err);
    return res.status(500).json({ error: err?.message || 'Translation failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); // start