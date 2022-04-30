from flask import Flask, request
from flask_cors import CORS

import paho.mqtt.client as mqtt
import datetime
import json
import psycopg2

# Declaring FLASK
app = Flask(__name__)      

# Prevents CORS errors in console (localhost)
CORS(app)                  

# Establishing connection with the database and creating a cursor
conn = psycopg2.connect(dbname="", user="", password="", host="localhost")
cur = conn.cursor()

def on_connect_database(client, userdata, flags, rc):
    client.subscribe("/PANGO_AI/#")
    client.subscribe("/SMARTPANGO/LASTING/#")

def on_message_database(client, userdata, msg):
    databaseInsertion(msg)

topic = '/PANGO_AI'
sendData = ""
def on_connect_client(client, userdata, flags, rc):
    client.subscribe(topic + "/#")

def on_message_client(client, userdata, msg):
    getMqttData(msg)

def databaseInsertion(msg):
    data = json.loads(msg.payload.decode('utf-8'))
    data['TOPIC'] = msg.topic

    if(msg.topic == "/PANGO_AI/JETSON01/LASTING/EVENT"):
        date = datetime.datetime.fromtimestamp(data['tray_timestamp']).strftime("%Y-%m-%d")
        tray_time = datetime.datetime.fromtimestamp(data['tray_timestamp']).strftime("%H:%M:%S")
        toptray_time = datetime.datetime.fromtimestamp(data['top_timestamp']).strftime("%H:%M:%S")
        bottomtray_time = datetime.datetime.fromtimestamp(data['bottom_timestamp']).strftime("%H:%M:%S")

        query = "insert into lasting (station, date, tray_timestamp, top_tray, top_timestamp, bottom_tray, bottom_timestamp) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        val = [(str(data['station']), date, tray_time, str(data['top_tray']), toptray_time, str(data['bottom_tray']), bottomtray_time)]
        cur.executemany(query, val)

    elif(msg.topic == "/PANGO_AI/JETSON01/PU2001/EVENT"):
        date = datetime.datetime.fromtimestamp(data['good_timestamp']).strftime("%Y-%m-%d")
        good_time = datetime.datetime.fromtimestamp(data['good_timestamp']).strftime("%H:%M:%S")
        defected_time = datetime.datetime.fromtimestamp(data['defected_timestamp']).strftime("%H:%M:%S")

        query = "insert into pu2001 (station, date, good_shoes, good_timestamp, defected_shoes, defected_timestamp) VALUES (%s, %s, %s, %s, %s, %s)"
        val = [(str(data['station']), date, str(data['good_shoes']), good_time, str(data['defected_shoes']), defected_time)]
        cur.executemany(query, val)

    elif(msg.topic == "/PANGO_AI/JETSON01/PU2003/EVENT"):
        date = datetime.datetime.fromtimestamp(data['P_timestamp']).strftime("%Y-%m-%d")
        pass_time = datetime.datetime.fromtimestamp(data['P_timestamp']).strftime("%H:%M:%S")
        notpass_time = datetime.datetime.fromtimestamp(data['N_timestamp']).strftime("%H:%M:%S")

        query = "insert into pu2003 (station, date, good_shoes, good_timestamp, defected_shoes, defected_timestamp) VALUES (%s, %s, %s, %s, %s, %s)"
        val = [(str(data['station']), date, str(data['PassQC']), pass_time, str(data['NotPassQC']), notpass_time)]
        cur.executemany(query, val)

    elif(msg.topic == "/SMARTPANGO/LASTING/COLDOVEN/DATA"):
        date = datetime.datetime.fromtimestamp(data['GTS']).strftime("%Y-%m-%d")
        time = datetime.datetime.fromtimestamp(data['GTS']).strftime("%H:%M:%S")
        
        query = "insert into coldoven (date, timestamp, pt100, sig, tmcu) VALUES (%s, %s, %s, %s, %s)"
        val = [(date, time, str(data['PT100']), str(data['SIG']), str(data['TMCU']))]
        cur.executemany(query, val)

    elif(msg.topic == "/SMARTPANGO/LASTING/HOTOVEN/DATA"):
        date = datetime.datetime.fromtimestamp(data['GTS']).strftime("%Y-%m-%d") 
        time = datetime.datetime.fromtimestamp(data['GTS']).strftime("%H:%M:%S")
        
        query = "insert into hotoven (date, timestamp, pt100, sig, tmcu) VALUES (%s, %s, %s, %s, %s)"
        val = [(date, time, str(data['PT100']), str(data['SIG']), str(data['TMCU']))]
        cur.executemany(query, val)

    conn.commit()

