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
	keyword = request.args.get("keyword",None)

	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		
		sql_get = "select * from travel limit 12 offset 12"
		cursor.execute(sql_get)
		result = cursor.fetchall()

		data = {
			"data":[
				{
					"id": result[0][0],
					"name": result[0][1],
					"category": result[0][2],
					"description": result[0][3],
					"address": result[0][4],
					"transport": result[0][5],
					"mrt": result[0][6],
					"lat": result[0][7],
					"lng": result[0][8],
					"images": result[0][9],
				}
			]
		}

		return jsonify(data)
	
	finally:
		cursor.close()
		connection_object.close()


if __name__ == "__main__":
	app.run(port=3000,debug=True)