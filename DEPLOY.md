# BMU Website — cPanel Deployment Guide

## Prerequisites

Your cPanel hosting must have:
- Python 3.10+ (via "Setup Python App" or SSH)
- Node.js/npm (via "Setup Node.js App" or SSH)
- SSH access
- Git access
- At least 512MB RAM (1GB+ recommended)

---

## Quick Deploy (5 steps)

```bash
# 1. SSH into your server
ssh username@yourdomain.com

# 2. Clone the repo
cd ~
git clone https://github.com/reginald87/bmu_website.git
cd bmu_website

# 3. Make deploy script executable and run it
chmod +x deploy.sh
./deploy.sh

# 4. Edit environment variables
nano bmu-backend/.env

# 5. Create admin user
cd bmu-backend
source venv/bin/activate
python manage.py createsuperuser
```

---

## Step-by-Step Deploy

### Step 1: Clone the Repository

```bash
cd ~
git clone https://github.com/reginald87/bmu_website.git
cd bmu_website
```

### Step 2: Setup Python Environment

```bash
cd bmu-backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install channels-redis daphne
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

**Required values to change:**

| Variable | What to set |
|----------|------------|
| `SECRET_KEY` | Random 50+ character string |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `yourdomain.com,www.yourdomain.com` |
| `DB_ENGINE` | `django.db.backends.sqlite3` (or `postgresql`) |
| `REDIS_URL` | `redis://localhost:6379/0` (if Redis available) |
| `CORS_ALLOWED_ORIGINS` | `https://yourdomain.com` |

**Generate a secret key:**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 4: Run Migrations

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Step 5: Build Frontend

```bash
cd ../bmu-frontend
npm ci
npm run build
```

### Step 6: Configure Web Server

**Option A: cPanel Python App (Passenger)**

1. Go to cPanel → "Setup Python App" or "Python Selector"
2. Create new Python app:
   - Python version: 3.11 or 3.12
   - App directory: `/home/username/bmu_website/bmu-backend`
   - App startup file: `passenger_wsgi.py`
   - Application URL: `/api`
3. Set environment variables in the Python app settings

**Option B: Nginx (if available)**

1. Edit the Nginx config:
   ```bash
   nano deploy/nginx.conf
   ```
   Replace `yourdomain.com` and `username` with your values.

2. Copy to Nginx conf directory:
   ```bash
   cp deploy/nginx.conf /etc/nginx/conf.d/bmu.conf
   nginx -t && systemctl reload nginx
   ```

### Step 7: Start WebSocket Server (for chat)

**Option A: Supervisor (recommended)**

```bash
# Install supervisor if not present
pip install supervisor

# Copy config
cp deploy/bmu_ws.conf /etc/supervisor/conf.d/
# Edit the config with your paths
nano /etc/supervisor/conf.d/bmu_ws.conf

# Start
supervisorctl reread
supervisorctl update
supervisorctl start bmu_ws
```

**Option B: Screen/tmux (quick & simple)**

```bash
cd bmu-backend
source venv/bin/activate
screen -dmS bmu_ws daphne -b 127.0.0.1 -p 8001 bmu_backend.asgi:application
```

**Option C: systemd user service**

```bash
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/bmu-backend.service << 'EOF'
[Unit]
Description=BMU WebSocket Server
After=network.target

[Service]
Type=simple
WorkingDirectory=%h/bmu_website/bmu-backend
ExecStart=%h/bmu_website/bmu-backend/venv/bin/daphne -b 127.0.0.1 -p 8001 bmu_backend.asgi:application
Restart=always
Environment=DJANGO_SETTINGS_MODULE=bmu_backend.settings

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable bmu-backend
systemctl --user start bmu-backend
```

### Step 8: Setup Static Files

```bash
cd bmu-backend
source venv/bin/activate
python manage.py collectstatic --noinput

# Copy frontend build to static
cp -r ../bmu-frontend/dist/* staticfiles/
```

---

## cPanel File Manager Layout

```
~/bmu_website/
├── bmu-backend/
│   ├── manage.py
│   ├── passenger_wsgi.py      ← WSGI entry point
│   ├── bmu_backend/
│   │   ├── settings.py
│   │   └── asgi.py
│   ├── chat/
│   ├── content/
│   ├── accounts/
│   ├── admissions/
│   ├── academics/
│   ├── careers/
│   ├── research/
│   ├── archive/
│   ├── library/
│   ├── portals/
│   ├── staticfiles/            ← collectstatic output
│   ├── media/                  ← user uploads
│   ├── db.sqlite3              ← database (or use PostgreSQL)
│   ├── venv/                   ← Python virtual env
│   ├── .env                    ← environment variables (SECRET!)
│   └── requirements.txt
├── bmu-frontend/
│   ├── src/
│   ├── dist/                   ← built frontend
│   └── package.json
├── deploy.sh
├── deploy/
│   ├── nginx.conf
│   └── bmu_ws.conf
├── passenger_wsgi.py
└── startup.py
```

---

## Post-Deploy Checklist

```bash
# Verify Django is working
cd bmu-backend
source venv/bin/activate
python manage.py check --deploy

# Test WebSocket
python -c "import channels; print('Channels OK:', channels.__version__)"

# Check static files
ls staticfiles/

# Verify frontend build
ls staticfiles/index.html
```

1. ✅ Visit `https://yourdomain.com/admin/` — login works
2. ✅ Visit `https://yourdomain.com` — frontend loads
3. ✅ Open chat widget — contact form appears
4. ✅ Submit name/email — greeting from BMU Support Bot
5. ✅ Ask about "admission" — bot responds with DB data
6. ✅ Open `/portals/admin/chat` — agent chat loads

---

## If WebSocket Doesn't Work on Shared Hosting

Some shared hosting blocks WebSocket. Fallback options:

1. **Use long-polling** — modify the frontend to poll `/api/chat/` every 2 seconds instead of WebSocket
2. **Use a VPS** — deploy on a VPS (DigitalOcean, AWS, etc.) for full WebSocket support
3. **Use a managed service** — Pusher, Ably, or Socket.io cloud for WebSocket

---

## Updating After Git Push

```bash
cd ~/bmu_website
git pull origin main

# Rebuild frontend
cd bmu-frontend && npm ci && npm run build
cp -r dist/* ../bmu-backend/staticfiles/

# Run migrations (if any new ones)
cd ../bmu-backend
source venv/bin/activate
python manage.py migrate

# Restart services
supervisorctl restart bmu_ws  # or: screen -S bmu_ws -X quit && screen -dmS bmu_ws daphne ...
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 502 Bad Gateway | Check Daphne is running: `ps aux \| grep daphne` |
| Static files 404 | Run `python manage.py collectstatic` |
| WebSocket 404 | Check Nginx `/ws/` proxy block points to Daphne port |
| Database error | Run `python manage.py migrate` |
| Chat not responding | Check Redis is running: `redis-cli ping` |
| Permission denied | `chmod -R 755 staticfiles/ media/` |
