from flask import Flask, request
import socket

## Get my machine hostname
if socket.gethostname().find('.')>=0:
    hostname=socket.gethostname()
else:
    hostname=socket.gethostbyaddr(socket.gethostname())[0]

app = Flask(__name__)

#DEFAULT Route
# curl http://0.0.0.0:5000/
@app.route("/")
def hello():
    return "Hello API Server : Default Request from (hostname) : " + hostname + "!\n"

#GET REQUEST
# curl http://0.0.0.0:5000/getHello
@app.route('/getHello')
def getRequestHello():
    return "Hello API Server : GET Request!\n"

#POST REQUEST
# curl --data 'mykey=FOOBAR' http://0.0.0.0:5000/createHello
# echo 'mykey={"name":"Gene Cernan","age":"82"}' | curl -d @- http://0.0.0.0:5000/createHello
@app.route('/createHello', methods = ['POST'])
def postRequestHello():
    mydata = request.data
    print "Data:" + mydata
    assert request.path == '/createHello'
    assert request.method == 'POST'
    data = str(request.form['mykey'])
    # import pdb; pdb.set_trace()
    return "Hello API Server : You sent a "+ request.method + \
            " message on route path " + request.path + \
            " \n\tData:" +  data + "\n"

## Run the website and make sure to make
##  it externally visible with 0.0.0.0:5000 (default)
if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
