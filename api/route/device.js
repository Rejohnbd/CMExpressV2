const express = require('express');
const router = express.Router();
const Device = require('../model/device')

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

router.get('/unassigned', (req, res) => {
    Device.find({is_assign: false})
        .exec()
        .then(docs => {
            return res.status(200).json({devices:docs})
           // return res.send({devices:docs})
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

router.get('/unassigned/:id', (req, res) => {
    Device.updateOne(
        { _id: req.params.id },
        { "is_assign": false }
    )
        .then(doc => {
            return res.redirect('/devices')
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
            return res.redirect('/devices')
        })
        .catch(err => {

        })
})

router.get('/delete/:id', (req, res) => {
    Device.deleteOne(
        { _id: req.params.id }
    )
        .then(doc => {
            return res.redirect('/devices')
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
            is_assign: req.body.is_assign
        } }
    )
        .then(doc => {
            return res.redirect('/devices')
           
        })
        .catch(err => {
            
        })
})


module.exports = router