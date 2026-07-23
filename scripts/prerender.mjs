import { preview } from "vite";
import puppeteer from "puppeteer";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const routes = [
  { path: "/", out: "index.html" },
  { path: "/register", out: "register/index.html" },
  { path: "/sponsor", out: "sponsor/index.html" },
  { path: "/__prerender_404__", out: "404.html" },
];

const server = await preview({ preview: { port: 4173, strictPort: true } });
const url = server.resolvedUrls.local[0];

const browser = await puppeteer.launch();

for (const route of routes) {
  const page = await browser.newPage();
  await page.goto(new URL(route.path, url).toString(), { waitUntil: "networkidle0" });
  await page.waitForFunction(() => document.getElementById("root")?.childElementCount > 0);
  const html = await page.content();

  const outPath = path.join("dist", route.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  await page.close();
  console.log(`prerendered ${route.path} -> dist/${route.out}`);
}

await browser.close();
await new Promise((resolve, reject) =>
  server.httpServer.close((err) => (err ? reject(err) : resolve()))
);
