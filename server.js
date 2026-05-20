const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 4200;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const requestedPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = requestedPath === "/" ? "/index.html" : requestedPath;
  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(root, safePath);

  if (!fullPath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(fullPath, (error, content) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
