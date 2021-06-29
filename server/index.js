const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const router = require('./router');

app.use(cors());
app.use(router);

io.on('connection', socket => {
	console.log('We have a new connection!!!');

	socket.on('join', ({ name, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room });

		if (error) callback(error);
		console.log(user);

		socket.emit('message', {
			user: 'admin',
			text: `${user.name}, welcome to the room ${user.room}.`,
		});
		// socket.emit('message', {
		// 	user: 'admin',
		// 	text: `${user.name}, welcome to room ${user.room}.`,
		// });
		socket.broadcast
			.to(user.room)
			.emit('message', { user: 'admin', text: `${user.name}, has joined` });

		socket.join(user.room);

		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit('message', { user: user.name, text: message });

		callback();
	});

	socket.on('disconnect', () => {
		console.log('User disconnected!');
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(`Server running on PORT: ${PORT}`);
});
