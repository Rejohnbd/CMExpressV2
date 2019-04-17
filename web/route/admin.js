const express = require('express')
const router = express.Router()
const User = require('../../api/model/user')
const Device = require('../../api/model/device')
const mongoose = require('mongoose')
const check_session = require('../../api/middleware/check_session')

const multer = require('multer')
const check_admin = require('../../api/middleware/check_admin')

//User Section Start
router.get('/users',check_admin, check_session, (req, res) => {
    User.find()
        .populate('devices')
        .exec()
        .then(users => {
            console.log(users)
            return res.render('user_list', { users: users, sess: sess })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

router.get('/viewuser/:id', check_session, (req, res) => {
    
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('user_view', { data: doc, sess: sess })
    })
    .catch(err => {

    })
})

router.get('/deleteuser/:id', (req, res) => {
    User.deleteOne(
        { _id: req.params.id }
    )
        .then(doc => {
            return res.redirect('/admin/users')
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
            return res.render('user_assign_device',{devices: devices, user_id: user_id, sess: sess})
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

                        return res.redirect('/admin/assigndevice/'+user_id)
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

router.get('/view_device/:id', check_session, (req, res) => {
    
    Device.findOne({ _id: req.params.id })
        .populate('devices')
        .then(doc => {
            return res.render('admin_view_device', { data: doc, sess: sess })
        })
        .catch(err => {

        })
})

router.get('/unassign/:device_id/:user_id', (req, res) => {

    // console.log(req.params.device_id)
    // console.log(req.params.user_id)
    // return res.send("YYYYYYYYYYY")

    user_id = req.params.user_id
    device_id = req.params.device_id
    

    User.findOne({ _id:user_id })
        .exec()
        .then(user=>{
            if(user){
                user.devices.pull(device_id)
                user.save()
                Device.findOne({_id:device_id})
                    .exec()
                    .then(device=>{
                        device.is_assign=false
                        device.save()

                        return res.redirect('/admin/viewuser/'+user_id)
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


//Device Section Start
router.get('/add_device',check_session, (req, res) => {
    return res.render('admin_device_add', {sess: sess })
})

router.post('/save',check_session, (req, res) => {
    Device.findOne({ device_id: req.body.device_id })
        .exec()
        .then(device => {
            if (device) {
                return res.render('/admin/add_device', {
                    error: 'Device Id Already Registered',
                })
            } else {
                new_device = new Device(req.body)
                new_device._id = new mongoose.Types.ObjectId()
                new_device.save()
                return res.redirect('/admin/add_device')
            }
        })
        .catch(err => {

        })
})

router.get('/devicelist',check_session, (req, res) => {
    Device.find()
    .exec()
    .then(docs => {
        return res.render('admin_device_list', { 
            datas: docs,
            sess: sess 
        })
    })
    .catch(err => {
        return res.status(500).json({
            error: err
        })
    })
    
})

router.get('/:id',check_session, (req, res) => {
    Device.findOne({ _id: req.params.id })
        .then(doc => {
            return res.render('admin_device_add', { data: doc, sess: sess })
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
            return res.redirect('/admin/devicelist')
           
        })
        .catch(err => {
            
        })
})

router.get('/delete/:id', (req, res) => {
    Device.deleteOne(
        { _id: req.params.id }
    )
        .then(doc => {
            return res.redirect('/admin/devicelist')
        })
        .catch(err => {

        })
})

router.get('/view_device/:id', check_session, (req, res) => {
    
    Device.findOne({ _id: req.params.id })
        .populate('devices')
        .then(doc => {
            return res.render('admin_view_device', { data: doc, sess: sess })
        })
        .catch(err => {

        })
})



//Profile Section Start
router.get('/profile/:id', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
        .exec()
        .then(doc => {
            console.log(doc)
            return res.render('admin_profile', { data: doc, sess: sess })
        })
        .catch(err => {

        })
})

router.get('/profile_edit/:id', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
        .exec()
        .then(doc => {
            return res.render('admin_profile_edit', { data: doc, sess: sess })
        })
        .catch(err => {

        })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.post('/profile_update', check_session, upload.single('image'), (req, res) => {

    const userId = req.body._id
    const name = req.body.name
    const phone = req.body.phone
    const address = req.body.address
    const file = req.file

    if (file) {
        User.findById({ _id: userId })
            .exec()
            .then(user => {

                var imagePath = file.path
                console.log(imagePath)
                var pathArray = imagePath.split("public\\")
                console.log(pathArray[1])

                user.image = pathArray[1]

                if (name) {
                    user.name = req.body.name
                }
                if (phone) {
                    user.phone = req.body.phone
                }
                if (address) {
                    user.address = req.body.address
                }


                user.save()
                    .then(user => {
                        req.session.name = user.name
                        req.session.image = user.image
                        sess = req.session
                        return res.render('client_profile', { data: user, sess: sess })
                    })
                    .catch(err => {
                        return res.status(400).json({
                            error: err
                        })
                    })
            })
            .catch(err => {
                return res.status(500).json({
                    error: err
                })
            })
    } else {
        User.findById({ _id: userId })
            .exec()
            .then(user => {

                if (name) {
                    user.name = req.body.name
                }
                if (phone) {
                    user.phone = req.body.phone
                }
                if (address) {
                    user.address = req.body.address
                }

                user.save()
                    .then(user => {
                        req.session.name = user.name
                        sess = req.session
                        return res.render('admin_profile', { data: user, sess: sess })
                    })
                    .catch(err => {
                        return res.status(400).json({
                            error: err
                        })
                    })
            })
            .catch(err => {
                return res.status(500).json({
                    error: err
                })
            })
    }

})

router.use((req,res,next)=>{
    console.log(req.path)
    const error = new Error();
    error.status=400;
    error.message = "Route not Match"
    // Send Error to the Next
    next(error);
})

module.exports = router