const express = require('express');
const exphbs  = require('express-handlebars')
const path = require('path')
const morgan = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const session = require('express-session')

//const fileUpload = require('express-fileupload')

// const questionRoute = require('./api/route/question');
const cmDataRoute = require('./api/route/cmdata')
const userRoute = require('./api/route/user')
const mainRoute = require('./api/route/main')
const dataRoute = require('./api/route/data')
//const deviceRoute = require('./api/route/device')
//const addDeviceRoute = require('./api/route/add_device')
// const headRoute = require('./api/routes/heads')
// const tranRoute = require('./api/routes/trans')

/*===========Web Route===========*/
const userWebRoute = require('./web/route/user')
const deviceWebRoute = require('./web/route/device')
const clientRoute = require('./web/route/clients')
const adminRoute = require('./web/route/admin')

const app = express();
mongoose.connect(process.env.DB_URL,{ useCreateIndex: true,useNewUrlParser: true });

// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'Its Work'
//     })
// })

// Add Morgan Before Routing to get Some Important Log

app.use(morgan('dev'));
// app.set('view engine','ejs')
// app.engine('handlebars', exphbs({defaultLayout: 'base'}))
// // app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars')


app.set('view engine', 'handlebars');

app.engine( 'handlebars', exphbs( {
  extname: 'handlebars',
  defaultLayout: 'base',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

app.use(session({secret: process.env.SESSION_SECRET}))

//app.use(express.static('public'))
app.use('/static', express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))
// parse application/json
app.use(bodyParser.json());

// For Support Cross Origin Request
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*"); // '*' for any 
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method==='OPTIONS'){
        res.header("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE");
        return res.status(200).json({});
    }

    next();
})

// This is the Api Route for Routing 
// app.use('/questions',questionRoute);
// app.use('/categories',categoryRoute);
app.use('/',mainRoute);
app.use('/data',dataRoute);
app.use('/users',userRoute);
app.use('/cm',cmDataRoute);
//app.use('/devices',deviceRoute);
//app.use('/add_device',addDeviceRoute);

/*===========Web Route===========*/
//app.use('/webuser', userWebRoute)
//app.use('/webdevice', deviceWebRoute)

app.use('/client', clientRoute)
app.use('/admin', adminRoute)



app.use(function (req, res, next) {
    switch (req.path) {
        case '/':
            res.locals.title = 'Index Test';
            break;
        case '/login':
            res.locals.title = 'Login Test';
            break;
        default:
            res.locals.title = 'No Meta Tag';
    }
    next();
});




// app.use('/trans',tranRoute);
// app.use('/transactions',transactionRoute);

// Handling Error If No Request is Match to Our Route
app.use((req,res,next)=>{
    const error = new Error();
    error.status=400;
    error.message = "Route not Match"
    // Send Error to the Next
    next(error);
})

// This is Handle All Error including Route and Database Error
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})


module.exports = app;