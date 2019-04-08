const express = require('express')
const router = express.Router()
const User = require('../../api/model/user')
const Device = require('../../api/model/device')
const check_session = require('../../api/middleware/check_session')


router.get('/', check_session, (req, res) => {
    User.find()
        .exec()
        .then(users => {
            return res.render('user_list', { users: users, sess: sess })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

router.get('/:id', check_session, (req, res) => {
    
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('view_user', { data: doc, sess: sess })
    })
    .catch(err => {

    })
})



router.get('/assigndevice/:id', check_session, (req, res) => {
    user_id = req.params.id 
    Device.find({ is_assign: false })
        .exec()
        .then( devices => {
            console.log(devices)
            return res.render('assign_device',{devices: devices, user_id: user_id, sess: sess})
        })
        .catch()
    // return res.send('HHHHHH')
})

router.get('/assign/:device_id/:user_id', (req, res) => {
    // console.log("HHHHHHHHH")
    // return res.send("YYYYYYYYYYY")

    user_id = req.params.user_id
    device_id = req.params.device_id
    

    User.findOne({_id:user_id})
        .exec()
        .then(user=>{
            if(user){
                user.devices.push(device_id)
                user.save()
                Device.findOne({_id:device_id})
                    .exec()
                    .then(device=>{
                        device.is_assign=true
                        device.save()

                        return res.redirect('/webuser/assigndevice/'+user_id)
                    })
                    .catch(err=>{
                        return res.status(500).json({
                            error:err
                        })
                    })
            }
        })
        .catch(err=>{
            return res.status(500).json({
                error:err
            })
        })
    // return res.send('HHHHHH')
})

router.get('/unassign/:device_id/:user_id', (req, res) => {
    // console.log("HHHHHHHHH")
    // return res.send("YYYYYYYYYYY")

    user_id = req.params.user_id
    device_id = req.params.device_id
    

    User.findOne({_id:user_id})
        .exec()
        .then(user=>{
            if(user){
                user.devices.push(device_id)
                user.save()
                Device.findOne({_id:device_id})
                    .exec()
                    .then(device=>{
                        device.is_assign=true
                        device.save()

                        return res.redirect('/webuser/assigndevice/'+user_id)
                    })
                    .catch(err=>{
                        return res.status(500).json({
                            error:err
                        })
                    })
            }
        })
        .catch(err=>{
            return res.status(500).json({
                error:err
            })
        })
    // return res.send('HHHHHH')
})


// USER INFORMATION
router.get('/userdevice/:id', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('user_device_list', { data: doc.devices, sess: sess })
    })
    .catch(err => {

    })
})



module.exports = router