def getMqttData(msg):
    global sendData
    data = json.loads(msg.payload.decode('utf-8'))
    data['TOPIC'] = msg.topic

    if(not "STATUS" in msg.topic):

        #translate 'status_timestamp', 'tray_timestamp', 'top_timestamp', 'bottom_timestamp', 'P_Timestamp', 'N_Timestamp', 'GTS' to datetime
        if(msg.topic == "/PANGO_AI/JETSON01/LASTING/EVENT"):
            data['tray_timestamp'] = datetime.datetime.fromtimestamp(data['tray_timestamp']).strftime("%Y-%m-%d %H:%M:%S")
            data['top_timestamp'] = datetime.datetime.fromtimestamp(data['top_timestamp']).strftime("%Y-%m-%d %H:%M:%S")
            data['bottom_timestamp'] = datetime.datetime.fromtimestamp(data['bottom_timestamp']).strftime("%Y-%m-%d %H:%M:%S")
        
        elif(msg.topic == "/PANGO_AI/JETSON01/PU2001/EVENT" or msg.topic == "/PANGO_AI/JETSON01/PU2003/EVENT"):
            data['good_timestamp'] = datetime.datetime.fromtimestamp(data['good_timestamp']).strftime("%Y-%m-%d %H:%M:%S")
            data['defected_timestamp'] = datetime.datetime.fromtimestamp(data['defected_timestamp']).strftime("%Y-%m-%d %H:%M:%S")

        else:
            data['GTS'] = datetime.datetime.fromtimestamp(data['GTS']).strftime("%Y-%m-%d %H:%M:%S")

        sendData = data
    
    return sendData

# For querying from the database
def query_db(query, one=False):
    cur.execute(query)
    r = [dict((cur.description[i][0], str(value)) \
            for i, value in enumerate(row)) for row in cur.fetchall()]
    return (r[0] if r else None) if one else r

@app.route('/')
def helloworld():
    return "Hello World"

# Connecting to the database and querying its data
@app.route('/connect/<station>/<date>')
def connect(station, date):
    if station == "PU2001":
        data = query_db("select date, good_shoes, good_timestamp, defected_shoes, defected_timestamp from %s where date = '%s'" % ("pu2001", date))
    
    elif station == "PU2003":
        data = query_db("select date, good_shoes, good_timestamp, defected_shoes, defected_timestamp from %s where date = '%s'" % ("pu2003", date))
    
    elif station == "Lasting Out":
        data = query_db("select date, top_tray, top_timestamp, bottom_tray, bottom_timestamp from %s where station = '%s' and date = '%s'" % ("lasting", "lasting_conveyor", date))

    elif station == "Lasting In":
        data = query_db("select date, top_tray, top_timestamp, bottom_tray, bottom_timestamp from %s where station = '%s' and date = '%s'" % ("lasting", "lasting_in", date))

    elif station == "Cold Oven":
        data = query_db("select date, timestamp, pt100 from %s where date = '%s'" % ("coldoven", date))

    elif station == "Hot Oven":
        data = query_db("select date, timestamp, pt100 from %s where date = '%s'" % ("hotoven", date))

    return json.dumps(data)

