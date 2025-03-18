import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "dist/public"  # Updated to match Vite's output directory

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Enhanced logging
        print(f"[{self.log_date_time_string()}] {format%args}")

if __name__ == "__main__":
    # Verify directory exists
    if not os.path.exists(DIRECTORY):
        print(f"Error: Directory '{DIRECTORY}' does not exist")
        print(f"Current working directory: {os.getcwd()}")
        print("Available directories:")
        print(os.listdir("."))
        exit(1)

    # Print server info
    print(f"Serving files from: {os.path.abspath(DIRECTORY)}")
    print(f"Server running at http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()