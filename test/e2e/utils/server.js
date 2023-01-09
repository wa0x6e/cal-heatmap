import fs from 'fs';
import http from 'http';
import url from 'url';
import path from 'path';

http
  .createServer((req, res) => {
    const uri = url.parse(req.url).pathname;
    let filename = path.join(process.cwd(), uri);

    fs.stat(filename, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found\n');
        res.end();
        return;
      }

      if (stats.isDirectory()) filename += '/index.html';

      fs.readFile(filename, 'binary', (err2, file) => {
        if (err2) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write(`${err2}\n`);
          res.end();
          return;
        }

        let contentType = 'text/html';
        if (filename.endsWith('.js')) {
          contentType = 'application/javascript';
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(file, 'binary');
        res.end();
      });
    });
  })
  .listen(3003);
