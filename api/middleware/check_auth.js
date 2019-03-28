module.exports = (req, res, next) => {
    try {
        //console.log(req.headers.authorization)
        const key = req.headers.authorization.split(" ")[1];

        var b = Buffer.from(key, 'base64')



        if(b.toString()==process.env.APP_SECRET){
            next()
        }else{
            return res.status(401)
                .json({
                    message:'Auth Failed'
                })
        }
        // const decoded = jwt.verify(token, process.env.CIVIL_SECRET);
        // req.userData = decoded;
        //next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};