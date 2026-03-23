from flask import request,jsonify,Blueprint
from app.db import get_db_connection

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

@order_bp.route("", methods=["POST"])
def create_order():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    
    cursor.execute(
        "SELECT id FROM carts WHERE user_id=%s AND status='ACTIVE'",
        (user_id,)
    )
    cart = cursor.fetchone()

    
    if not cart:
        cursor.close()
        conn.close()
        return jsonify({"error": "No active cart found"}), 400

    cart_id = cart["id"]

    
    cursor.execute(
        """
        SELECT products.id, products.name, products.price, cart_items.quantity
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.cart_id = %s
        """,
        (cart_id,)
    )
    items = cursor.fetchall()

    
    if not items:
        cursor.close()
        conn.close()
        return jsonify({"error": "Cart is empty"}), 400

    
    total = sum(item["price"] * item["quantity"] for item in items)

    
    cursor.execute("""
        INSERT INTO orders (
            user_id, total_amount, status,
            shipping_name, shipping_phone,
            shipping_address_line1,
            shipping_address_line2,
            shipping_city, shipping_state, shipping_pincode
        )
        VALUES (%s,%s,'CONFIRMED',%s,%s,%s,%s,%s,%s,%s)
    """, (
        user_id,
        total,
        data.get("name"),
        data.get("phone"),
        data.get("address1"),
        data.get("address2"),
        data.get("city"),
        data.get("state"),
        data.get("pincode"),
    ))

    order_id = cursor.lastrowid

    
    for item in items:
        cursor.execute(
            """
            INSERT INTO order_items
            (order_id, product_id, product_name_snapshot, unit_price_snapshot, quantity)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                order_id,
                item["id"],
                item["name"],
                item["price"],
                item["quantity"],
            ),
        )

    
    cursor.execute(
        "UPDATE carts SET status='ORDERED' WHERE id=%s",
        (cart_id,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order_id
    })

@order_bp.route("", methods=["GET"])
def get_orders():

    user_id = request.args.get("user_id")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if user_id:
        cursor.execute(
            "SELECT * FROM orders WHERE user_id=%s ORDER BY id DESC",
            (user_id,),
        )
    else:
        cursor.execute(
            "SELECT * FROM orders ORDER BY id DESC"
        )

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(orders)

@order_bp.route("/<int:order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    data = request.get_json()
    status = data.get("status")

    if status not in ["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED"]:
        return jsonify({"error": "Invalid status"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE orders SET status=%s WHERE id=%s",
        (status, order_id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Status updated"})
 