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
    updateCardHistory();
}

// Die Funktion, um den Kartenverlauf anzuzeigen
function updateCardHistory() {
    const tabView = document.querySelector('.tab-view');
    // Leeren des Inhalts, um Aktualisierungen zu vermeiden
    tabView.innerHTML = '';
    // Durchlaufen des Kartenverlaufs und Hinzufügen zur Ansicht
    cardHistory.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card-history');
        cardDiv.textContent = `Karte ${index + 1}: Frage - ${card.front}, Antwort - ${card.back}`;

        // Lösch-Schaltfläche erstellen
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteCard(index);
        });

        cardDiv.appendChild(deleteButton);
        tabView.appendChild(cardDiv);
    });
}

// Die Funktion, um eine Karte aus dem Verlauf zu löschen
function deleteCard(index) {
    // Entfernen der Karte aus dem Kartenverlauf
    cardHistory.splice(index, 1);
    // Aktualisieren des Kartenverlaufs
    updateCardHistory();
}
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
