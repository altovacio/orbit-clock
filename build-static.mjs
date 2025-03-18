import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    // Use the correct build directory
    const distDir = path.join(process.cwd(), 'dist/public');
    console.log(`Working directory: ${process.cwd()}`);
    console.log(`Build directory: ${distDir}`);

    // Read index.html
    console.log('Reading index.html...');
    const indexPath = path.join(distDir, 'index.html');
    let html = await fs.readFile(indexPath, 'utf-8');

    // Find all CSS and JS files referenced in the HTML
    const cssFiles = (html.match(/href="[^"]*\.css"/g) || [])
      .map(match => match.match(/href="([^"]*)"/)[1]);
    const jsFiles = (html.match(/src="[^"]*\.js"/g) || [])
      .map(match => match.match(/src="([^"]*)"/)[1]);

    console.log('Found assets:', { cssFiles, jsFiles });

    // Inline CSS files
    for (const cssFile of cssFiles) {
      const cssPath = path.join(distDir, cssFile.replace(/^\.\//, ''));
      console.log(`Reading CSS: ${cssPath}`);
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Replace the link tag with an inline style tag
      html = html.replace(
        `<link rel="stylesheet" crossorigin href="${cssFile}">`,
        `<style type="text/css">${cssContent}</style>`
      );
      console.log(`Inlined CSS: ${cssPath}`);
    }

    // Inline JavaScript files
    for (const jsFile of jsFiles) {
      const jsPath = path.join(distDir, jsFile.replace(/^\.\//, ''));
      console.log(`Reading JS: ${jsPath}`);
      const jsContent = await fs.readFile(jsPath, 'utf-8');

      // Replace the script tag with an inline script tag
      html = html.replace(
        `<script type="module" crossorigin src="${jsFile}"></script>`,
        `<script type="module">${jsContent}</script>`
      );
      console.log(`Inlined JS: ${jsPath}`);
    }

    // Remove any remaining crossorigin attributes
    html = html.replace(/ crossorigin/g, '');

    // Write the self-contained file
    const outputPath = path.join(distDir, 'standalone.html');
    await fs.writeFile(outputPath, html, 'utf-8');

    const stats = await fs.stat(outputPath);
    console.log(`Created standalone.html (${stats.size} bytes)`);
    console.log('You can now open this file directly in your browser');

  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

main();