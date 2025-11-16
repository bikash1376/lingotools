import { LingoDotDevEngine } from "lingo.dev/sdk";
import dotenv from 'dotenv'


dotenv.config();

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});


const html = "<div>Hello <strong>world</strong></div>";

const translated = await lingoDotDev.localizeHtml(html, {
  sourceLocale: "en",
  targetLocale: "es",
});
console.log(translated);
// Output: "<div>Hola <strong>mundo</strong></div>"