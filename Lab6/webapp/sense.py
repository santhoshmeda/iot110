#!/usr/bin/python
from sense_hat import SenseHat
import datetime

class PiSenseHat(object):
    """Raspberry pi IoT Sense HAt API Driver Class """
    #Constructor
    def __init__(self):
        self.sense = SenseHat()
        #Enable all IMU functions
        self.sense.set_imu_config(True,True,True)

    #Pressure
    def getPressure(self):
        return self.sense.get_pressure()

    #Temperature
    def getTemperature(self):
        return self.sense.get_temperature()

    #Humidity
    def getHumidity(self):
        return self.sense.get_humidity()

    #Temperature from Humidity
    def getTempfrmHumidity(self):
        return self.sense.get_temperature_from_humidity()

    #Temperature from Pressure
    def getTempfromPressure(self):
        return self.sense.get_temperature_from_pressure()

    #Orientation in Radians
    def getOrientationRadians(self):
        return self.sense.get_orientation_radians()

    #Orientation in Degrees
    def getOrientationDegree(self):
        return self.sense.get_orientation_degrees()

    #Degrees from North
    def getCompass(self):
        return self.sense.get_compass()

    #Accelerometer
    def getAccelerometer(self):
        return self.sense.get_accelerometer_raw()

    #
    def getEnvironmental(self):
        sensors = {'name' : 'sense-hat', 'environmental' : {}}
        return sensors

    #Joystick
    def getJoyStick(self):
        sensors = {'name' : 'sense-hat', 'environmental':{}}
        return sensors

    #Intertia
    def getInertial(self):
        sensors = {'name' : 'sense-hat', 'inertial' : {}}
        return sensors

    def getAllSensors(self):
        sensors = {'name' : 'sense-hat', 'environmental' : {}, 'inertial' :  {}, 'joystick' : {}}
        sensors['environmental']['pressure'] = {'value':self.sense.get_pressure(), 'unit':'mbar'}
        sensors['environmental']['temperature'] = {'value':self.sense.get_temperature(), 'unit' :'C'}
        sensors['environmental']['humidity'] = {'value':self.sense.get_humidity(), 'unit':'%RH'}
        accel = self.sense.get_accelerometer_raw()
        sensors['inertial']['accelerometer'] = {'x':accel['x'], 'y':accel['y'], 'z':accel['z'],'unit':'g'}
        orient = self.sense.get_orientation_degrees()
        sensors['inertial']['orientation'] = {'compass':self.sense.get_compass(),'pitch':orient['pitch'],'roll':orient['roll'],'yaw':orient['yaw'],'unit':'degrees'}
        sensors['timestamp'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return sensors

#=====================================================================================================================
#Main
#======================================================================================================================

def main():
    #create an instance of pi hat sense module
    pi_sense_hat = PiSenseHat()

    #Read the parameters
    p = pi_sense_hat.getPressure()
    t_C = pi_sense_hat.getTemperature()
    h = pi_sense_hat.getHumidity()
    ht = pi_sense_hat.getTempfrmHumidity()
    hp = pi_sense_hat.getTempfromPressure()
    orientation = pi_sense_hat.getOrientationDegree()
    accel = pi_sense_hat.getAccelerometer()
    d = pi_sense_hat.getCompass()

    print("===========Discrete Sensor Values=================\n")
    print "Pressure :", p
    print "Temperature : ", t_C
    print "Humidity :", h
    print "Humidity Temperature :", ht
    print "Humidity Pressure :", hp
    print "compass :", d
    print ("x : {x}, y :{y}, z:{z} \n".format(**accel))
    print("=================================================\n")

    print("==========Dictionary Object===================\n")
    print(pi_sense_hat.getAllSensors())
    print("==============================================\n")

if  __name__ == "__main__":
    main()
