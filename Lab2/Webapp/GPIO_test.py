#!/usr/bin/python
import time
from GPIO import PiGpio

# create an instance of the pi gpio driver.
pi_gpio= PiGpio()

RED_LED = 1
GRN_LED = 2
BLU_LED = 3

def get_all_led_status():
    print("Getting status of the LEd's")
    print('RED LED: {0}'.format(pi_gpio.get_led(RED_LED)))
    print('GRN LED: {0}'.format(pi_gpio.get_led(GRN_LED)))
    print('BLU LED: {0}'.format(pi_gpio.get_led(BLU_LED)))

# Blink the LEDS forever.
print('Blinking all my LEDs in sequence (Ctrl-C to stop)...')
while True:
# Get the current switch state and print
    switch = pi_gpio.read_switch()
    print('\n============ Switch: {0} ============'.format(switch))

    print('\n Turning RED LED ON ')
    pi_gpio.set_led(RED_LED,True)
    get_all_led_status()
    time.sleep(1.0)

    print('\nTurning GRN LED ON ')
    pi_gpio.set_led(2,True)
    get_all_led_status()
    time.sleep(1.0)

    print('\nTurning BLU LED ON ')
    pi_gpio.set_led(3,True)
    get_all_led_status()
    time.sleep(1.0)


    print('\nTurning RED LED OFF ')
    pi_gpio.set_led(1,False)
    get_all_led_status()
    time.sleep(1.0)

    print('\nTurning GRN LED OFF')
    pi_gpio.set_led(2,False)
    get_all_led_status()
    time.sleep(1.0)

    print('\nTurning BLU LED OFF ')
    pi_gpio.set_led(3,False)
    get_all_led_status()
    time.sleep(1.0)
