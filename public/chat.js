
$(function(){
   	//make connection
	var socket = io.connect('http://118.67.212.164:7890')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var device_id = $("#device_id")
	var temperature = $("#temperature")
	var humidity = $("#humidity")
	var door_lock = $("#door_lock")
	var saveBtn = $("#saveBtn")

	//Emit message
	send_message.click(function(){
		
		socket.emit('new_message', {message : message.val()})
		message.val('');
	})

	saveBtn.click(function(){
		// data = {
		// 	device_id:device_id.val(),
		// 	temperature:temperature.val(),
		// 	humidity:humidity.val(),
		// 	door_lock:door_lock.val()
		// }

		// console.log(data)

		socket.emit('data',"jjjjjjjjjj")
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		// message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})

	socket.on("data_response",data=>{
		console.log(data)
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})

	function addMessage(data){
		
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	}
});


