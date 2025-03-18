import os
import base64
import re
from pathlib import Path

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def main():
    # Get the build directory
    dist_dir = Path('dist/static')
    
    # Read the main HTML file
    html = read_file(dist_dir / 'index.html')
    
    # Read and inline the CSS
    css_file = next(dist_dir.glob('assets/*.css'))
    css_content = read_file(css_file)
    html = html.replace(
        f'<link rel="stylesheet" crossorigin href="./assets/{css_file.name}">',
        f'<style>{css_content}</style>'
    )
    
    # Read and inline the JavaScript
    js_file = next(dist_dir.glob('assets/*.js'))
    js_content = read_file(js_file)
    html = html.replace(
        f'<script type="module" crossorigin src="./assets/{js_file.name}"></script>',
        f'<script type="module">{js_content}</script>'
    )
    
    # Remove any remaining crossorigin attributes
    html = html.replace(' crossorigin', '')
    
    # Write the self-contained file
    with open('dist/static/standalone.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("Created self-contained HTML file at dist/static/standalone.html")

if __name__ == '__main__':
    main()
