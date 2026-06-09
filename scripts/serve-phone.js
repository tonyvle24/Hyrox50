const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..', 'dist-release');
const port = 4173;
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
};

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('The phone preview build is missing. Ask Codex to rebuild dist-release.');
  process.exit(1);
}

const interfaces = os.networkInterfaces();
const preferredNames = Object.keys(interfaces).filter((name) => /wi-?fi|wireless|wlan/i.test(name));
const localAddress = [...preferredNames, ...Object.keys(interfaces)]
  .flatMap((name) => interfaces[name] ?? [])
  .find(
    (address) =>
      address.family === 'IPv4' &&
      !address.internal &&
      !address.address.startsWith('169.254.') &&
      !address.address.startsWith('192.168.80.') &&
      !address.address.startsWith('192.168.140.'),
  )?.address;

if (process.argv.includes('--check')) {
  console.log(`Phone preview ready at http://${localAddress ?? 'YOUR-COMPUTER-IP'}:${port}`);
  process.exit(0);
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const candidate = path.resolve(root, relativePath);
  const safeCandidate = candidate.startsWith(root) && fs.existsSync(candidate) ? candidate : path.join(root, 'index.html');
  const extension = path.extname(safeCandidate);
  response.writeHead(200, {
    'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(safeCandidate).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log('');
  console.log('HYROX50 phone preview is running.');
  console.log(`Open this on your phone: http://${localAddress ?? 'YOUR-COMPUTER-IP'}:${port}`);
  console.log('');
  console.log('Keep this window open while testing. Press Ctrl+C to stop.');
});
