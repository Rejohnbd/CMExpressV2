const express = require('express')
const router = express.Router()
const Device = require('../../api/model/device')
const CMData = require('../../api/model/cmdata')
const mongoose = require('mongoose')

router.get('/add_device', (req, res) => {
    return res.render('device_add')
})

router.post('/save', (req, res) => {
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
                return res.redirect('/webdevice/add_device')
            }
        })
        .catch(err => {

        })
})

router.get('/', (req, res) => {
    Device.find()
        .exec()
        .then(docs => {
            return res.render('device_list', { datas: docs })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

router.get('/:id', (req, res) => {
    Device.findOne({ _id: req.params.id })
        .then(doc => {
            return res.render('device_add', { data: doc })
        })
        .catch(err => {

        })
})


router.get('/view_device/:id', (req, res) => {
    
    Device.findOne({ _id: req.params.id })
        .populate('devices')
        .then(doc => {
            return res.render('view_device', { data: doc })
        })
        .catch(err => {

        })
})

router.post('/update', (req, res) => {
    Device.findOneAndUpdate(
        { _id: req.body._id },
        { $set: {
            device_id: req.body.device_id,
            sim_number: req.body.sim_number,
            location: req.body.location,
            tempareture_min: req.body.tempareture_min,
            tempareture_max: req.body.tempareture_max,
            humidity_min: req.body.humidity_min,
            humidity_max: req.body.humidity_max,
            is_assign: req.body.is_assign
        } }
    )
        .then(doc => {
            return res.redirect('/webdevice')
           
        })
        .catch(err => {
            
        })
})

router.get('/unassigned/:id', (req, res) => {
    Device.updateOne(
        { _id: req.params.id },
        { "is_assign": false }
    )
        .then(doc => {
            return res.redirect('/webdevice')
        })
        .catch(err => {

        })
})

router.get('/assigned/:id', (req, res) => {
    Device.updateOne(
        { _id: req.params.id },
        { "is_assign": true }
    )
        .then(doc => {
            return res.redirect('/webdevice')
        })
        .catch(err => {

        })
})

router.get('/delete/:id', (req, res) => {
    Device.deleteOne(
        { _id: req.params.id }
    )
        .then(doc => {
            return res.redirect('/webdevice')
        })
        .catch(err => {

        })
})


module.exports = router