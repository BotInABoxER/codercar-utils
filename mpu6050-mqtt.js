/*
  An implementation of Cylon.js to publish MPU6050 sensor module readings
  to an MQTT broker running on localhost

  Part of CodeRcar Utils - https://github.com/botinaboxer/codercar-utils

  (It's especially useful for use with Node-RED!)
  It's probably worth noting that this script requires the following Node.JS
  modules to be installed via either NPM or Yarn (probably best to make a
  separate folder for the script first):

  `yarn add cylon cylon-gpio cylon-i2c cylon-mqtt cylon-raspi kalmanjs` OR
  `npm install cylon cylon-gpio cylon-i2c cylon-mqtt cylon-raspi kalmanjs`

  Then you just run the script like so:
  `node mpu6050-mqtt.js`
*/

const Cylon = require('cylon') // https://www.npmjs.com/package/cylon
const KalmanFilter = require('kalmanjs') // https://github.com/infusion/Kalman.js/

const accelxFilter = new KalmanFilter({R: 0.05, Q: 2})
const accelyFilter = new KalmanFilter({R: 0.05, Q: 2})
const accelzFilter = new KalmanFilter({R: 0.05, Q: 2})
const gyroxFilter = new KalmanFilter({R: 0.05, Q: 2})
const gyroyFilter = new KalmanFilter({R: 0.05, Q: 2})
const gyrozFilter = new KalmanFilter({R: 0.05, Q: 2})
const tempFilter = new KalmanFilter({R: 0.05, Q: 5})

// ^ Using a Kalman filter to try to reduce sensor input noise

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' },
    server: { adaptor: 'mqtt', host: 'mqtt://localhost:1883' }
  },

  devices: {
    mpu6050: { driver: 'mpu6050' }
  },

  work: function(my) {
    every((1).seconds(), () => {
      my.mpu6050.getMotionAndTemp((err, data) => {

        console.log(data)
        
        my.server.publish('accelerometer/x', accelxFilter.filter(data['a'][0]).toString(10))
        my.server.publish('accelerometer/y', accelyFilter.filter(data['a'][0]).toString(10))
        my.server.publish('accelerometer/z', accelzFilter.filter(data['a'][2]).toString(10))

        my.server.publish('gyroscope/x', gyroxFilter.filter(data['g'][0]).toString(10))
        my.server.publish('gyroscope/y', gyroyFilter.filter(data['g'][1]).toString(10))
        my.server.publish('gyroscope/z', gyrozFilter.filter(data['g'][2]).toString(10))

        my.server.publish('temperature', tempFilter.filter(data['t'].toFixed(2)).toString(10))
        /*
          ^ This part of the script should make a bit more sense if you realize
            that the `data` object looks something like this:
          `{ a: [ -312, 88, 16884 ],
             g: [ -204, -32, -112 ],
             t: 29.023529411764706
           }`
        */
      })
    })
  }
})
