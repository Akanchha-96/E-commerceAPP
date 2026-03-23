from flask import Flask
from flask_cors import CORS

from app.routes.auth_routes import auth_bp
from app.routes.product_routes import product_bp
from app.routes.cart_routes import cart_bp
from app.routes.order_routes import order_bp
from app.routes.user_routes import user_bp
from app.models.tables import create_tables

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(order_bp)
app.register_blueprint(user_bp)

create_tables()

if __name__ == "__main__":
    app.run(debug=True)