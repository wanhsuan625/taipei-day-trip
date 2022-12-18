from flask import *
import jwt
from module import connect


booking = Blueprint("booking" ,__name__)
jwt_key = "secret"


# --- DATABASE CONNECT --------------------------------------------------
connection_pool = connect.db_connection()

connection_object = connection_pool.get_connection()
cursor = connection_object.cursor(dictionary=True)
sqlbooking_table = "CREATE TABLE IF NOT EXISTS `booking`( \
                    `id` BIGINT primary key not null auto_increment,\
                    `userId` BIGINT not null,\
                    `attractionId` BIGINT not null,\
                    `date` VARCHAR(255) not null,\
                    `time` VARCHAR(255) not null,\
                    `price` VARCHAR(255) not null,\
                     FOREIGN KEY(userId) REFERENCES users(id)\
                    );"
cursor.execute(sqlbooking_table)
cursor.close()
connection_object.close()


# --- OUT OF SERVICE ----------------------------------------------------
@booking.route("/booking")
def isLogin():
    cookie = request.cookies
    if not cookie :
        return redirect("/")
    return render_template("booking.html")
    
# --- API OF BOOKING ------------------------------------------------------
# --- GET -----------------------------------------------------------------
@booking.route("/api/booking", methods = ["GET"])
def bookinGet():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)

        # 會員
        token = request.cookies.get("token")
        decode = jwt.decode(token, jwt_key, algorithms="HS256")
        userId = decode["id"]
        
        # 取得行程資訊
        sql_book_info = "SELECT * FROM booking WHERE userId = %s;"
        val_book_info = (userId,)
        cursor.execute(sql_book_info, val_book_info)
        result_book_info = cursor.fetchone()
        print(result_book_info)

        if result_book_info:
            attractionId = result_book_info["attractionId"]

            # 取得景點資訊
            sql_attraction_info = "SELECT name, address, images \
                                FROM travel WHERE id = %s"
            val_attraction_info = (attractionId,)
            cursor.execute(sql_attraction_info, val_attraction_info)
            result_attraction_info = cursor.fetchone()
            print(result_attraction_info)


            data = {
                "data": {
                    "attraction": {
                        "id": attractionId,
                        "name": result_attraction_info["name"],
                        "address": result_attraction_info["address"],
                        "image": json.loads(result_attraction_info["images"])[0]
                    },
                    "date": result_book_info["date"],
                    "time": result_book_info["time"],
                    "price": result_book_info["price"]
                }
            }
            return jsonify(data)
        
        return jsonify({"data": None})

    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
            "message": "未登入系統，拒絕存取"
        }), 403

    finally:
        cursor.close()
        connection_object.close()


# --- POST ----------------------------------------------------------------
@booking.route("/api/booking", methods=["POST"])
def bookingPost():
    getData = request.get_json()
    attractionId = getData["attractionId"]
    date = getData["date"]
    time = getData["time"]
    price = getData["price"]

    if date == "":
        return jsonify({
            "error": True,
            "message": "請選擇行程日期"
        }), 400
   
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)

        # 會員
        token = request.cookies.get("token")

        if token:
            decode = jwt.decode(token, jwt_key, algorithms="HS256")
            userId = decode["id"]

            # 確認是否已預訂過行程
            sql_check = "SELECT * FROM booking WHERE userId = %s;"
            val_check = (userId,)
            cursor.execute(sql_check, val_check)
            result_check = cursor.fetchall()
            print(result_check)

            if result_check:
                sql_delete = "DELETE FROM booking WHERE userId = %s;"
                val_delete = (userId,)
                cursor.execute(sql_delete, val_delete)
                connection_object.commit()

            sql_booking = "INSERT INTO \
                           booking(userId, attractionId, date, time, price) \
                           VALUES(%s, %s, %s, %s, %s);"
            val_booking = (userId, attractionId, date, time, price)
            cursor.execute(sql_booking, val_booking)
            connection_object.commit()

            return jsonify({"ok": True})
        
        else:
            return jsonify({
                    "error": True,
                    "message": "未登入系統，無法預約行程"
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


# --- DELETE ----------------------------------------------------------------
@booking.route("/api/booking", methods=["DELETE"])
def bookingDelete():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)

        # 會員
        token = request.cookies.get("token")
        decode = jwt.decode(token, jwt_key, algorithms="HS256")
        userId = decode["id"]

        sql_delete = "DELETE FROM booking WHERE userId = %s;"
        val_delete = (userId,)
        cursor.execute(sql_delete, val_delete)
        connection_object.commit()

        return jsonify({"ok": True})

    except Exception as e:
        print(e)
        return jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
                })

    finally:
        cursor.close()
        connection_object.close()