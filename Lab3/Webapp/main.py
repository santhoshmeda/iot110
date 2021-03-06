#!usr/bin/python

import time
from GPIO import PiGpio
from Debouncer import Debouncer
from bmp280 import PiBMP280
from flask import *

app = Flask(__name__)
pi_gpio = PiGpio()
db = Debouncer()
pi_bmp280 = PiBMP280()

@app.route("/")
def index():
    return render_template('index.html')

# ============================== API Routes ===================================
# ============================ GET: /leds/<state> =============================
# read the LED status by GET method from curl for example
# curl http://iot8e3c:5000/leds/1
# curl http://iot8e3c:5000/leds/2
# curl http://iot8e3c:5000/leds/3
# -----------------------------------------------------------------------------
@app.route("/leds/<int:led_state>", methods=['GET'])
def leds(led_state):
  return "LED State:" + str(pi_gpio.get_led(led_state)) + "\n"


# =============================== GET: /sw ====================================
# read the switch input by GET method from curl for example
# curl http://iot8e3c:5000/sw
# -----------------------------------------------------------------------------
@app.route("/sw", methods=['GET'])
def sw():
  return "Switch State:" + str(pi_gpio.read_switch()) + "!\n"

# ======================= POST: /ledcmd/<data> =========================
# set the LED state by POST method from curl. For example:
# curl --data 'led=1&state=ON' http://iot8e3c:5000/ledcmd
# -----------------------------------------------------------------------------
@app.route("/ledcmd", methods=['POST'])
def ledcommand():
    cmd_data = request.data
    print "LED Command:" + cmd_data
    led = int(str(request.form['led']))
    state = str(request.form['state'])
    if(state == 'OFF'):
        pi_gpio.set_led(led,False)
    elif (state == 'ON'):
        pi_gpio.set_led(led,True)
    else:
        return "Argument Error"

    return "Led State Command:" + state + " for LED number:"+ str(led) + "\n"
    # -----------------------------------------------------------------------------
# ============================== API Routes ===================================

# =========================== Endpoint: /myData ===============================
# read the gpio states by GET method from curl for example
# curl http://iot8e3c:5000/myData
# -----------------------------------------------------------------------------
@app.route('/myData')
def myData():
    def get_state_values():
        while True:
            # return the yield results on each loop, but never exits while loop
            raw_switch = pi_gpio.read_switch()
            debounced_switch = str(db.debounce(raw_switch))
            led_red = str(pi_gpio.get_led(1))
            led_grn = str(pi_gpio.get_led(2))
            led_blu = str(pi_gpio.get_led(3))
            (temperature, pressure) = pi_bmp280.readBMP280All()
            yield('data: {0} {1} {2} {3} {4} {5} \n\n'.format(debounced_switch,led_red,led_grn,led_blu,temperature,pressure))
            time.sleep(0.1)
    return Response(get_state_values(), mimetype='text/event-stream')

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, threaded=True)
