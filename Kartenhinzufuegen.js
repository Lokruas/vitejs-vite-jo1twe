document.addEventListener('DOMContentLoaded', function () {
    const cardSides = document.querySelectorAll('.card-side');
    cardSides.forEach(side => {
        side.addEventListener('focus', removePlaceholder);
        side.addEventListener('blur', addPlaceholder);
    });

    loadHistory(); // Historie beim Laden der Seite laden
    window.addEventListener('beforeunload', saveHistory); // Historie beim Verlassen der Seite speichern
});

// Funktion um Platzhalter zu entfernen
function removePlaceholder(event) {
    const target = event.target;
    if (target.textContent === target.dataset.placeholder) {
        target.classList.remove('placeholder');
        target.textContent = '';
    }
}

// Funktion um Platzhalter hinzuzufügen
function addPlaceholder(event) {
    const target = event.target;
    if (target.textContent === '') {
        target.classList.add('placeholder');
        target.textContent = target.dataset.placeholder;
    }
}

// Funktion um eine Karte hinzuzufügen
function addCard() {
    const frontContent = document.getElementById('front').innerHTML;
    const backContent = document.getElementById('back').innerHTML;

    let newCard = {
        front: frontContent,
        back: backContent
    };

    history.unshift(newCard); // Neue Karte zur Historie hinzufügen
    renderHistory(); // Historie rendern

    // Inhalt der Textfelder zurücksetzen
    document.getElementById('front').innerHTML = '';
    document.getElementById('back').innerHTML = '';
}

// Funktion um die Historie zu rendern
function renderHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';
    history.forEach((entry, index) => {
        const historyCard = document.createElement('div');
        historyCard.className = 'history-card';
        historyCard.innerHTML = `
            <div><strong>Karte ${index + 1}</strong></div>
            <div class="front-preview">${entry.front}</div>
            <button class="delete-button" onclick="deleteCard(event, this)">×</button>
        `;
        historyCard.onclick = function() {
            document.getElementById('front').innerHTML = entry.front;
            document.getElementById('back').innerHTML = entry.back;
            checkPlaceholders();
        };

        historyContainer.appendChild(historyCard);
    });

    updateHistoryScroll();
    updateHistoryVisibility();
}

// Funktion um Karten zu löschen
function deleteCard(event, button) {
    event.stopPropagation();
    const confirmed = confirm('Möchten Sie diese Karte wirklich löschen?');
    if (confirmed) {
        const cardIndex = Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement);
        history.splice(cardIndex, 1);
        renderHistory();
    }
}

// Funktion um die Sichtbarkeit der Historie zu aktualisieren
function updateHistoryVisibility() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.style.display = history.length > 0 ? 'flex' : 'none';
}

// Funktion um das Scrollen der Historie zu aktualisieren
function updateHistoryScroll() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.scrollTop = 0;
}

// Funktion um die Historie zu speichern
function saveHistory() {
    localStorage.setItem('cardHistory', JSON.stringify(history));
}

// Funktion um die Historie zu laden
function loadHistory() {
    const storedHistory = localStorage.getItem('cardHistory');
    if (storedHistory) {
        history = JSON.parse(storedHistory);
        renderHistory();
    }
}

// Funktion um die Substapel-Optionen zu aktualisieren
function updateSubstackOptions() {
    const stackSelect = document.getElementById('stackSelect');
    const substackSelect = document.getElementById('substackSelect');
    substackSelect.innerHTML = ''; // Alte Optionen löschen

    switch (stackSelect.value) {
        case 'innovation':
            substackSelect.style.display = 'inline-block';
            addSubstackOption('Innovationsmanagement');
            addSubstackOption('Projektentwicklung');
            break;
        case 'strategie':
            substackSelect.style.display = 'inline-block';
            addSubstackOption('Geschäftsstrategie');
            addSubstackOption('Marktanalyse');
            break;
        case 'webapp':
            substackSelect.style.display = 'inline-block';
            addSubstackOption('Frontend-Entwicklung');
            addSubstackOption('Backend-Entwicklung');
            break;
        default:
            substackSelect.style.display = 'none';
            break;
    }
}

// Funktion um Substapel-Optionen hinzuzufügen
function addSubstackOption(text) {
    const option = document.createElement('option');
    option.value = text.toLowerCase().replace(/\s+/g, '');
    option.text = text;
    document.getElementById('substackSelect').appendChild(option);
}

// Funktion um Platzhalter zu überprüfen
function checkPlaceholders() {
    const front = document.getElementById('front');
    const back = document.getElementById('back');

    if (front.textContent === '') {
        front.classList.add('placeholder');
        front.textContent = front.dataset.placeholder;
    }

    if (back.textContent === '') {
        back.classList.add('placeholder');
        back.textContent = back.dataset.placeholder;
    }
}

// Initialisierung
let history = [];
