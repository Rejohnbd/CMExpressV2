const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')

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



router.get('/', (req, res) => {
    User.find()
        .select('name email image')
        .exec()
        .then(users => {
            return res.status(200).json({
                users: users
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})



router.post('/signup/', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: "Email Already Taken"
                })
            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const usr = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })

                        usr.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })

            }
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})


router.post('/login/', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {

            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed-1"
                        });
                    }

                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user._id
                            },
                            process.env.APP_SECRET,
                            {
                                expiresIn: "2h"
                            }
                        )

                        return res.status(201).json({
                            message: "Auth successful",
                            token: token,
                            user: {
                                _id: user._id,
                                email: user.email
                            }
                        });


                    }
                })



            } else {
                res.status(401).json({
                    message: "Auth Failed-2"
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})


router.delete("/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.get('/:userId', (req, res) => {
    userId = req.params.userId;
    User.findOne({ _id: userId })
        .populate('devices')
        .exec()
        .then(user => {
            return res.status(200).json(user)
        })
        .catch((err) => {
            return res.status(500).json({ error: err })
        })
})

router.put("/updatetoken/:userId", (req, res) => {
    var token = req.body.token
    var user_id = req.params.userId
    if (token) {
        User.findOne({ _id: user_id })
            .exec()
            .then(user => {
                if (user) {
                    user.firebase_token = token
                    user.save()
                        .then(user => {
                            return res.status(200).json({ message: "User Updated" })
                        })
                        .catch(err => {
                            return res.status(501).json(err)
                        })

                } else {
                    return res.status(404).json({ message: "User Not Found" })
                }
            })
            .catch(err => {
                return res.status(500).json({ error: err })
            })
    }
})


router.put("/:userId", upload.single('image'), (req, res, next) => {

    const file = req.file
    const name = req.body.name
    const phone = req.body.phone
    const address = req.body.address

    // console.log(file)

    // console.log(mongoose.Types.ObjectId.isValid('5c838f8b44420833a8a99b99'))

    if (file) {
        User.findById({ _id: req.params.userId })
            .populate('devices')
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
                        return res.status(201).json(user)
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
        User.findById({ _id: req.params.userId })
            .populate('devices')
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
                        return res.status(201).json(user)
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




module.exports = router