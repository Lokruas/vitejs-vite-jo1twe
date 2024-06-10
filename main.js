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

// Die Funktion, um eine neue Karte hinzuzufügen
function addCard() {
    const frontText = document.getElementById('front').innerText;
    const backText = document.getElementById('back').innerText;
    const newCard = { front: frontText, back: backText };
    cardHistory.push(newCard);
    // Leeren der Eingabefelder für die nächste Karte
    document.getElementById('front').innerText = '';
    document.getElementById('back').innerText = '';
    // Aktualisieren des Kartenverlaufs
    updateCardHistoryDropdown();
}

// Die Funktion, um den Kartenverlauf im Dropdown-Menü anzuzeigen
function updateCardHistoryDropdown() {
    const dropdown = document.getElementById('cardHistoryDropdown');
    // Zuerst alle vorhandenen Optionen löschen
    dropdown.innerHTML = '';
    // Durchlaufen des Kartenverlaufs und Hinzufügen zur Dropdown-Liste
    cardHistory.forEach((card, index) => {
        const option = document.createElement('option');
        option.text = `Karte ${index + 1}`;
        dropdown.add(option);
    });
}

// Die Funktion, um die ausgewählte Karte anzuzeigen
function showSelectedCard() {
    const selectedIndex = document.getElementById('cardHistoryDropdown').selectedIndex;
    const selectedCard = cardHistory[selectedIndex];
    if (selectedCard) {
        document.getElementById('selectedFront').innerText = selectedCard.front;
        document.getElementById('selectedBack').innerText = selectedCard.back;
    }
}

// Hinzufügen eines Event Listeners für das Laden der Seite
window.onload = function() {
    updateCardHistoryDropdown();
};
