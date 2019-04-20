module.exports = (req, res, next) => {
    sess = req.session
    console.log('In Check Admin Middleware', sess.is_admin)
    if(sess.admin == true){
        next();
    }else{
        return res.redirect('/logout')
    }
};