import mysql.connector

def db_connection():
    dbconfig = {
        "host" : "localhost",
        "user" : "root",
        "password" : "aa22bb33",
        "database" : "taipeidaytrip",
        "pool_name" : "my_pool",
        "pool_size" : 5,
        "pool_reset_session" : True,
    }
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        **dbconfig
    )
    return connection_pool


# import configparser

# 建立 ConfigParser、讀取ini檔
# config = configparser.ConfigParser()
# config.read("db.ini")
# db = config["db"]

# def db_connection():
#     dbconfig = {
#         "host" : db["host"],
#         "user" : db["user"],
#         "password" : db["password"],
#         "database" : db["database"],
#         "pool_name" : db["pool_name"],
#         "pool_size" : int(db["pool_size"]),
#         "pool_reset_session" : db["pool_reset_session"],
#     }
#     connection_pool = mysql.connector.pooling.MySQLConnectionPool(
#         **dbconfig
#     )
#     return connection_pool