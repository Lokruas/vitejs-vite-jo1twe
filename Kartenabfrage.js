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

document.getElementById('deck-select').addEventListener('change', (e) => {
    currentDeck = e.target.value;
    updateSubDeckOptions();
    currentSubDeck = 'all';
    updatePath();
    currentIndex = 0;
    cardQueue = [...decks[currentDeck][currentSubDeck]];
    updateCounter();
    loadCard();
});

document.getElementById('subdeck-select').addEventListener('change', (e) => {
    currentSubDeck = e.target.value;
    updatePath();
    currentIndex = 0;
    cardQueue = [...decks[currentDeck][currentSubDeck]];
    updateCounter();
    loadCard();
});

document.getElementById('show-answer').addEventListener('click', () => {
    document.getElementById('answer').style.display = 'block';
});

document.querySelectorAll('.rating').forEach(button => {
    button.addEventListener('click', (e) => {
        handleRating(e.target.dataset.value);
    });
});

function updateSubDeckOptions() {
    const subDeckSelect = document.getElementById('subdeck-select');
    subDeckSelect.innerHTML = `<option value="all">Ganzen Stapel lernen</option>`;
    const subDecks = Object.keys(decks[currentDeck]);
    subDecks.forEach(subDeck => {
        if (subDeck !== 'all') {
            const option = document.createElement('option');
            option.value = subDeck;
            option.innerText = `Unterstapel ${subDeck}`;
            subDeckSelect.appendChild(option);
        }
    });
}

function updatePath() {
    const path = `Pfad: ${currentDeck} > ${currentSubDeck === 'all' ? 'Ganzen Stapel lernen' : `Unterstapel ${currentSubDeck}`}`;
    document.getElementById('path').innerText = path;
}

function updateCounter() {
    const counter = `Stapel: ${cardQueue.length} Karten übrig`;
    document.getElementById('counter').innerText = counter;
}

function loadCard() {
    if (cardQueue.length === 0) {
        document.getElementById('question').innerText = 'Keine Karten mehr übrig!';
        document.getElementById('answer').innerText = '';
        document.getElementById('answer').style.display = 'none';
        return;
    }
    const currentCard = cardQueue[currentIndex];
    document.getElementById('question').innerText = currentCard.question;
    document.getElementById('answer').innerText = currentCard.answer;
    document.getElementById('answer').style.display = 'none';
}

function handleRating(value) {
    if (value !== 'easy') {
        cardQueue.push(cardQueue.splice(currentIndex, 1)[0]);
    } else {
        cardQueue.splice(currentIndex, 1);
    }
    currentIndex = 0;
    updateCounter();
    loadCard();
}

updateSubDeckOptions();
updatePath();
updateCounter();
loadCard();
