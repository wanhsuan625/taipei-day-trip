from flask import *
import mysql.connector

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

dbconfig = {
    "host":"localhost",
    "user":"root",
    "password":"aa22bb33",
    "database":"taipeiDayTrip"
}
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "my_pool",
    pool_size = 5,
    pool_reset_session = True,
    **dbconfig
)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


# API
# 景點資料列表
@app.route("/api/attractions")
def attractions():
	page = request.args.get("page",0)
	page = int(page)
	keyword = request.args.get("keyword","")

	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()			

		if keyword:
			# 抓頁數
			keyword_sql = "select count(id) from travel where (category = %s or name like %s)"
			keyword_val = (keyword, "%" + keyword + "%")
			cursor.execute(keyword_sql, keyword_val)
			lastPage = cursor.fetchone()[0] // 12

			# 取資料
			sql_data = "select * from travel where (category = %s or name like %s) limit 12 offset %s"
			val_data = (keyword, "%" + keyword + "%", page * 12)
			cursor.execute(sql_data, val_data)
			result_attractions = cursor.fetchall()

			attractionList = []
			for i in result_attractions:
				item = {
						"id": i[0],
						"name": i[1],
						"category": i[2],
						"description": i[3],
						"address": i[4],
						"transport": i[5],
						"mrt": i[6],
						"lat": i[7],
						"lng": i[8],
						"images": i[9]
					}
				attractionList.append(item)
			
			if (page >= lastPage):
				data = {
					"nextPage": None,
					"data":attractionList
				}
				return jsonify(data)
			
			data = {
				"nextPage": page + 1,
				"data":attractionList
			}
			return jsonify(data)
		
		sql_count = "select count(id) from travel"
		cursor.execute(sql_count)
		lastPage = cursor.fetchone()[0] // 12

		sql_data = "select * from travel limit 12 offset %s"
		val_data = (page * 12,)
		cursor.execute(sql_data, val_data)
		result_attractions = cursor.fetchall()
		
		attractionList = []
		for i in result_attractions:
			item = {
					"id": i[0],
					"name": i[1],
					"category": i[2],
					"description": i[3],
					"address": i[4],
					"transport": i[5],
					"mrt": i[6],
					"lat": i[7],
					"lng": i[8],
					"images": i[9]
				}
			attractionList.append(item)
		
		if (page >= lastPage):
			data = {
				"nextPage": None,
				"data":attractionList
			}
			return jsonify(data)
		
		data = {
			"nextPage": page + 1,
			"data":attractionList
		}
		return jsonify(data)
	
	except:
		return jsonify({
 			"error": True,
  			"message": "伺服器內部錯誤"
		}), 500

	finally:
		cursor.close()
		connection_object.close()

# 景點編號
@app.route("/api/attraction/<attractionId>")
def attractionID(attractionId):
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		
		sql_count = "select distinct id from travel"
		cursor.execute(sql_count)
		result_count = cursor.fetchall()

		sql_id = "select * from travel where id = %s"
		val_id = (attractionId,)
		cursor.execute(sql_id, val_id)
		result_id = cursor.fetchall()
		
		if (int(attractionId),) not in result_count:
			return jsonify({
				"error": True,
				"message": "景點編號不存在"
			}), 400

		item = {
				"id": result_id[0][0],
				"name": result_id[0][1],
				"category": result_id[0][2],
				"description": result_id[0][3],
				"address": result_id[0][4],
				"transport": result_id[0][5],
				"mrt": result_id[0][6],
				"lat": result_id[0][7],
				"lng": result_id[0][8],
				"images": result_id[0][9]
			}
		return jsonify(item)
	
	except:
		return jsonify({
			"error": True,
			"message": "伺服器內部錯誤"
		}), 500
	
	finally:
		cursor.close()
		connection_object.close()

# 景點分類
@app.route("/api/categories")
def categories():
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()

		sql_category = "select distinct category from travel"
		cursor.execute(sql_category)
		result_category = cursor.fetchall()
		
		categoryList = []
		for i in result_category:
			categoryList.append(i[0])
			
		data = {"data": categoryList}
		return jsonify(data)
	
	except:
		return jsonify({
			"error": True,
			"message": "伺服器內部錯誤"
		}), 500
	
	finally:
		cursor.close()
		connection_object.close()

if __name__ == "__main__":
	app.run(port=3000,debug=True)