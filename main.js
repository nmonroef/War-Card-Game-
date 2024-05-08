// API URL to fetch a new shuffled deck
const deckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

// Variable to store the deck ID
let deckId = null; // Initialize with null

// Variables to track scores for Player 1 and Player 2
let player1Sum = 0;
let player2Sum = 0;

// Function to fetch a new deck and start the game
function startGame() {
    fetch(deckUrl)
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id; // Store the deck ID
            console.log("New deck created with ID:", deckId);
            document.querySelector(".remainingCards").innerText = data.remaining; // Update remaining cards count in UI
        })
        .catch(err => {
            console.log(`Error creating new deck: ${err}`);
        });
}

// Function to draw cards from the current deck
function drawCards(count) {
    const drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`;
    fetch(drawUrl)
        .then(res => res.json())
        .then(data => {
            console.log("Drawn cards:", data);
            document.querySelector(".remainingCards").innerText = data.remaining; // Update remaining cards count in UI
            document.querySelector("#player1Img").src = data.cards[0].image;
            document.querySelector("#player2Img").src = data.cards[1].image;

            // Evaluate the value of the first card
            let value1 = getValue(data.cards[0].value);
            // Evaluate the value of the second card
            let value2 = getValue(data.cards[1].value);

            // Compare the values of the drawn cards
            if (value1 == value2) {
                alert("Tie! Going to war...");
                handleTie(value1, value2);
            } else if (value1 > value2) {
                player1Sum += 1; // Increment Player 1's score
                document.querySelector("#player1Score").innerText = `Player1 = ${player1Sum}`;
            } else {
                player2Sum += 1; // Increment Player 2's score
                document.querySelector("#player2Score").innerText = `Player2 = ${player2Sum}`;
            }

            // Check if the deck is empty
            if (data.remaining === 0) {
                console.log("Deck empty. Restarting game...");
                // Determine the winner based on scores
                if (player1Sum > player2Sum) {
                    alert("Player 1 Wins!");
                } else if (player2Sum > player1Sum) {
                    alert("Player 2 Wins!");
                } else {
                    alert("It's a tie!");
                }
                // Reset scores and start a new game
                player1Sum = 0;
                player2Sum = 0;
                startGame();
            }
        })
        .catch(err => {
            console.log(`Error drawing cards: ${err}`);
        });
}

// Function to handle tie scenarios
function handleTie(value1, value2) {
    // Draw additional cards for both players
    drawCards(1);

    // Update scores based on the drawn cards
    if (value1 > value2) {
        player1Sum += 4;
        player2Sum -= 4;
    } else {
        player2Sum += 4;
        player1Sum -= 4;
    }

    // Update scores displayed in the UI
    document.querySelector("#player1Score").innerText = `Player1 = ${player1Sum}`;
    document.querySelector("#player2Score").innerText = `Player2 = ${player2Sum}`;
}

// Function to convert card values to numeric values
function getValue(cardValue) {
    switch (cardValue) {
        case "JACK":
            return 10;
        case "QUEEN":
            return 11;
        case "KING":
            return 12;
        case "ACE":
            return 14; // Considering Ace as the highest value
        default:
            return parseInt(cardValue);
    }
}

// Start the game when the page loads
startGame();

// Event listener for the play button to draw cards
document.querySelector("#playButton").addEventListener("click", () => {
    drawCards(2); // Draw 2 cards on each click
});
