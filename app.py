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
@app.route("/api/attractions")
def attractions():
	page = request.args.get("page",0)
	page = int(page)
	keyword = request.args.get("keyword","")

	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		
	# 首先處理page的問題
		sql_count = "select count(id) from travel"
		cursor.execute(sql_count)
		lastPage = cursor.fetchone()[0] // 12   #58 // 12 = 4
		print(lastPage)

		sql_attractions = "select * from travel limit 12 offset %s"
		val_attractions = (page*12,)
		cursor.execute(sql_attractions, val_attractions)
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
			"next page": page + 1,
			"data":attractionList
		}
		return jsonify(data)
	
	except:
		print("Unexpected Error")
	finally:
		cursor.close()
		connection_object.close()


if __name__ == "__main__":
	app.run(port=3000,debug=True)