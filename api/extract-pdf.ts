import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export const config = { api: { bodyParser: false } };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ maxFileSize: 5 * 1024 * 1024 }); // 5MB limit

  try {
    const [, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const buffer = fs.readFileSync(file.filepath);
    const data = await pdfParse(buffer);
    const text = data.text.slice(0, 15000);

    return res.status(200).json({ text });
  } catch (err) {
    console.error('PDF extract error:', err);
    return res.status(500).json({ error: 'Could not parse PDF.' });
  }
}
