#!/usr/bin/python3

# A simple implementation of RPi.GPIO and Eclipse Paho to broadcast values
# read from an HC-SR04 Ultrasonic Distance Sensor to an MQTT topic on localhost.

# Part of the CodeRcar Utils package - https://github.com/botinaboxer/codercar-utils

import paho.mqtt.publish as publish
import RPi.GPIO as GPIO
import time

# ^ the above block of code imports the libraries we need.

# time is a system library, pre-installed with Python 3.
# Install Eclipse Paho for Python: python3 -m pip install --user paho-mqtt
# Install RPi.GPIO: python3 -m pip install --user RPi.GPIO

# Run the script: python3 hc-paho.py

try:
    GPIO.setmode(GPIO.BOARD)
    PIN_TRIGGER = 7
    PIN_ECHO = 11
    GPIO.setup(PIN_TRIGGER, GPIO.OUT)
    GPIO.setup(PIN_ECHO, GPIO.IN)
    print("Waiting for the sensor to settle...")
    publish.single("distance", "Loading...", hostname="localhost")
    time.sleep(5)
    print("Calculating Distance - Press CTRL+C to stop the program")
    time.sleep(3)

    # ^ The above section defines the pins on your Pi to which the sensor is connected.
    # It then initializes them properly, gives you a nice status message, and waits
    # for a few seconds.
    
    while True:
        time.sleep(0.5)
        GPIO.output(PIN_TRIGGER, GPIO.HIGH)
        time.sleep(0.00001)
        GPIO.output(PIN_TRIGGER, GPIO.LOW)

        while GPIO.input(PIN_ECHO)==0:
            pulse_start_time = time.time()
        while GPIO.input(PIN_ECHO)==1:
            pulse_end_time = time.time()

        pulse_duration = pulse_end_time - pulse_start_time
        distance = round(pulse_duration * 17150, 2)
        print("Distance: ", distance)
        publish.single("distance", distance, hostname="localhost")

    # ^ The above block of code handles the actual sensor readings, and broadcasts
    # them via MQTT to the "distance" topic every 0.50001 seconds, or so.

except KeyboardInterrupt:
    print(" <--- CTRL+C received. Program stopping...")
    
finally:
    GPIO.cleanup()

# The except: block makes exception-handling easy. In this case, when you press
# CTRL+C, the except: block gives you a friendly reminder that you've closed
# the program, as opposed to an ominous, vague error.

# The finally: block executes just as the program is stopping. In this case,
# it makes sure that the GPIO pins become unallocated, so you won't get any
# warnings the next time you try to use them for something. 
