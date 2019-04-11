const express = require('express')
const router = express.Router()
const User = require('../../api/model/user')
const Device = require('../../api/model/device')
const check_session = require('../../api/middleware/check_session')


router.get('/devices/:id', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('client_device_list', { data: doc.devices, sess: sess })
    })
    .catch(err => {

    })
})


router.get('/view_device/:id', check_session, (req, res) => {
    
    Device.findOne({ _id: req.params.id })
        .populate('devices')
        .then(doc => {
            return res.render('client_device_view', { data: doc, sess: sess })
        })
        .catch(err => {

        })
})


router.get('/alldevics/:id', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('client_device_all', { data: doc.devices, sess: sess })
    })
    .catch(err => {

    })
})


router.get('/profile/:id', check_session, (req, res) => {
    
    User.findOne({ _id: req.params.id})
    .exec()
    .then( doc => {
        console.log(doc)
        return res.render('client_profile', { data:doc, sess: sess })
    })
    .catch(err => {

    })
})


router.get('/profile_edit/:id', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
    .exec()
    .then( doc => {
        return res.render('client_profile_edit', { data: doc, sess: sess })
    })
    .catch(err => {

    })
})


router.post('/profile_update', check_session, (req, res) => {
    console.log(req.body.name)
    console.log(req.body.phone)
    console.log(req.body.address)
    console.log(req.files.image)
    let Image = req.files.image
    Image.mv('/static/', (err) =>{
        if(err){
            return res.send('Fail Upload')
        }
        return res.send('Uploaded')
    })
    //return res.send('HHHHHHH')
})
module.exports = router