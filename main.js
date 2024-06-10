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

unction updateCardHistory() {
    const dropdown = document.getElementById('cardHistoryDropdown');
    const tabView = document.querySelector('.tab-view');
    // Leeren der Dropdown-Liste und Tab-Ansicht, um Aktualisierungen vorzunehmen
    dropdown.innerHTML = '';
    tabView.innerHTML = '';
    // Durchlaufen des Kartenverlaufs und Hinzufügen zur Dropdown-Liste und Tab-Ansicht
    cardHistory.forEach((card, index) => {
        const option = document.createElement('option');
        option.text = `Karte ${index + 1}`;
        dropdown.add(option);
        
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

// Funktion zum Löschen einer Karte aus dem Verlauf
function deleteCard(index) {
    // Entfernen der Karte aus dem Kartenverlauf
    cardHistory.splice(index, 1);
    // Aktualisieren des Kartenverlaufs und Dropdown-Menüs
    updateCardHistory();
}

// Funktion zum Anzeigen der ausgewählten Karte
function showSelectedCard() {
    const selectedIndex = document.getElementById('cardHistoryDropdown').selectedIndex;
    const selectedCard = cardHistory[selectedIndex];
    if (selectedCard) {
        document.getElementById('selectedFront').innerText = selectedCard.front;
        document.getElementById('selectedBack').innerText = selectedCard.back;
    }
}

// Initialisierung des Kartenverlaufs und Dropdown-Menüs beim Laden der Seite
window.onload = function() {
    updateCardHistory();
};
}

// Hinzufügen eines Event Listeners für das Laden der Seite
window.onload = function() {
    updateCardHistoryDropdown();
};
