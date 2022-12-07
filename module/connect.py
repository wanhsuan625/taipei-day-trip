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