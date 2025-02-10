const socket = io();

document.getElementById('joinButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    if (name) {
        socket.emit('joinGame', name);
    }
});

socket.on('playerJoined', (data) => {
    document.getElementById('gameStatus').innerText = data.message;
});

socket.on('joinError', (data) => {
    document.getElementById('gameStatus').innerText = data.message;
});

socket.on('gameStarted', (playerNames) => {
    document.getElementById('gameStatus').innerText = `Game started with players: ${playerNames.join(', ')}`;
});
