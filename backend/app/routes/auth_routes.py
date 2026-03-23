from flask import Flask,request,jsonify,Blueprint
from app.db import get_db_connection
import bcrypt
import datetime
import jwt

SECRET_KEY="secret1408"

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route('/register',methods=["POST"])
def register():
    data=request.json
    name=data["name"]
    email=data["email"]
    password=data["password"]

    hashed_password=bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    conn=get_db_connection()
    cursor=conn.cursor()

    query="""
    INSERT INTO users(name,email,password_hash,role) 
    VALUES(%s,%s,%s,%s)
    """
    cursor.execute(query, (name, email, hashed_password, "CUSTOMER"))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message":"User registered successfully"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data=request.json
    email=data["email"]
    password=data["password"]

    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)

    cursor.execute("SELECT * from users where email=%s",(email,))

    user=cursor.fetchone()

    if not user:
        return jsonify({"error":"Invalid email"}),404
    
    if not bcrypt.checkpw(password.encode(),user["password_hash"].encode()):
        return jsonify({"error":"Invalid password"}),401
    
    token=jwt.encode(
        {
        "user_id":user["id"],
        "role":user["role"],
        "exp":datetime.datetime.utcnow()+datetime.timedelta(hours=24),
        },
        SECRET_KEY,
        algorithm="HS256",
    )
    return jsonify(
        {
            "token":token,
            "user":{
                "id":user["id"],
                "name":user["name"],
                "role":user["role"],
            },
        }
    )
    


