#!/usr/bin/env python
"""
Daphne startup script for WebSocket support.
Run this as a background process or via Supervisor/systemd.

Usage:
  python startup.py                    # Default: 0.0.0.0:8000
  python startup.py --port 8001        # Custom port
  python startup.py --workers 4        # Multiple workers
"""
import os
import sys
import argparse

APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(APP_DIR, 'bmu-backend')

# Add to path
sys.path.insert(0, BACKEND_DIR)

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bmu_backend.settings')

# Activate virtual environment
venv_path = os.path.join(BACKEND_DIR, 'venv')
activate_this = os.path.join(venv_path, 'bin', 'activate_this.py')
if os.path.exists(activate_this):
    exec(open(activate_this).read(), {'__file__': activate_this})


def main():
    parser = argparse.ArgumentParser(description='Start BMU Daphne server')
    parser.add_argument('--host', default='127.0.0.1', help='Bind host (default: 127.0.0.1)')
    parser.add_argument('--port', type=int, default=8000, help='Port (default: 8000)')
    parser.add_argument('--workers', type=int, default=1, help='Number of workers')
    args = parser.parse_args()

    import django
    django.setup()

    from daphne.server import Server
    from daphne.endpoints import build_endpoint_description_strings
    from bmu_backend.asgi import application

    endpoints = build_endpoint_description_strings(host=args.host, port=args.port)

    print(f"Starting Daphne on {args.host}:{args.port}")
    print(f"ASGI application: bmu_backend.asgi.application")

    server = Server(
        application=application,
        endpoints=endpoints,
        signal_handlers=True,
    )

    try:
        server.run()
    except KeyboardInterrupt:
        print("\nShutting down...")


if __name__ == '__main__':
    main()
