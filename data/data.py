import json
import mysql.connector

dbconfig = {
    "host":"localhost",
    "user":"root",
    "password":"aa22bb33",
    "database":"taipeidaytrip"
}
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "my_pool",
    pool_size = 5,
    pool_reset_session = True,
    **dbconfig
)

with open("taipei-attractions.json","r",encoding="utf-8") as rf:
    data = json.load(rf)

for jsonObj in data["result"]["results"]:
    
    # 圖片網址篩選
    img = jsonObj["file"].split("https")
    end = "JPG", "jpg", "PNG", "png"
    imgList = []
    for i in img:
        if i.endswith(end):
            i = "https" + i
            imgList.append(i)

    # 存入資料庫中
    try:
        connection_object = connection_pool.get_connection()
        cursor =  connection_object.cursor()

        sql = "insert into travel(name, category, description, address, transport, mrt, lat, lng, images) values (%s,%s,%s,%s,%s,%s,%s,%s,%s);"
        val = (jsonObj["name"], jsonObj["CAT"], jsonObj["description"], jsonObj["address"], jsonObj["direction"], jsonObj["MRT"], jsonObj["latitude"], jsonObj["longitude"],json.dumps(imgList))
        cursor.execute(sql, val)
        connection_object.commit()
    except:
            print("Unexpected Error")
    finally:
        cursor.close()
        connection_object.close()
