from flask import Flask, jsonify
from flask_cors import CORS
from database import db
from auth import auth
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ── Config ───────────────────────────────────
# Uses DATABASE_URL from environment (Render sets this automatically)
# Falls back to SQLite for local development
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///cybersentinel.db")

# Render gives postgres:// but SQLAlchemy needs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"]        = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"]                     = os.environ.get("SECRET_KEY", "cybersentinel-dev-secret")

# ── CORS — allow both local and deployed frontend ──
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    os.environ.get("FRONTEND_URL", ""),
]
CORS(app, origins=[o for o in ALLOWED_ORIGINS if o])

# ── Extensions & Blueprints ──────────────────
db.init_app(app)
app.register_blueprint(auth)

# ── Create tables ────────────────────────────
with app.app_context():
    db.create_all()
    print("[DB] Tables created / verified.")

# ── Health check ─────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "CyberSentinel backend running ✅"})

if __name__ == "__main__":
    print("=" * 50)
    print("  CyberSentinel Backend starting...")
    print("  http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)
