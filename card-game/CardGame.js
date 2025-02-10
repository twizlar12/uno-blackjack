class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    chooseCardToPlay(topCard) {
        // Choose a card to play based on simple logic
        return this.hand.find(card => card.suit === topCard.suit || card.value === topCard.value) || null;
    }

    drawCards(deck, count) {
        for (let i = 0; i < count; i++) {
            if (deck.length > 0) {
                this.hand.push(deck.pop());
            }
        }
    }
}

class CardGame {
    constructor(players) {
        this.players = players;
        this.deck = this.initializeDeck();
        this.discardPile = [];
        this.currentPlayerIndex = 0;
        this.direction = 1; // 1 for clockwise, -1 for counterclockwise
        this.gameOver = false;
    }

    initializeDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = [
            '2', '3', '4', '5', '6', '7', '8', '9', '10',
            'Jack', 'Queen', 'King', 'Ace'
        ];
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        return this.shuffle(deck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    dealCards() {
        this.players.forEach(player => {
            player.drawCards(this.deck, 7);
        });
        this.discardPile.push(this.deck.pop());
    }

    playTurn() {
        const player = this.players[this.currentPlayerIndex];
        const topCard = this.discardPile[this.discardPile.length - 1];
        const cardToPlay = player.chooseCardToPlay(topCard);

        if (cardToPlay) {
            this.discardPile.push(cardToPlay);
            player.hand = player.hand.filter(card => card !== cardToPlay);
            this.executeAction(cardToPlay);
        } else {
            player.drawCards(this.deck, 1);
        }

        this.checkForWin(player);
        if (!this.gameOver) {
            this.nextPlayer();
        }
    }

    executeAction(card) {
        switch (card.value) {
            case 'Ace':
                // Change suit logic here
                break;
            case '2':
                this.nextPlayer().drawCards(this.deck, 2);
                break;
            case '8':
                this.skipNextPlayer();
                break;
            case 'Jack':
                if (card.suit === 'Spades' || card.suit === 'Clubs') {
                    this.nextPlayer().drawCards(this.deck, 5);
                }
                break;
            case 'King':
                this.direction *= -1;
                break;
            default:
                break;
        }
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + this.direction + this.players.length) % this.players.length;
    }

    skipNextPlayer() {
        this.nextPlayer();
        this.nextPlayer();
    }

    checkForWin(player) {
        if (player.hand.length === 0) {
            this.gameOver = true;
            console.log(`${player.name} wins the game!`);
        }
    }

    startGame() {
        this.dealCards();
        while (!this.gameOver) {
            this.playTurn();
        }
    }
}

module.exports = { CardGame, Player };
