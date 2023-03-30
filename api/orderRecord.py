from flask import *
from module import connect
import jwt
import os
from dotenv import load_dotenv
load_dotenv()

orderRecord = Blueprint("orderRecord", __name__)
jwt_key = os.getenv("jwt_key")

connection_pool = connect.db_connection()

@orderRecord.route("/api/orderRecord", methods = ["GET"])
def record():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)

        # 會員
        token = request.cookies.get("token")
        print(token)

        if token:
            decode = jwt.decode(token, jwt_key, algorithms="HS256")
            user_id = decode["id"]

            sql_record = "SELECT orders.* , travel.name , travel.address , travel.images\
                          FROM orders INNER JOIN travel\
                          ON orders.attraction_id = travel.id WHERE user_id = %s\
                          ORDER BY order_id DESC"
            val_record = (user_id,)
            cursor.execute(sql_record, val_record)
            result = cursor.fetchall()

            if result:
                for i in range( len(result) ):
                    result[i]["images"] = json.loads(result[i]["images"])[0]
                data = {
                    "data": result
                }
                return jsonify(data)
            
            else:
                return jsonify({
                        "data": None
                    }), 403

    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500

    finally:
        cursor.close()
        connection_object.close()