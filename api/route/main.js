const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../model/user')
const Devices = require('../model/device')
const bcrypt = require('bcryptjs')
const CMData = require('../model/cmdata')


router.get('/', (req, res) => {
    sess = req.session
    //console.log(sess)
    if (!sess.email) {
        //res.setHeader("Content-Type", "text/html")
        return res.redirect('login')
    }else{
        if(sess.admin == true){
            User.find()
                .exec()
                .then(users => {
                    Devices.find()
                        .exec()
                        .then(devices => {

                            assign_count =0;
                            unassign_count =0;
                            devices.map(device=>{
                                if(device.is_assign==true){
                                    assign_count = assign_count + 1
                                }else{
                                    unassign_count = unassign_count + 1
                                }
                            })
                            total_count = unassign_count+assign_count
    
                            return res.render('main', {
                                no_of_users:users.length,
                                sess: req.session,
                                total_count:total_count,
                                assign_count:assign_count,
                                unassign_count:unassign_count
                            })
                        })
                        .catch(err=>{
                            return res.status(500).json({
                                error:err
                            })
                        }) 
                })
                .catch(err=>{
                    return res.status(500).json({
                        error:err
                    })
                })
              
        }else{
            return res.render('client', {
                sess: req.session
            })
        }
    }
})


router.get('/logout', (req, res) => {
    req.session.destroy()
    return res.redirect('login')
})


router.get('/login', (req, res) => {
    return res.render('login', {nav:true})
})


router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {

            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    console.log(err, result)
                    if (err) {
                        console.log('Error Bcrypt')
                        return res.render('login', {
                            message: 'Authentication Failed'
                        })
                    }

                    if (result) {
                        console.log('Success Bcrypt')
                        console.log(user)
                        console.log(user._id)
                        req.session.email = user.email
                        req.session.userid = user._id
                        req.session.admin = user.is_admin
                        req.session.name = user.name
                        req.session.image = user.image
                        sess = req.session
                        return res.redirect('/')

                        // return res.status(201).json({
                        //     message: "Auth successful",
                        //     token: token,
                        //     user:{
                        //         _id:user._id,
                        //         email:user.email
                        //     }
                        // });

                    }
                })

            } else {
                return res.render('login', {
                    message: 'Authentication Failed'
                })
            }

        }).catch(err => {
            console.log(err)
            return res.send(err)
        })
})

router.get('/register', (req, res) => {
    return res.render('register',{nav:true})
})

router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                return res.render('register', {
                    message: 'This Email Already Taken',
                    email: req.body.email,
                    nav:true
                })
            } else {
                if (req.body.password.length < 6) {
                    return res.status(500).render('register', {
                        pass_message: 'Password Atleast 6 Charecter Long',
                        email: req.body.email,
                        nav: true
                    })
                }

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
                        return res.redirect('login')
                        // .then(result => {
                        //     return res.redirect('login')
                        // })
                        // .catch(err => {
                        //     return res.status(500).json({
                        //         error: err
                        //     })
                        // })
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




router.get('/user_add', (req, res) => {
    return res.render('user_add')
})


module.exports = router