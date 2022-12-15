from flask import *
import jwt
from module import connect


booking = Blueprint("booking" ,__name__)
jwt_key = "secret"

# --- DATABASE CONNECT ------------------------------------
connection_pool = connect.db_connection()

# connection_object = connection_pool.get_connection()
# cursor = connection_object.cursor(dictionary=True)
# sqlbooking = "CREATE TABLE IF NOT EXISTS `users`( \
#               `id` BIGINT primary key not null auto_increment,\
#               `userId` BIGINT not null,\
#               `attractId` BIGINT not null,\
#               `date` VARCHAR(255) not null,\
#               `time` VARCHAR(255) not null,\
#               `price` VARCHAR(255) not null\
#               );"
# cursor.execute(sqlTable)
# cursor.close()
# connection_pool.close()


# --- API OF BOOKING --------------------------------------
# @booking.route("/api/booking", methods = ["GET"])
# def bookinGet():

@booking.route("/api/booking", methods=["POST"])
def bookingPost():
    getData = request.get_json()
    attractionId = getData["attractionId"]
    date = getData["date"]
    time = getData["time"]
    price = getData["price"]

    if attractionId == "" or date == "" or time == "" or price == "":
        return jsonify({
            "error": True,
            "message": "建立失敗，未選擇日期"
        }), 403
        
    # 會員
    token = request.cookies.get("token")
    decode = jwt.decode(token, jwt_key, algorithms="HS256")
    userId = decode["id"]
    
    data = { "attractionId" : attractionId,
             "date": date,
             "time": time,
             "price": price }
    print(userId, data)

    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)
        
        if token:
            return jsonify({"ok": True})
        
        else:
            return jsonify({
                    "error": True,
                    "message": "未登入系統，拒絕存取"
                }), 403
    
    except Exception as e:
        print(e)
        return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
            }), 500
    
    finally:
        cursor.close()
        connection_pool.close()
