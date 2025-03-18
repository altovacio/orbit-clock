import os
import base64
import re
import mimetypes
from pathlib import Path

def read_file(filepath):
    with open(filepath, 'rb') as f:
        return f.read()

def to_data_url(content, mimetype):
    b64 = base64.b64encode(content).decode('utf-8')
    return f"data:{mimetype};base64,{b64}"

def main():
    # Get the build directory
    dist_dir = Path('dist/static')

    # Read the main HTML file
    with open(dist_dir / 'index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find all assets in the HTML
    css_links = re.findall(r'<link[^>]*href="([^"]*\.css)"[^>]*>', html)
    js_scripts = re.findall(r'<script[^>]*src="([^"]*\.js)"[^>]*>', html)

    print("Found assets:")
    print("CSS:", css_links)
    print("JS:", js_scripts)

    # Convert CSS files to data URLs
    for css_link in css_links:
        try:
            css_path = dist_dir / css_link.lstrip('./')
            css_content = read_file(css_path)
            data_url = to_data_url(css_content, 'text/css')

            # Replace the link tag with an embedded style tag
            html = html.replace(
                f'<link rel="stylesheet" crossorigin href="{css_link}">',
                f'<style type="text/css">{css_content.decode("utf-8")}</style>'
            )
            print(f"Embedded CSS file: {css_path}")
        except Exception as e:
            print(f"Error processing CSS {css_link}: {e}")

    # Convert JS files to data URLs
    for js_src in js_scripts:
        try:
            js_path = dist_dir / js_src.lstrip('./')
            js_content = read_file(js_path)
            data_url = to_data_url(js_content, 'application/javascript')

            # Replace the script src with the data URL
            html = html.replace(
                f'src="{js_src}"',
                f'src="{data_url}"'
            )
            print(f"Embedded JS file: {js_path}")
        except Exception as e:
            print(f"Error processing JS {js_src}: {e}")

    # Remove any remaining crossorigin attributes
    html = html.replace(' crossorigin', '')

    # Write the self-contained file
    output_path = dist_dir / 'standalone.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"\nCreated self-contained HTML file at: {output_path}")
    print("You can now open this file directly in your browser!")

if __name__ == '__main__':
    main()