import fs from 'fs/promises';
import path from 'path';

async function convertToDataUrl(filePath, mimeType) {
  try {
    console.log(`Reading file for data URL conversion: ${filePath}`);
    const content = await fs.readFile(filePath);
    const base64 = content.toString('base64');
    console.log(`Successfully converted ${filePath} to data URL`);
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error(`Error converting file to data URL: ${filePath}`, err);
    throw err;
  }
}

async function main() {
  try {
    // Get the build directory
    const distDir = 'dist/static';
    console.log(`Working directory: ${process.cwd()}`);
    console.log(`Looking for files in: ${distDir}`);

    // List directory contents to verify we're looking in the right place
    const files = await fs.readdir(distDir);
    console.log('Found files:', files);

    console.log('Reading index.html...');
    let html = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
    console.log('Successfully read index.html');

    // Find all external resources
    const cssFiles = html.match(/href="([^"]*\.css)"/g) || [];
    const jsFiles = html.match(/src="([^"]*\.js)"/g) || [];

    console.log('Found external resources:');
    console.log('CSS files:', cssFiles);
    console.log('JS files:', jsFiles);

    // Process CSS files
    for (const cssMatch of cssFiles) {
      const cssPath = cssMatch.match(/href="([^"]*)"/)[1];
      console.log(`Processing CSS file: ${cssPath}`);

      const fullPath = path.join(distDir, cssPath.replace(/^\.\//, ''));
      console.log(`Full CSS path: ${fullPath}`);

      const cssContent = await fs.readFile(fullPath, 'utf-8');
      console.log(`Read CSS content, length: ${cssContent.length}`);

      // Replace link tag with inline style
      html = html.replace(
        new RegExp(`<link[^>]*href="${cssPath}"[^>]*>`),
        `<style type="text/css">${cssContent}</style>`
      );
      console.log('Replaced CSS link with inline style');
    }

    // Process JS files
    for (const jsMatch of jsFiles) {
      const jsPath = jsMatch.match(/src="([^"]*)"/)[1];
      console.log(`Processing JS file: ${jsPath}`);

      const fullPath = path.join(distDir, jsPath.replace(/^\.\//, ''));
      console.log(`Full JS path: ${fullPath}`);

      const jsContent = await fs.readFile(fullPath, 'utf-8');
      console.log(`Read JS content, length: ${jsContent.length}`);

      // Replace script tag with inline script
      html = html.replace(
        new RegExp(`<script[^>]*src="${jsPath}"[^>]*>`),
        `<script type="module">${jsContent}</script>`
      );
      console.log('Replaced JS script with inline content');
    }

    // Remove any remaining crossorigin attributes
    html = html.replace(/ crossorigin/g, '');
    console.log('Removed crossorigin attributes');

    // Write the self-contained file
    const outputPath = path.join(distDir, 'standalone.html');
    await fs.writeFile(outputPath, html, 'utf-8');
    console.log(`Created self-contained HTML file at: ${outputPath}`);

    // Try to read the file back to verify it was written
    const stats = await fs.stat(outputPath);
    console.log(`Verified file exists with size: ${stats.size} bytes`);

  } catch (err) {
    console.error('Error during build process:', err);
    process.exit(1);
  }
}

main();