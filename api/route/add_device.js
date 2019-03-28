const express = require('express');
const router = express.Router();
const Device = require('../model/device')
const mongoose = require('mongoose')


router.get('/', (req, res) => {
    return res.render('device_add')
})

router.post('/', (req, res) => {
    Device.findOne({ device_id: req.body.device_id })
        .exec()
        .then(device => {
            if (device) {
                return res.render('/', {
                    error: 'Device Id Already Registered',
                })
            } else {
                new_device = new Device(req.body)
                new_device._id = new mongoose.Types.ObjectId()
                new_device.save()
                return res.redirect('add_device')
            }
        })
        .catch(err => {

        })
})




module.exports = router