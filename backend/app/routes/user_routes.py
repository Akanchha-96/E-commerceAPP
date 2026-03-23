from flask import Blueprint, jsonify
from app.db import get_db_connection

user_bp = Blueprint("users", __name__, url_prefix="/api/users")

@user_bp.route("", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name, email FROM users where role !='Admin'")
    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(users)