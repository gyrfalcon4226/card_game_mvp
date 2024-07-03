const suits = ["Spade", "Heart", "Diamond", "Club"];
const suitEffects = {
    "Spade": "反擊: 對攻擊者造成一半攻擊力的傷害",
    "Heart": "吸血: 攻擊時恢復一半攻擊力的血量",
    "Diamond": "護盾: 每回合獲得一半攻擊力的護盾",
    "Club": "毒素: 對對方造成一半攻擊力的持續傷害"
};
const cards = [
    { attack: 1, health: 12 }, { attack: 2, health: 11 }, { attack: 3, health: 10 },
    { attack: 4, health: 9 }, { attack: 5, health: 8 }, { attack: 6, health: 7 },
    { attack: 7, health: 6 }, { attack: 8, health: 5 }, { attack: 9, health: 4 },
    { attack: 10, health: 3 }, { attack: 11, health: 2 }, { attack: 12, health: 1 }
];

let playerHand = [];
let computerHand = [];
let playerCard = null;
let computerCard = null;

function getRandomCard() {
    const cardIndex = Math.floor(Math.random() * cards.length);
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return { ...cards[cardIndex], suit };
}

function initializeHands() {
    playerHand = [];
    computerHand = [];
    for (let i = 0; i < 5; i++) {
        playerHand.push(getRandomCard());
        computerHand.push(getRandomCard());
    }
}

function displayHands() {
    const playerCardsDiv = document.getElementById('player-cards');
    const computerCardsDiv = document.getElementById('computer-cards');
    playerCardsDiv.innerHTML = '';
    computerCardsDiv.innerHTML = '';

    playerHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `Attack: ${card.attack}<br>Health: ${card.health}<br>Suit: ${card.suit}<br>${suitEffects[card.suit]}`;
        cardDiv.addEventListener('click', () => selectPlayerCard(index));
        playerCardsDiv.appendChild(cardDiv);
    });

    computerHand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `Attack: ${card.attack}<br>Health: ${card.health}<br>Suit: ${card.suit}<br>${suitEffects[card.suit]}`;
        computerCardsDiv.appendChild(cardDiv);
    });
}

function selectPlayerCard(index) {
    playerCard = playerHand[index];
    playerHand.splice(index, 1);  // Remove the selected card from hand
    computerCard = computerHand[Math.floor(Math.random() * computerHand.length)];
    battleRound();
    displayHands();
    checkGameOver();
}

function calculateEffects(card, opponentCard) {
    switch (card.suit) {
        case "Spade":
            opponentCard.health -= Math.floor(card.attack / 2);
            break;
        case "Heart":
            card.health += Math.floor(card.attack / 2);
            break;
        case "Diamond":
            card.health += Math.floor(card.attack / 2);  // Apply shield effect
            break;
        case "Club":
            opponentCard.health -= Math.floor(card.attack / 2);  // Apply poison effect
            break;
    }
}

function battleRound() {
    const battleLog = document.getElementById('battle-log');
    battleLog.innerHTML = `Player Card: ${playerCard.attack}/${playerCard.health} vs Computer Card: ${computerCard.attack}/${computerCard.health}<br>`;

    calculateEffects(playerCard, computerCard);
    calculateEffects(computerCard, playerCard);

    playerCard.health -= computerCard.attack;
    computerCard.health -= playerCard.attack;

    if (playerCard.health > 0) {
        battleLog.innerHTML += `Player's card survives with ${playerCard.health} health.<br>`;
        playerHand.push(playerCard);  // Return to player's hand
    } else {
        battleLog.innerHTML += "Player's card is defeated.<br>";
    }

    if (computerCard.health > 0) {
        battleLog.innerHTML += `Computer's card survives with ${computerCard.health} health.<br>`;
        // Ensure computer card stays in hand for subsequent rounds
    } else {
        battleLog.innerHTML += "Computer's card is defeated.<br>";
        computerHand = computerHand.filter(card => card !== computerCard);
    }

    playerCard = null;
    computerCard = null;
}

function checkGameOver() {
    if (playerHand.length === 0) {
        alert("遊戲結束！電腦獲勝。");
    } else if (computerHand.length === 0) {
        alert("恭喜！你擊敗了電腦。");
    }
}

function startGame() {
    initializeHands();
    displayHands();
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('instructions').style.display = 'none';
}

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('start-game-button').addEventListener('click', startGame);
