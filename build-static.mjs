import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    // Get correct paths
    const workingDir = process.cwd();
    const distDir = path.join(workingDir, 'dist/public');
    console.log(`Working directory: ${workingDir}`);
    console.log(`Build directory: ${distDir}`);

    // First check if the build directory exists
    try {
      await fs.access(distDir);
    } catch (err) {
      console.error(`Build directory ${distDir} does not exist`);
      process.exit(1);
    }

    // List directory to verify contents
    const files = await fs.readdir(distDir);
    console.log('Files in build directory:', files);

    // Read index.html
    console.log('\nReading index.html...');
    const indexPath = path.join(distDir, 'index.html');
    const html = await fs.readFile(indexPath, 'utf-8');
    console.log('Read index.html successfully');

    // Find and log all asset references
    const cssLinks = html.match(/<link[^>]*href="[^"]*\.css"[^>]*>/g) || [];
    const jsScripts = html.match(/<script[^>]*src="[^"]*\.js"[^>]*>/g) || [];
    console.log('\nFound asset references:');
    console.log('CSS:', cssLinks);
    console.log('JS:', jsScripts);

    // Create a working copy of the HTML
    let newHtml = html;

    // Process CSS files
    for (const linkTag of cssLinks) {
      try {
        // Extract href, handling both relative and absolute paths
        const href = linkTag.match(/href="([^"]*)"/)[1];
        const cssPath = path.join(distDir, href.replace(/^[./]+/, ''));
        console.log(`\nProcessing CSS file: ${cssPath}`);

        // Read and verify CSS content
        const cssContent = await fs.readFile(cssPath, 'utf-8');
        console.log(`Read ${cssContent.length} bytes of CSS`);

        // Create and insert style tag
        const styleTag = `<style type="text/css">\n${cssContent}\n</style>`;
        newHtml = newHtml.replace(linkTag, styleTag);
        console.log('Replaced CSS link with inline style');
      } catch (err) {
        console.error('Error processing CSS:', err);
        process.exit(1);
      }
    }

    // Process JavaScript files
    for (const scriptTag of jsScripts) {
      try {
        // Extract src, handling both relative and absolute paths
        const src = scriptTag.match(/src="([^"]*)"/)[1];
        const jsPath = path.join(distDir, src.replace(/^[./]+/, ''));
        console.log(`\nProcessing JavaScript file: ${jsPath}`);

        // Read and verify JS content
        const jsContent = await fs.readFile(jsPath, 'utf-8');
        console.log(`Read ${jsContent.length} bytes of JavaScript`);

        // Preserve the type attribute if it exists
        const typeMatch = scriptTag.match(/type="([^"]*)"/);
        const type = typeMatch ? typeMatch[1] : 'module';

        // Create and insert script tag
        const newScriptTag = `<script type="${type}">\n${jsContent}\n</script>`;
        newHtml = newHtml.replace(scriptTag, newScriptTag);
        console.log('Replaced script tag with inline content');
      } catch (err) {
        console.error('Error processing JavaScript:', err);
        process.exit(1);
      }
    }

    // Remove any remaining crossorigin attributes
    newHtml = newHtml.replace(/ crossorigin/g, '');

    // Write the final standalone file
    const outputPath = path.join(distDir, 'standalone.html');
    await fs.writeFile(outputPath, newHtml, 'utf-8');

    // Verify the output file
    const finalStats = await fs.stat(outputPath);
    console.log(`\nCreated standalone.html (${finalStats.size} bytes)`);

    // Basic validation
    if (newHtml.includes('href="./assets/') || newHtml.includes('src="./assets/')) {
      throw new Error('Found unprocessed asset references in output');
    }

    console.log('Successfully created self-contained HTML file');
    console.log('You can now open standalone.html directly in your browser');

  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

main();