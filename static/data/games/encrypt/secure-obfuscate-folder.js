import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
const inputDir = path.resolve(__dirname, './html-files');
const outputDir = path.resolve(__dirname, './dist');

// Domain check code to inject into each script block
const domainCheckInline = `
try {
  var host = window.location.hostname;
  if (!(host === 'localhost' || host.endsWith('.localhost') || host === '127.0.0.1')) {
    document.body.innerHTML = '';
  
  }
} catch (e) {
  console.error(e);
}`;

// Create output folder if not exists
await fs.mkdir(outputDir, { recursive: true });

const files = await fs.readdir(inputDir);
for (const file of files) {
  if (!file.endsWith('.html')) continue;

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);
  let html = await fs.readFile(inputPath, 'utf-8');

  // Obfuscate inline JS blocks (skip those with src)
  html = html.replace(
    /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi,
    (_, jsCode) => {
      const wrappedCode = `(function(){\n${domainCheckInline}\n${jsCode}\n})();`;
      const obfuscated = JavaScriptObfuscator.obfuscate(wrappedCode, {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        stringArrayEncoding: ['rc4'],
        simplify: true,
        renameGlobals: false
      }).getObfuscatedCode();
      return `<script>${obfuscated}</script>`;
    }
  );

  await fs.writeFile(outputPath, html, 'utf-8');
  console.log(`✅ Obfuscated with inline domain check: ${file}`);
}
