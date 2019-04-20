const express = require('express')
const router = express.Router()
const User = require('../../api/model/user')
const Device = require('../../api/model/device')
const check_session = require('../../api/middleware/check_session')

const multer = require('multer')


router.get('/:id/devices', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('client_device_list', { data: doc.devices, sess: sess })
    })
    .catch(err => {

    })
})


router.get('/:id/view_device', check_session, (req, res) => {
    
    Device.findOne({ _id: req.params.id })
        .populate('devices')
        .then(doc => {
            return res.render('client_device_view', { data: doc, sess: sess })
        })
        .catch(err => {

        })
})


router.get('/:id/alldevics', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
    .populate('devices')
    .exec()
    .then(doc => {
        return res.render('client_device_all', { data: doc.devices, sess: sess })
    })
    .catch(err => {

    })
})



//Profile Section
router.get('/:id/profile', check_session, (req, res) => {
    
    User.findOne({ _id: req.params.id})
    .exec()
    .then( doc => {
        console.log(doc)
        return res.render('client_profile', { data:doc, sess: sess })
    })
    .catch(err => {

    })
})


router.get('/:id/profile_edit', check_session, (req, res) => {
    User.findOne({ _id: req.params.id })
    .exec()
    .then( doc => {
        return res.render('client_profile_edit', { data: doc, sess: sess })
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

router.post('/profile_update', check_session, upload.single('image'),(req, res) => {
    
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
    }

})

// router.use((req,res,next)=>{
//     console.log(req.path)
//     const error = new Error();
//     error.status=400;
//     error.message = "Rrjohn not Match"
//     // Send Error to the Next
//     return res.render('404', { sess: sess })
//     next(error);
// })


module.exports = router