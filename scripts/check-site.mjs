import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const prefix = process.env.SITE_PATH_PREFIX || "/life/";
const errors = [];
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
async function exists(file) {
  try { return await stat(file); } catch { return null; }
}

for (const route of ["index.html", "f1/index.html", "food/index.html", "photography/index.html", "about/index.html", ".nojekyll"]) {
  if (!await exists(path.join(root, route))) errors.push(`Missing required output: ${route}`);
}

const pages = (await walk(root)).filter(file => file.endsWith(".html"));
for (const file of pages) {
  const html = await readFile(file, "utf8");
  const label = path.relative(root, file);
  if (!/<html lang="zh-CN">/.test(html)) errors.push(`${label}: missing document language`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${label}: missing title`);
  if (!html.includes('id="main"')) errors.push(`${label}: missing main anchor`);
  if (!html.includes(`https://nonduce.github.io${prefix}`)) errors.push(`${label}: incorrect canonical origin or path`);
  for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = raw.replaceAll("&amp;", "&");
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) continue;
    const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
    let target;
    if (pathname.startsWith("/")) {
      if (!pathname.startsWith(prefix)) {
        errors.push(`${label}: URL is outside deployment prefix: ${pathname}`);
        continue;
      }
      target = path.join(root, pathname.slice(prefix.length));
    } else {
      target = path.resolve(path.dirname(file), pathname);
    }
    if (!target.startsWith(root + path.sep) && target !== root) {
      errors.push(`${label}: URL escapes output directory: ${pathname}`);
      continue;
    }
    const info = await exists(target);
    if (info?.isDirectory()) target = path.join(target, "index.html");
    if (!info || !await exists(target)) errors.push(`${label}: broken local reference: ${reference}`);
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]+"/.test(tag)) errors.push(`${label}: image lacks descriptive alternative text`);
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) errors.push(`${label}: image dimensions are missing`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} HTML pages: routes, local links, assets, canonical paths and image metadata are valid (${prefix}).`);
}
