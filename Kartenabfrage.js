const decks = {
    innovation: [
        { question: "Was ist Innovationsmanagement?", answer: "Die Verwaltung und Kontrolle von Innovationsprozessen." },
        { question: "Nennen Sie eine Methode des Projektmanagements.", answer: "Agiles Projektmanagement." },
    ],
    strategie: [
        { question: "Was ist eine SWOT-Analyse?", answer: "Ein strategisches Planungswerkzeug zur Bewertung von Stärken, Schwächen, Chancen und Risiken." },
        { question: "Was bedeutet 'Blue Ocean Strategy'?", answer: "Die Erschaffung eines neuen Marktraums ohne Konkurrenz." },
    ],
    webapp: [
        { question: "Was ist eine Web-Application?", answer: "Eine Software-Anwendung, die über einen Webbrowser bedient wird." },
        { question: "Nennen Sie ein Framework für Web-Apps.", answer: "React.js." },
    ]
};

let currentDeck = 'innovation';
let currentIndex = 0;
let currentCard = decks[currentDeck][currentIndex];

document.getElementById('deck-select').addEventListener('change', (e) => {
    currentDeck = e.target.value;
    currentIndex = 0;
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

function loadCard() {
    currentCard = decks[currentDeck][currentIndex];
    document.getElementById('question').innerText = currentCard.question;
    document.getElementById('answer').innerText = currentCard.answer;
    document.getElementById('answer').style.display = 'none';
}

function handleRating(value) {
    currentIndex = (currentIndex + 1) % decks[currentDeck].length;
    loadCard();
}

loadCard();
