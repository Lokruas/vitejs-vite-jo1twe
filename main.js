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

let cardHistory = [];

function addCard() {
    const frontText = document.getElementById('front').innerText;
    const backText = document.getElementById('back').innerText;
    if (frontText && backText) {
        const newCard = { front: frontText, back: backText };
        cardHistory.push(newCard);
        document.getElementById('front').innerText = '';
        document.getElementById('back').innerText = '';
        updateCardList();
    } else {
        alert("Bitte sowohl Vorder- als auch Rückseite ausfüllen.");
    }
}

document.getElementById('addCardButton').addEventListener('click', addCard);

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
        
        // Löschbutton hinzufügen
        const deleteButton =
