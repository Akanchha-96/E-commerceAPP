import mysql.connector
from app.config import DB_CONFIG

def get_db_connection():
    db = mysql.connector.connect(**DB_CONFIG)
    return db