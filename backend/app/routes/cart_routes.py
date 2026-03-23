from flask import request,jsonify,Blueprint
from app.db import get_db_connection

cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")

@cart_bp.route("",methods=["GET"])
def get_cart():
    user_id=request.args.get("user_id")
    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)

    cursor.execute(
        """
        Select cart_items.id,products.name,products.price,cart_items.quantity
        from cart_items
        JOIN products ON cart_items.product_id=products.id
        JOIN carts ON cart_items.cart_id=carts.id
        where carts.user_id=%s and carts.status='ACTIVE'
        """,
        (user_id,),
    )

    items=cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(items)

@cart_bp.route("/items",methods=["POST"])
def add_to_cart():
    data=request.json

    user_id=data["user_id"]
    product_id=data["product_id"]
    quantity=data["quantity"]
    
    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT id from carts where user_id=%s and status='ACTIVE'",(user_id,)
    )

    cart=cursor.fetchone()

    if not cart:
        cursor.execute("INSERT into carts(user_id,status) VALUES(%s,'ACTIVE')",(user_id,))

        conn.commit()
        cart_id=cursor.lastrowid

    else:
        cart_id=cart["id"]
    
    cursor.execute(
        """
        INSERT INTO cart_items
        (cart_id,product_id,quantity,unit_price_snapshot)
        SELECT %s,id,%s,price FROM products WHERE id=%s
        """,
        (cart_id, quantity, product_id),
    )
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message":"Added to cart"})

@cart_bp.route("/items/<int:item_id>", methods=["PUT"])
def update_cart_item(item_id):
    data = request.json
    quantity = data.get("quantity")

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "UPDATE cart_items SET quantity=%s WHERE id=%s",
        (quantity, item_id)
    )

    db.commit()
    return {"message": "Cart updated"}

@cart_bp.route("/items/<int:item_id>", methods=["DELETE"])
def delete_cart_item(item_id):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM cart_items WHERE id=%s",
        (item_id,)
    )

    db.commit()
    return {"message": "Item removed"}

