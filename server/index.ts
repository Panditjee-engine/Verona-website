import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    // ---------- DEV MODE (Vite middleware) ----------
    const vite = await createViteServer({
      server: { middlewareMode: true },
      configFile: path.resolve(__dirname, "..", "vite.config.ts"),
    });


    app.use(vite.middlewares);

    app.get("*", async (req, res) => {
      const html = await vite.transformIndexHtml(req.originalUrl, "");
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    });

    console.log("Vite dev middleware started");
  } else {
    // ---------- PRODUCTION MODE ----------
    const staticPath = path.resolve(__dirname, "..", "dist", "public");

    app.use(express.static(staticPath));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });

    console.log("Serving production build");
  }

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch(console.error);
