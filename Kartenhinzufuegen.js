// Dummy-Fragen
const dummyQuestions = {
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

// Funktion um Dummy-Fragen zu laden
function loadDummyQuestions() {
    const stackSelect = document.getElementById('stackSelect').value;
    const substackSelect = document.getElementById('substackSelect').value;

    let questionsToLoad = [];

    if (stackSelect && dummyQuestions[stackSelect]) {
        questionsToLoad = dummyQuestions[stackSelect].all;
        if (substackSelect && dummyQuestions[stackSelect][substackSelect]) {
            questionsToLoad = dummyQuestions[stackSelect][substackSelect];
        }
    }

    history = questionsToLoad.map(question => ({
        front: question.question,
        back: question.answer
    }));

    renderHistory();
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

// Funktion um Karten aus der Historie zu löschen
function deleteCard(event, button) {
    event.stopPropagation();
    const index = Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement);
    history.splice(index, 1);
    renderHistory();
}

// Funktion um die Historie zu rendern
function renderHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';
    history.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('history-card');
        cardElement.innerHTML = `
            <div class="front-preview">${card.front}</div>
            <button class="delete-button" onclick="deleteCard(event, this)">×</button>
        `;
        historyContainer.appendChild(cardElement);
    });
    updateHistoryVisibility();
    updateHistoryScroll();
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

    loadDummyQuestions(); // Dummy-Fragen je nach Stapel laden
}

// Funktion um Substapel-Optionen hinzuzufügen
function addSubstackOption(text) {
    const option = document.createElement('option');
    option.value = text.toLowerCase().replace(/\s+/g, '');
    option.text = text;
    document.getElementById('substackSelect').appendChild(option);
}

// Initialisierung
let history = [];
