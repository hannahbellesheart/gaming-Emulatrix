#!/usr/bin/env node
// Simple Node static server (no deps)
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000;
const base = process.cwd();

const mime = {
  '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.wasm':'application/wasm', '.json':'application/json'
};

http.createServer((req,res)=>{
  const reqPath = path.join(base, decodeURIComponent(req.url.split('?')[0]));
  let file = reqPath;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  if (!fs.existsSync(file)) { res.statusCode=404; res.end('Not found'); return }
  const ext = path.extname(file);
  res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(port,()=>console.log(`Serving ${base} on http://localhost:${port}`));