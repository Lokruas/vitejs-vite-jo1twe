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
let cardQueue = [];
let initialCardCount = 0;

document.getElementById('deck-select').addEventListener('change', (e) => {
    const value = e.target.value;
    if (value) {
        updateSubDeckOptions(value);
    } else {
        document.getElementById('subdeck-select').style.display = 'none';
    }
});

document.getElementById('subdeck-select').addEventListener('change', (e) => {
    currentSubDeck = e.target.value;
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
    document.querySelector('.card').style.display = 'block';
});

document.getElementById('reset-progress').addEventListener('click', () => {
    cardQueue = [...decks[currentDeck][currentSubDeck]];
    initialCardCount = cardQueue.length;
    updateCounter();
    loadCard();
});

function updateSubDeckOptions(deck) {
    currentDeck = deck;
    currentSubDeck = 'all';
    const subdeckSelect = document.getElementById('subdeck-select');
    subdeckSelect.innerHTML = `
        <option value="all">Ganzen Stapel lernen</option>
        <option value="unterstapel1">Unterstapel 1</option>
        <option value="unterstapel2">Unterstapel 2</option>
    `;
    subdeckSelect.style.display = 'block';
    updatePath();
}

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
        document.getElementById('question').innerText = '';
        document.getElementById('answer').innerText = '';
        document.querySelector('.card').style.display = 'none';
        document.querySelector('.buttons').style.display = 'none';
        document.querySelector('.completion-message').style.display = 'block';
    } else {
        document.querySelector('.card').style.display = 'block';
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
    if (initialCardCount === 0) {
        document.getElementById('counter').innerText = `Stapel: ${initialCardCount} Karten übrig`;
        document.querySelector('.completion-message').style.display = 'block';
        document.querySelector('.card').style.display = 'none';
    } else {
        updateCounter();
        loadCard();
    }
}

// Initialisierung
updateSubDeckOptions(currentDeck);
updatePath();
updateCounter();
loadCard();
