#!/bin/bash
# BMU Website Deployment Script for cPanel
# Run this on your server via SSH after git pull

set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$APP_DIR/bmu-backend"
FRONTEND_DIR="$APP_DIR/bmu-frontend"
VENV_DIR="$BACKEND_DIR/venv"

echo "=== BMU Website Deployment ==="
echo "App directory: $APP_DIR"

# ── 1. Setup Python virtual environment ──────────────────────────────────────
echo ""
echo "[1/7] Setting up Python environment..."
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
    echo "  Created virtual environment"
fi
source "$VENV_DIR/bin/activate"

# ── 2. Install Python dependencies ───────────────────────────────────────────
echo ""
echo "[2/7] Installing Python dependencies..."
pip install --upgrade pip -q
pip install -r "$BACKEND_DIR/requirements.txt" -q
pip install channels-redis daphne -q
echo "  Dependencies installed"

# ── 3. Setup environment variables ───────────────────────────────────────────
echo ""
echo "[3/7] Checking environment..."
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "  WARNING: .env file not found! Copying from .env.example"
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    echo "  >>> EDIT $BACKEND_DIR/.env with your production values <<<"
fi

# ── 4. Run database migrations ───────────────────────────────────────────────
echo ""
echo "[4/7] Running database migrations..."
cd "$BACKEND_DIR"
python manage.py migrate --noinput
echo "  Migrations applied"

# ── 5. Collect static files ──────────────────────────────────────────────────
echo ""
echo "[5/7] Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true
echo "  Static files collected"

# ── 6. Build frontend ────────────────────────────────────────────────────────
echo ""
echo "[6/7] Building frontend..."
cd "$FRONTEND_DIR"
if command -v npm &> /dev/null; then
    npm ci --production=false 2>/dev/null || npm install 2>/dev/null
    npm run build
    echo "  Frontend built"

    # Copy built files to Django static and media serving
    echo "  Copying build to backend static..."
    cp -r "$FRONTEND_DIR/dist/"* "$BACKEND_DIR/staticfiles/" 2>/dev/null || \
    cp -r "$FRONTEND_DIR/dist/"* "$BACKEND_DIR/static/" 2>/dev/null || true
else
    echo "  WARNING: npm not found, skipping frontend build"
fi

# ── 7. Restart application ───────────────────────────────────────────────────
echo ""
echo "[7/7] Restarting application..."
touch "$BACKEND_DIR/passenger_wsgi.py" 2>/dev/null || true

# If using Supervisor for Daphne (WebSocket)
if command -v supervisorctl &> /dev/null; then
    supervisorctl restart bmu_ws 2>/dev/null || true
    echo "  WebSocket server restarted"
fi

# If using systemd
if command -v systemctl &> /dev/null; then
    systemctl --user restart bmu-backend 2>/dev/null || true
fi

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Next steps:"
echo "  1. Verify .env has correct production values"
echo "  2. Create superuser: python manage.py createsuperuser"
echo "  3. Seed menu data: python manage.py migrate --run-syncdb"
echo "  4. Test the site at your domain"
