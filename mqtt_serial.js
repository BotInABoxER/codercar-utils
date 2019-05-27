var SerialPort = require('serialport').SerialPort;
var bindPhysical = require('mqtt-serial').bindPhysical;
var mqtt = require('mqtt');

// might be something like COM1 on windows
var SERIAL_PORT = process.env.SERIAL_PORT || '/dev/ttyUSB0';

var serialPort = new SerialPort(SERIAL_PORT,{
    baudrate: 57600,
    buffersize: 1
});


var client = mqtt.connect('mqtt://pi_server:1883',
  {username: 'dietpi_username', password: 'dietpi_password'});

bindPhysical({
  serialPort: serialPort,
  client: client,
  transmitTopic: 'insert_transmit_topic_here',
  receiveTopic: 'insert_receive_topic_here'
});

// Based on https://gist.github.com/monteslu/64372bcdff6f56458ec6
