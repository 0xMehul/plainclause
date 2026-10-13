// Local development server that mimics Vercel serverless functions
// Run with: node dev-server.cjs
// Requires .env file with ANTHROPIC_API_KEY

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

// Register TypeScript on-the-fly
require('ts-node').register({ transpileOnly: true, esm: false });

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/analyze' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
        const handler = require('./api/analyze').default;
        const mockRes = {
          statusCode: 200,
          status(code) { this.statusCode = code; return this; },
          json(data) {
            res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          },
        };
        await handler(req, mockRes);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev API server running on http://localhost:${PORT}`);
  console.log('   /api/analyze is ready\n');
});
