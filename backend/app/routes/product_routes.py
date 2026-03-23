from flask import Blueprint,request,jsonify
from app.db import get_db_connection

product_bp = Blueprint("products", __name__, url_prefix="/api/products")

@product_bp.route("", methods=["GET"])
def get_products():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products WHERE is_active=1")

    products = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(products)

@product_bp.route("/<int:id>", methods=["GET"])
def get_products_by_id(id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products WHERE id=%s",(id,))

    product = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(product)

#Admin Create products

@product_bp.route("/admin/products/create", methods=["POST"])
def create_products():
    data=request.json
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query="""
    INSERT into products(name,description,price,stock_quantity,image_url)
    VALUES(%s,%s,%s,%s,%s)
    """

    cursor.execute(
        query,
        (
            data["name"],
            data["description"],
            data["price"],
            data["stock_quantity"],
            data["image_url"],
        ),
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message":"Products created"})


@product_bp.route("/admin/products/edit/<int:id>", methods=["PUT"])
def edit_products(id):
    data=request.json
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query="""
    Update products set name=%s,price=%s,stock_quantity=%s where id=%s
    """

    cursor.execute(
        query,
        (
            data["name"],
            data["price"],
            data["stock_quantity"],
            id
        ),
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message":"Products updated"})

# @product_bp.route("/<int:id>", methods=["DELETE"])
# def delete_product(id):
#     conn = get_db_connection()
#     cursor = conn.cursor()

#     cursor.execute("DELETE FROM products WHERE id=%s", (id,))
#     conn.commit()

#     cursor.close()
#     conn.close()

#     return {"message": "Deleted"}