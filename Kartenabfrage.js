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
let cardQueue = [...decks[currentDeck][currentSubDeck]];
let initialCardCount = cardQueue.length;

document.getElementById('deck-select').addEventListener('change', (e) => {
    currentDeck = e.target.value;
    updateSubDeckOptions();
    document.getElementById('subdeck-dropdown').style.display = 'block';
});

document.getElementById('subdeck-select').addEventListener('change', (e) => {
    currentSubDeck = e.target.value;
    updatePath();
    currentIndex = 0;
    cardQueue = [...decks[currentDeck][currentSubDeck]];
    initialCardCount = cardQueue.length;
    updateCounter();
    loadCard();
});

document.getElementById('show-answer').addEventListener('click', () => {
    document.getElementById('answer').style.display = 'block';
    document.getElementById('show-answer').style.display = 'none';
    document.querySelector('.buttons').style.display = 'flex';
});

document.querySelectorAll('.rating').forEach(button => {
    button.addEventListener('click', (e) => {
        handleRating(e.target.dataset.value);
    });
});

document.getElementById('repeat-deck').addEventListener('click', () => {
    cardQueue = [...decks[currentDeck][currentSubDeck]];
    initialCardCount = cardQueue.length;
    currentIndex = 0;
    updateCounter();
    loadCard();
    document.querySelector('.completion-message').style.display = 'none';
});

function updateSubDeckOptions() {
    const subDeckSelect = document.getElementById('subdeck-select');
    subDeckSelect.innerHTML = '<option value="all">Ganzen Stapel lernen</option>';
    for (const subDeck in decks[currentDeck]) {
        if (subDeck !== 'all') {
            const option = document.createElement('option');
            option.value = subDeck;
            option.innerText = subDeck.charAt(0).toUpperCase() + subDeck.slice(1);
            subDeckSelect.appendChild(option);
        }
    }
}

function updatePath() {
    document.getElementById('path').innerText = `Pfad: ${currentDeck} > ${currentSubDeck}`;
}

function updateCounter() {
    document.getElementById('counter').innerText = `Stapel: ${cardQueue.length} Karten übrig`;
}

function loadCard() {
    if (cardQueue.length === 0) {
        document.getElementById('question').innerText = 'Keine Karten mehr übrig';
        document.getElementById('answer').innerText = '';
        document.getElementById('show-answer').style.display = 'none';
        document.querySelector('.buttons').style.display = 'none';
        document.querySelector('.completion-message').style.display = 'block';
    } else {
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
        if (rating === 'easy') {
            cardQueue.push(card);
        } else {
            cardQueue.splice(currentIndex + 1, 0, card);
        }
        initialCardCount--;
    }
    updateCounter();
    loadCard();
}

// Initialisierung
updateSubDeckOptions();
updatePath();
updateCounter();
loadCard();
