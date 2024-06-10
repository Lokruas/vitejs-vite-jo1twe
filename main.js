document.getElementById('fontSelect').addEventListener('change', function() {
    execCmd('fontName', this.value);
});

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

let currentCard = null;

document.querySelectorAll('.card-side').forEach(card => {
    card.addEventListener('focus', () => {
        currentCard = card;
    });
});

document.querySelectorAll('.toolbar button').forEach(button => {
    button.addEventListener('click', () => {
        if (currentCard) {
            currentCard.focus();
        }
    });
});

document.getElementById('fontSelect').addEventListener('change', function() {
    if (currentCard) {
        currentCard.focus();
        execCmd('fontName', this.value);
    }
});

// Diese Variable speichert den Kartenverlauf
let cardHistory = [];

function addCard() {
    const frontText = document.getElementById('front').innerText;
    const backText = document.getElementById('back').innerText;
    const newCard = { front: frontText, back: backText };
    cardHistory.push(newCard);
    document.getElementById('front').innerText = '';
    document.getElementById('back').innerText = '';
    updateCardList(); // Call the function to update the card list
}

function updateCardList() {
    const cardListContainer = document.querySelector('.card-list-container');
    cardListContainer.innerHTML = ''; // Clear existing card list
    cardHistory.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = `Karte ${index + 1}: Frage - ${card.front}, Antwort - ${card.back}`;
        cardListContainer.appendChild(cardDiv);
    });
}

// Die Funktion, um eine neue Karte hinzuzufügen
// Die Funktion, um eine neue Karte hinzuzufügen
function addCard() {
    const frontText = document.getElementById('front').innerText;
    const backText = document.getElementById('back').innerText;
    const newCard = { front: frontText, back: backText };
    cardHistory.push(newCard);
    // Leeren der Eingabefelder für die nächste Karte
    document.getElementById('front').innerText = '';
    document.getElementById('back').innerText = '';
    // Aktualisieren der Kartenliste
    updateCardList();
}
// Die Funktion, um den Kartenverlauf zu aktualisieren
function updateCardList() {
    const cardListContainer = document.querySelector('.history-scroll-container');
    cardListContainer.innerHTML = ''; // Clear existing card list
    cardHistory.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('history-card');
        
        // Erstellen eines Textfelds für die Vorderseite
        const frontTextArea = document.createElement('textarea');
        frontTextArea.value = card.front;
        frontTextArea.readOnly = true; // Nur-Lese-Modus
        cardDiv.appendChild(frontTextArea);
        
        // OnClick-Event für das Laden der Karte
        cardDiv.onclick = () => loadCard(index);
        
        cardListContainer.appendChild(cardDiv);
    });
}

function loadCard(index) {
    const selectedCard = cardHistory[index];
    document.getElementById('front').innerText = selectedCard.front;
    document.getElementById('back').innerText = selectedCard.back;
}

function deleteCard(index) {
    cardHistory.splice(index, 1);
    updateCardList();
}
    // Aktualisieren der Kartenliste
    updateCardList();
}
