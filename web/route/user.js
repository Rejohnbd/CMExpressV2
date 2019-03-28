const express = require('express')
const router = express.Router()
const User = require('../../api/model/user')
const Device = require('../../api/model/device')


router.get('/', (req, res) => {
    User.find()
        .exec()
        .then(users => {
            return res.render('user_list', { users: users })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

router.get('/:id', (req, res) => {
    
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('view_user', { data: doc })
    })
    .catch(err => {

    })
})



router.get('/assigndevice/:id', (req, res) => {
    user_id = req.params.id 
    Device.find({ is_assign: false })
        .exec()
        .then( devices => {
            return res.render('assign_device',{devices: devices, user_id: user_id})
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



module.exports = router