# For the monthly statistics chart
@app.route('/connect/<station>/<fdate>&<ldate>')
def getMonthlyData(station, fdate, ldate):
    if station == "PU2001":
        data = query_db("select date, max(good_shoes) as good_shoes, max(good_timestamp) as good_timestamp, max(defected_shoes) as defected_shoes, max(defected_timestamp) as defected_timestamp from %s where date between '%s' and '%s' group by date order by date" % ("pu2001", fdate, ldate))
    
    elif station == "PU2003":
        data = query_db("select date, max(good_shoes) as good_shoes, max(good_timestamp) as good_timestamp, max(defected_shoes) as defected_shoes, max(defected_timestamp) as defected_timestamp from %s where date between '%s' and '%s' group by date order by date" % ("pu2003", fdate, ldate))
    
    elif station == "Lasting Out":
        data = query_db("select date, max(top_tray) as top_tray, max(top_timestamp) as top_timestamp, max(bottom_tray) as bottom_tray, max(bottom_timestamp) as bottom_timestamp from %s where station = '%s' and date between '%s' and '%s' group by date order by date" % ("lasting", "lasting_conveyor", fdate, ldate))

    elif station == "Lasting In":
        data = query_db("select date, max(top_tray) as top_tray, max(top_timestamp) as top_timestamp, max(bottom_tray) as bottom_tray, max(bottom_timestamp) as bottom_timestamp from %s where station = '%s' and date between '%s' and '%s' group by date order by date" % ("lasting", "lasting_in", fdate, ldate))

    return json.dumps(data)

@app.route('/getAnalyticsStation')
def getAnalyticsStations():
    stations = query_db("select * from analyticsstations order by id;")
    return json.dumps(stations)

@app.route('/getProjectStation')
def getProjectStations():
    stations = query_db("select * from projectstations order by id;")
    return json.dumps(stations)

@app.route('/addAnalyticsStation', methods=['POST'])
def addAnalyticsStations():
    input = request.data
    input = input.decode('UTF-8')
    station_input = str(input)

    query = "insert into analyticsstations (name) values (%s);"
    cur.execute(query, (station_input,))
    conn.commit()
    return json.dumps(input)

@app.route('/addProjectStation', methods=['POST'])
def addProjectStations():
    input = request.data
    input = input.decode('UTF-8')
    station_input = str(input)

    query = "insert into projectstations (name) values (%s);"
    cur.execute(query, (station_input,))
    conn.commit()
    return json.dumps(input)

@app.route('/connectTopic', methods=['POST'])
def setTopic():
    global topic
    selectedTopic = request.data
    selectedTopic = selectedTopic.decode('UTF-8')

    if(selectedTopic == "PU2001"):
        topic = "/PANGO_AI/JETSON01/PU2001"
    elif(selectedTopic == "PU2003"):
        topic = "/PANGO_AI/JETSON01/PU2003"
    elif(selectedTopic == "Lasting In"):
        topic = "/PANGO_AI/JETSON01/LASTING"
    elif(selectedTopic == "Lasting Out"):
        topic = "/PANGO_AI/JETSON01/LASTING"
    elif(selectedTopic == "Cold Oven"):
        topic = "/SMARTPANGO/LASTING/COLDOVEN"
    elif(selectedTopic == "Hot Oven"):
        topic = "/SMARTPANGO/LASTING/HOTOVEN"
    elif(selectedTopic == "drivemotor_imu"):
        topic = "/SMARTPANGO/PU2001/DRIVE_MOTOR/IMU"
    elif(selectedTopic == "drivemotor_temp"):
        topic = "/SMARTPANGO/PU2001/DRIVE_MOTOR/TEMPERATURE"

    # Reconnecting with a new topic
    client.loop_stop()
    client.on_connect = on_connect_client
    client.on_message = on_message_client
    client.connect('dx.smartsensedesign.net', 8883)
    client.loop_start()

    return json.dumps(topic)

@app.route('/getLiveData', methods=['GET'])
def getLiveData():
    return json.dumps(sendData)
    
if __name__ == '__main__':
    # Mqtt Connection (Database)
    database = mqtt.Client("one")
    database.tls_set()
    database.username_pw_set(username="",password="")

    database.on_connect = on_connect_database
    database.on_message = on_message_database
    database.connect('dx.smartsensedesign.net', 8883)
    database.loop_start()

    # Mqtt Connection (Live Data)
    client = mqtt.Client("two")
    client.tls_set()
    client.username_pw_set(username="",password="")

    client.on_connect = on_connect_client
    client.on_message = on_message_client
    client.connect('dx.smartsensedesign.net', 8883)
    client.loop_start()

    # Starting FLASK API
    app.run(host='127.0.0.1', port=5000)