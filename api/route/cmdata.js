const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const CMData = require('../model/cmdata')
const moment = require('moment')
const check_auth = require('../middleware/check_auth')
const Device = require('../model/device')
const User = require('../model/user')


var admin = require("firebase-admin");

var serviceAccount = require("../firebase/service_account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREDATABASE_URL
});



router.get('/', check_auth, (req, res) => {

    CMData.find()
        .exec()
        .then(docs => {
            return res.status(200).json({
                count: docs.length,
                data: docs
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })



    // if(device_id && temperature && humidity && door_lock){

    //     const cmData = new CMData({
    //         _id :new mongoose.Types.ObjectId(),
    //         device_id:device_id,
    //         temperature:temperature,
    //         humidity:humidity,
    //         door_lock:door_lock
    //     })

    //     cmData.save()
    //     .then(doc=>{
    //         return res.status(201).json({
    //             data:doc
    //         })
    //     })
    //     .catch(err=>{
    //         return res.status(500).json({
    //             error:err
    //         })
    //     })

    // }else{

    // }


})


router.get('/create/', (req, res) => {
    const device_id = req.query.device_id
    const temperature = req.query.temperature
    const humidity = req.query.humidity
    const door_lock = req.query.door_lock



    Device.findOne({ device_id: device_id })
        .exec()
        .then(device => {
            if (device) {
                if (device_id && temperature && humidity && door_lock) {

                    const cmData = new CMData({
                        _id: new mongoose.Types.ObjectId(),
                        device_id: device_id,
                        temperature: temperature,
                        humidity: humidity,
                        door_lock: door_lock
                    })

                    cmData.save()
                        .then(doc => {
                            console.log(device.tempareture_max)


                            if (device.tempareture_min && device.tempareture_min && device.humidity_max && device.humidity_min) {
                                if (temperature < device.tempareture_min || temperature > device.tempareture_max || humidity < device.humidity_min || humidity > humidity_max) {
                                    sendNotification(device, temperature, humidity)

                                }
                                return res.status(201).json({
                                    data: doc
                                })

                            } else {
                                return res.status(201).json({
                                    data: doc
                                })
                            }
                            // if(device.tempareture_min == process.env.DEFAULT || device.tempareture_max == process.env.DEFAULT){
                            //     return res.status(201).json({
                            //         data: doc
                            //     })
                            // }

                        })
                        .catch(err => {
                            return res.status(500).json({
                                error: err
                            })
                        })

                } else {
                    return res.status(500)
                        .json({
                            message: "Parameter Missing"
                        })
                }
            } else {
                return res.status(404).json({ message: "Device Not Registered." })
            }
        })
        .catch(err => {
            return res.status(500).json(err)
        })



})


router.post('/', (req, res) => {
    const cmData = new CMData({
        _id: new mongoose.Types.ObjectId(),
        device_id: req.body.device_id,
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        door_lock: req.body.door_lock
    })

    const dateStr = req.body.date

    if (dateStr) {
        const date = new Date(dateStr)
        const newDate = new Date(date.valueOf() - date.getTimezoneOffset() * 60000)
        cmData.date = newDate
    }



    cmData.save()
        .then(doc => {
            return res.status(201).json({
                data: doc
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})


router.get('/:device_id', (req, res) => {
    const device_id = req.params.device_id
    //const last_data=req.params.last_data
    const date = req.query.date
    const date_range = req.query.date_range

    if (date) {
        if (date == 'today') {
            const startTime = moment().startOf('day')
            const endTime = moment(startTime).endOf('day')
            startTime.add({ hours: 6 })
            endTime.add({ hours: 6 })

            console.log(startTime, endTime)
            CMData.find({
                device_id: device_id,
                date: {
                    $gte: startTime.toDate(),
                    $lte: endTime.toDate()
                }
            })
                .exec()
                .then(docs => {
                    return res.status(200).json({
                        count: docs.length,
                        data: docs
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        error: err
                    })
                })
        } else {
            const castDate = new Date(date);

            if (isValidDate(castDate)) {
                console.log(castDate)
                const startTime = moment(castDate)
                const endTime = moment(startTime).endOf('day')

                startTime.add({ hours: 6 })
                endTime.add({ hours: 6 })
                console.log(startTime, endTime)

                CMData.find({
                    device_id: device_id,
                    date: {
                        $gte: startTime.toDate(),
                        $lte: endTime.toDate()
                    }
                })
                    .exec()
                    .then(docs => {
                        return res.status(200).json({
                            count: docs.length,
                            data: docs
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            error: err
                        })
                    })
            } else {
                return res.status(500)
                    .json({
                        message: "Failed to Cast Date"
                    })
            }

        }
    } else if (date_range) {
        const dates = date_range.split('-')
        if (dates.length == 2) {
            firstDateStr = dates[0]
            secondDateStr = dates[1]

            console.log(firstDateStr, secondDateStr)

            const castFirstDate = new Date(firstDateStr);
            const castSecondDate = new Date(secondDateStr);

            if (isValidDate(castFirstDate) && isValidDate(castSecondDate)) {
                const startTime = moment(castFirstDate)
                const lastDateStartTime = moment(castSecondDate)
                const lastDateEndTime = moment(lastDateStartTime).endOf('day')
                lastDateEndTime.add({ hours: 6 })
                startTime.add({ hours: 6 })

                console.log(startTime, lastDateEndTime)

                CMData.find({
                    device_id: device_id,
                    date: {
                        $gte: startTime.toDate(),
                        $lte: lastDateEndTime.toDate()
                    }
                })
                    .exec()
                    .then(docs => {
                        return res.status(200).json({
                            count: docs.length,
                            data: docs
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            error: err
                        })
                    })



            } else {
                return res.status(500)
                    .json({
                        message: "Failed to Cast Date"
                    })
            }

        } else {
            return res.status(500).json({
                message: "Date Format (YYYY/MM/DD) and separate by - "
            })
        }
    } else {

        CMData.find({ device_id: device_id })
            .exec()
            .then(docs => {
                return res.status(200).json({
                    count: docs.length,
                    data: docs
                })
            })
            .catch(err => {
                return res.status(500).json({
                    error: err
                })
            })

    }



    console.log(device_id)
})


router.get('/:device_id/last_data', (req, res) => {
    const device_id = req.params.device_id

    CMData.findOne({ device_id: device_id })
        .sort({ date: -1 })
        .exec()
        .then(doc => {
            return res.status(200).json(doc)
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})


function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}


function sendNotification(device, temperature, humidity) {

    User.find({ devices: { $in: device._id } })
        .exec()
        .then(users => {
            var token = users[0].firebase_token

            // data: {
            //     score: '850',
            //     time: '2:45'
            //   },

            if (temperature < device.tempareture_min) {
                var message = {
                    notification: {
                        title: "Temperature Alert ",
                        body: "Temperature Below " + device.tempareture_min + " on device "+device.device_id
                    },
                    token: token
                };

                admin.messaging().send(message)
                    .then(response => console.log(response))
                    .catch(err => console.log(err))

            }
            if (temperature > device.tempareture_max) {
                var message = {
                    notification: {
                        title: "Temperature Alert ",
                        body: "Temperature Upper " + device.tempareture_max
                    },
                    token: token
                };

                admin.messaging().send(message)
                    .then(response => console.log(response))
                    .catch(err => console.log(err))

            }
            if (humidity < device.humidity_min) {
                var message = {
                    notification: {
                        title: "Humidity Alert ",
                        body: "Humidity Below " + device.humidity_min
                    },
                    token: token
                };

                admin.messaging().send(message)
                    .then(response => console.log(response))
                    .catch(err => console.log(err))
            }
            if (humidity > device.humidity_max) {
                var message = {
                    notification: {
                        title: "Humidity Alert ",
                        body: "Humidity Upper " + device.humidity_max
                    },
                    token: token
                };

                admin.messaging().send(message)
                    .then(response => console.log(response))
                    .catch(err => console.log(err))
            }
        })
        .catch()


}



module.exports = router