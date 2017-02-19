from flask import Flask
import socket

#Get my machine hostname
if socket.gethostname().find('.') >= 0:
    hostname = socket.gethostname()
else:
    hostname = socket.gethostbyaddr(socket.gethostname())[0]

# creates the flash web server app
app = Flask(__name__)

#Default route
@app.route("/")
def hello():
    return "Hello IoT World from RPI3:" + hostname

#Server port on 5000
if __name__ == "__main__":
    app.run(host='0.0.0.0')
