const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { CardGame, Player } = require('./CardGame');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

let players = [];
let game;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinGame', (name) => {
        if (players.length < 3) { // Assuming we need at least 3 players
            const player = new Player(name);
            players.push(player);
            socket.emit('playerJoined', { name, message: `Player ${name} joined.` });

            if (players.length === 3) { // Start the game when we have 3 players
                game = new CardGame(players);
                game.startGame();
                io.emit('gameStarted', players.map(p => p.name));
            }
        } else {
            socket.emit('joinError', { message: 'The game is full.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Handle player disconnection
        players = players.filter(p => p.name !== socket.name);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
