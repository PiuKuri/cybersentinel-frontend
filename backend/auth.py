from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from database import db, User, OTPRecord
from email_service import generate_otp, send_otp_email
import re

auth = Blueprint("auth", __name__)

# ── helpers ──────────────────────────────────

def is_strong_password(pw: str) -> bool:
    """Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char."""
    return (
        len(pw) >= 8
        and re.search(r"[A-Z]", pw)
        and re.search(r"[a-z]", pw)
        and re.search(r"\d",    pw)
        and re.search(r"[!@#$%^&*(),.?\":{}|<>]", pw)
    )

def is_valid_email(email: str) -> bool:
    return bool(re.match(r"^[\w\.-]+@[\w\.-]+\.\w{2,}$", email))


# ── REGISTER ─────────────────────────────────

@auth.route("/api/register", methods=["POST"])
def register():
    data     = request.get_json()
    username = data.get("username", "").strip()
    email    = data.get("email",    "").strip().lower()
    password = data.get("password", "")

    # Validate
    if not username or not email or not password:
        return jsonify({"error": "All fields are required."}), 400
    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters."}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Invalid email address."}), 400
    if not is_strong_password(password):
        return jsonify({"error": "Password must be 8+ chars with uppercase, lowercase, number and special character."}), 400

    # Check duplicates
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken."}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered."}), 409

    # Save user (unverified)
    hashed_pw = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_pw, is_verified=False)
    db.session.add(user)
    db.session.commit()

    # Generate & send OTP
    otp_code = generate_otp()
    otp_rec  = OTPRecord(email=email, otp_code=otp_code)
    db.session.add(otp_rec)
    db.session.commit()

    success = send_otp_email(email, otp_code)
    if not success:
        return jsonify({"error": "Failed to send OTP email. Check Gmail credentials in email_service.py."}), 500

    return jsonify({"message": "OTP sent to your email. Please verify to complete registration."}), 200


# ── VERIFY OTP ────────────────────────────────

@auth.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data     = request.get_json()
    email    = data.get("email", "").strip().lower()
    otp_code = data.get("otp",   "").strip()

    if not email or not otp_code:
        return jsonify({"error": "Email and OTP are required."}), 400

    # Find latest unused OTP for this email
    otp_rec = (
        OTPRecord.query
        .filter_by(email=email, is_used=False)
        .order_by(OTPRecord.created_at.desc())
        .first()
    )

    if not otp_rec:
        return jsonify({"error": "No OTP found. Please register again."}), 400

    # Check expiry (10 minutes)
    age = datetime.utcnow() - otp_rec.created_at
    if age > timedelta(minutes=10):
        return jsonify({"error": "OTP expired. Please register again."}), 400

    if otp_rec.otp_code != otp_code:
        return jsonify({"error": "Invalid OTP. Please try again."}), 400

    # Mark OTP used and verify user
    otp_rec.is_used = True
    user = User.query.filter_by(email=email).first()
    user.is_verified = True
    db.session.commit()

    return jsonify({"message": "Account verified! You can now log in."}), 200


# ── LOGIN ─────────────────────────────────────

@auth.route("/api/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email",    "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid email or password."}), 401
    if not user.is_verified:
        return jsonify({"error": "Account not verified. Please check your email for OTP."}), 403
    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password."}), 401

    return jsonify({
        "message": "Login successful!",
        "user": user.to_dict()
    }), 200


# ── RESEND OTP ────────────────────────────────

@auth.route("/api/resend-otp", methods=["POST"])
def resend_otp():
    data  = request.get_json()
    email = data.get("email", "").strip().lower()

    user = User.query.filter_by(email=email, is_verified=False).first()
    if not user:
        return jsonify({"error": "No unverified account found for this email."}), 404

    otp_code = generate_otp()
    otp_rec  = OTPRecord(email=email, otp_code=otp_code)
    db.session.add(otp_rec)
    db.session.commit()

    success = send_otp_email(email, otp_code)
    if not success:
        return jsonify({"error": "Failed to send OTP email."}), 500

    return jsonify({"message": "New OTP sent to your email."}), 200
