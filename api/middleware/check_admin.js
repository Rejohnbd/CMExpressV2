module.exports = (req, res, next) => {
    sess = req.session
    if(sess.is_admin == true){
        next();
    }else{
        return res.redirect('/logout')
    }
};