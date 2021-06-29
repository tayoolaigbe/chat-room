const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
app.use(cors());

const router = require('./router');

app.use(router);

io.on('connection', socket => {
	console.log('We have a new connection!!!');

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on PORT: ${PORT}`);
});
