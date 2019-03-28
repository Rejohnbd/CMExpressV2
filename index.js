require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose')

const app = require('./app');

const CMData = require('./api/model/cmdata')


const port = process.env.PORT || 3000;

const server = http.createServer(app);

var counter=0



server.listen(port,function(){
    console.log("Server Start",port);
})

//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket) => {
    counter+=1
	console.log(counter,' user connected')

	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('data', (data) => {
        cmData = new CMData({
            _id :new mongoose.Types.ObjectId(),
            device_id:data.device_id,
            temperature:data.temperature,
            humidity:data.humidity,
            door_lock:data.door_lock
        })

        cmData.save()
        //     .then(doc=>{
        //         console.log("Data",doc)
        //     })

        // socket.emit('data_response',{message:"Paichi"})

        // message.save()
        // console.log("Maybe Saved Called")
        // //broadcast the new message
        // io.sockets.emit('new_message', {message : data.message, username : socket.username});
        // socket.broadcast.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})