const decks = {
    innovation: {
        all: [
            { question: "Was ist Innovationsmanagement?", answer: "Die Verwaltung und Kontrolle von Innovationsprozessen." },
            { question: "Nennen Sie eine Methode des Projektmanagements.", answer: "Agiles Projektmanagement." }
        ],
        unterstapel1: [
            { question: "Was ist Innovationsmanagement?", answer: "Die Verwaltung und Kontrolle von Innovationsprozessen." }
        ],
        unterstapel2: [
            { question: "Nennen Sie eine Methode des Projektmanagements.", answer: "Agiles Projektmanagement." }
        ]
    },
    strategie: {
        all: [
            { question: "Was ist eine SWOT-Analyse?", answer: "Ein strategisches Planungswerkzeug zur Bewertung von Stärken, Schwächen, Chancen und Risiken." },
            { question: "Was bedeutet 'Blue Ocean Strategy'?", answer: "Die Erschaffung eines neuen Marktraums ohne Konkurrenz." }
        ],
        unterstapel1: [
            { question: "Was ist eine SWOT-Analyse?", answer: "Ein strategisches Planungswerkzeug zur Bewertung von Stärken, Schwächen, Chancen und Risiken." }
        ],
        unterstapel2: [
            { question: "Was bedeutet 'Blue Ocean Strategy'?", answer: "Die Erschaffung eines neuen Marktraums ohne Konkurrenz." }
        ]
    },
    webapp: {
        all: [
            { question: "Was ist eine Web-Application?", answer: "Eine Software-Anwendung, die über einen Webbrowser bedient wird." },
            { question: "Nennen Sie ein Framework für Web-Apps.", answer: "React.js." }
        ],
        unterstapel1: [
            { question: "Was ist eine Web-Application?", answer: "Eine Software-Anwendung, die über einen Webbrowser bedient wird." }
        ],
        unterstapel2: [
            { question: "Nennen Sie ein Framework für Web-Apps.", answer: "React.js." }
        ]
    }
};

let currentDeck = 'innovation';
let currentSubDeck = 'all';
let currentIndex = 0;
let cardQueue = [];
let initialCardCount = 0;

document.getElementById('deck-select').addEventListener('change', (e) => {
    const value = e.target.value;
    if (value) {
        updateSubDeckOptions(value);
    }
});

function updateSubDeckOptions(deck) {
    const subDeckOptions = Object.keys(decks[deck]).filter(subDeck => subDeck !== 'all');
    const subDeckSelect = document.getElementById('deck-select');

    // Entferne alte Unterstapeloptionen
    const options = subDeckSelect.options;
    for (let i = options.length - 1; i >= 0; i--) {
        if (options[i].classList.contains('subdeck')) {
            subDeckSelect.remove(i);
        }
    }

    // Füge neue Unterstapeloptionen hinzu
    subDeckOptions.forEach(subDeck => {
        const option = document.createElement('option');
        option.value = subDeck;
        option.innerText = `${deck} - ${subDeck}`;
        option.classList.add('subdeck');
        subDeckSelect.appendChild(option);
    });

    currentDeck = deck;
    currentSubDeck = 'all';
    updatePath();
    loadCards();
}

document.getElementById('deck-select').addEventListener('change', (e) => {
    const selectedOption = e.target.selectedOptions[0];
    if (selectedOption.classList.contains('subdeck')) {
        currentSubDeck = selectedOption.value;
    } else {
        currentSubDeck = 'all';
    }
    updatePath();
    loadCards();
});

document.getElementById('show-answer').addEventListener('click', () => {
    document.getElementById('answer').style.display = 'block';
    document.getElementById('show-answer').style.display = 'none';
    document.querySelector('.buttons').style.display = 'flex';
});

document.querySelectorAll('.rating').forEach(button => {
    button.addEventListener('click', (e) => {
        handleRating(e.target.getAttribute('data-value'));
    });
});

document.getElementById('repeat-deck').addEventListener('click', () => {
    cardQueue = [...decks[currentDeck][currentSubDeck]];
    initialCardCount = cardQueue.length;
    updateCounter();
    loadCard();
    document.querySelector('.completion-message').style.display = 'none';
});

function updatePath() {
    document.getElementById('path').innerText = `Pfad: ${currentDeck} > ${currentSubDeck}`;
}

function updateCounter() {
    document.getElementById('counter').innerText = `Stapel: ${initialCardCount} Karten übrig`;
}

function loadCards() {
    cardQueue = [...decks[currentDeck][currentSubDeck]];
    initialCardCount = cardQueue.length;
    updateCounter();
    loadCard();
}

function loadCard() {
    if (cardQueue.length === 0) {
        document.getElementById('question').innerText = 'Keine Karten mehr übrig';
        document.getElementById('answer').innerText = '';
        document.getElementById('show-answer').style.display = 'none';
        document.querySelector('.buttons').style.display = 'none';
        document.querySelector('.completion-message').style.display = 'block';
    } else {
        currentIndex = 0;
        document.getElementById('question').innerText = cardQueue[currentIndex].question;
        document.getElementById('answer').innerText = cardQueue[currentIndex].answer;
        document.getElementById('answer').style.display = 'none';
        document.getElementById('show-answer').style.display = 'block';
        document.querySelector('.buttons').style.display = 'none';
    }
}

function handleRating(rating) {
    const card = cardQueue.splice(currentIndex, 1)[0];
    if (rating === 'skip' || rating === 'dontknow') {
        cardQueue.push(card);
    } else {
        initialCardCount--;
        if (rating === 'easy') {
            cardQueue.push(card);
        } else {
            cardQueue.splice(currentIndex + 1, 0, card);
        }
    }
    updateCounter();
    loadCard();
}

// Initialisierung
updateSubDeckOptions(currentDeck);
updatePath();
updateCounter();
loadCard();
