import smtplib
import random
import string
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

GMAIL_ADDRESS  = os.environ.get("GMAIL_ADDRESS",  "your_gmail@gmail.com")
GMAIL_APP_PASS = os.environ.get("GMAIL_APP_PASS",  "your_app_password_here")


def generate_otp(length=6):
    return "".join(random.choices(string.digits, k=length))


def send_otp_email(to_email: str, otp_code: str) -> bool:
    subject   = "CyberSentinel – Your Verification OTP"
    html_body = f"""
    <div style="font-family:monospace;background:#050810;color:#c0d0e0;padding:40px;border-radius:8px;">
      <h2 style="color:#00e5ff;letter-spacing:0.15em;">CYBER<span style="color:#c0d0e0;">SENTINEL</span></h2>
      <p style="color:#5a6a7a;font-size:13px;letter-spacing:0.1em;">ACCOUNT VERIFICATION</p>
      <hr style="border-color:#0a1a2a;margin:20px 0;">
      <p>Your One-Time Password is:</p>
      <div style="background:#0a1a2a;border:1px solid #00e5ff33;border-top:2px solid #00e5ff;
                  padding:20px;text-align:center;margin:20px 0;border-radius:4px;">
        <span style="font-size:36px;font-weight:800;color:#00e5ff;letter-spacing:0.3em;">{otp_code}</span>
      </div>
      <p style="color:#5a6a7a;font-size:12px;">This OTP expires in <strong style="color:#ff8c00;">10 minutes</strong>.</p>
      <p style="color:#5a6a7a;font-size:12px;">If you did not request this, ignore this email.</p>
    </div>
    """
    msg            = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = GMAIL_ADDRESS
    msg["To"]      = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASS)
            server.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False
