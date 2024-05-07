const deckUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
let deckId = null; // To store the deck ID
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
            document.querySelector("#player1Img").src= data.cards[0].image
            document.querySelector("#player2Img").src= data.cards[1].image
        // Evaluate the value of the first card
        let value1;
        if (data.cards[0].value == "JACK") {
            value1 = 10;
        } else if (data.cards[0].value == "KING") {
            value1 = 12;
        } else if (data.cards[0].value == "QUEEN") {
            value1 = 11;
        } else if (data.cards[0].value == "ACE") {
            value1 = 14;
        } else {
            value1 = Number(data.cards[0].value);
        }

        // Evaluate the value of the second card
        let value2;
        if (data.cards[1].value == "JACK") {
            value2 = 10;
        } else if (data.cards[1].value == "KING") {
            value2 = 12;
        } else if (data.cards[1].value == "QUEEN") {
            value2 = 11;
        } else if (data.cards[1].value == "ACE") {
            value2 = 14;
        } else {
            value2 = Number(data.cards[1].value);
        }   

        
        if (value1 > value2) {
            player1Sum += 1;
            document.querySelector("#player1Score").innerText = `Player1 = ${player1Sum}`
        }else {
            player2Sum += 1;
            document.querySelector("#player2Score").innerText = `Player2 = ${player2Sum}`
        }


            if (data.remaining === 0) {
                console.log("Deck empty. Restarting game...");
                if (player1Sum > player2Sum) {
                    alert("Player1 Wins!")
                   
                }else {
                    alert("Player2 Wins! ")
                    
                }
                 player1Sum = 0;
                 player2Sum = 0;
                startGame(); // Restart the game when the deck is empty
            }
        })
        .catch(err => {
            console.log(`Error drawing cards: ${err}`);
        });
}

// Start the game when the page loads
startGame();

// Event listener for the play button to draw cards
document.querySelector("#playButton").addEventListener("click", () => {
    drawCards(2); // Draw 2 cards on each click
});
