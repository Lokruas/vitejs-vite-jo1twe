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

let currentDeck = '';
let currentSubDeck = 'all';
let cardQueue = [];
let currentIndex = 0;
let initialCardCount = 0;

document.getElementById('deck-select').addEventListener('change', (e) => {
    currentDeck = e.target.value;
    if (currentDeck) {
        updateSubDeckOptions(currentDeck);
        document.getElementById('prompt').style.display = 'none';
        loadCards();
        updateCardHistory();
    } else {
        document.getElementById('subdeck-select').style.display = 'none';
        document.querySelector('.card').style.display = 'none';
        document.querySelector('.buttons').style.display = 'none';
        document.querySelector('.completion-message').style.display = 'none';
        document.getElementById('prompt').style.display = 'block';
        document.getElementById('counter').innerText = 'Stapel: - Karten übrig';
    }
});

document.getElementById('subdeck-select').addEventListener('change', (e) => {
    currentSubDeck = e.target.value;
    document.getElementById('prompt').style.display = 'none';
    loadCards();
    updateCardHistory();
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
    resetProgress();
});

document.getElementById('reset-progress').addEventListener('click', () => {
    resetProgress();
});

document.getElementById('add-card').addEventListener('click', () => {
    addCard();
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
    currentIndex = 0;
    if (cardQueue.length > 0) {
        displayNextCard();
    } else {
        displayCompletionMessage();
    }
    updateCounter();
    updatePath();
}

function displayNextCard() {
    if (currentIndex < cardQueue.length) {
        document.getElementById('question').innerText = cardQueue[currentIndex].question;
        document.getElementById('answer').innerText = cardQueue[currentIndex].answer;
        document.getElementById('question').style.display = 'block';
        document.getElementById('answer').style.display = 'none';
        document.getElementById('show-answer').style.display = 'block';
        document.querySelector('.buttons').style.display = 'none';
        document.querySelector('.completion-message').style.display = 'none';
    } else {
        displayCompletionMessage();
    }
}

function handleRating(rating) {
    currentIndex++;
    if (currentIndex < cardQueue.length) {
        displayNextCard();
    } else {
        displayCompletionMessage();
    }
}

function displayCompletionMessage() {
    document.querySelector('.completion-message').style.display = 'block';
    document.getElementById('question').style.display = 'none';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('show-answer').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    updateCounter();
}

function resetProgress() {
    loadCards();
    updateCardHistory();
}

function addCard() {
    const question = document.getElementById('new-question').value;
    const answer = document.getElementById('new-answer').value;
    if (question && answer) {
        const newCard = { question, answer };
        decks[currentDeck][currentSubDeck].push(newCard);
        loadCards();
        updateCardHistory();
        document.getElementById('new-question').value = '';
        document.getElementById('new-answer').value = '';
    }
}

function updateCardHistory() {
    const historyContainer = document.getElementById('card-history-container');
    historyContainer.innerHTML = '';
    decks[currentDeck][currentSubDeck].forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card-history-item');
        cardElement.innerHTML = `
            <div><strong>Frage:</strong> ${card.question}</div>
            <div><strong>Antwort:</strong> ${card.answer}</div>
        `;
        historyContainer.appendChild(cardElement);
    });
}
