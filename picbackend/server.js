import jsonServer from "json-server";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 3000;

// Serve JSON Server API under /api
server.use(middlewares);
server.use("/api", router);

// Serve the compiled Vite frontend from the dist folder
const distPath = path.join(__dirname, "dist");
server.use(express.static(distPath));

// Handle SPA routing for React Router
server.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});