# codercar-utils
A collection of useful files for use with the CodeRcar kit

- ```codercar-node-red-flows.json``` is a minified JSON file that has all of the basic nodes you'll need to setup Node-RED for your CodeRcar.

- ```hc-paho.py``` is a simple implementation of RPi.GPIO and Eclipse Paho for Python 3 to broadcast values read from an HC-SR04 Ultrasonic Distance Sensor to an MQTT topic on localhost.

- ```mpu6050-mqtt.js``` is an implementation of Cylon.js for use with broadcasting the values read from an MPU-6050 accelerometer/gyroscope/thermometer to an MQTT topic on localhost (still a bit sketchy, but it works...)
