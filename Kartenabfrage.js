document.addEventListener('DOMContentLoaded', function() {
    const cardContent = document.getElementById('card-content');
    const showAnswerButton = document.getElementById('show-answer');
    const answerButtons = document.getElementById('answer-buttons');
    const knowItButton = document.getElementById('know-it');
    const dontKnowItButton = document.getElementById('dont-know-it');

    let cards = [];
    let currentIndex = 0;
    let queue = [];

    // Funktion zum Laden der Karten aus der Datenbank
    async function loadCardsFromDatabase() {
        try {
            const response = await fetch('/api/cards');
            cards = await response.json();
            shuffleCards();
            loadCard();
        } catch (error) {
            console.error('Fehler beim Laden der Karten:', error);
        }
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function loadCard() {
        if (currentIndex >= cards.length) {
            currentIndex = 0;
            shuffleCards();
        }
        if (queue.length > 0) {
            cards.splice(currentIndex, 0, queue.shift());
        }
        cardContent.innerText = cards[currentIndex].front;
        showAnswerButton.style.display = 'block';
        answerButtons.style.display = 'none';
    }

    function showAnswer() {
        cardContent.innerText = cards[currentIndex].back;
        showAnswerButton.style.display = 'none';
        answerButtons.style.display = 'block';
    }

    function knowIt() {
        currentIndex++;
        loadCard();
    }

    function dontKnowIt() {
        queue.push(cards[currentIndex]);
        currentIndex++;
        loadCard();
    }

    showAnswerButton.addEventListener('click', showAnswer);
    knowItButton.addEventListener('click', knowIt);
    dontKnowItButton.addEventListener('click', dontKnowIt);

    loadCardsFromDatabase();
});
