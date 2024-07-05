document.addEventListener('DOMContentLoaded', function() {
    const cardContent = document.getElementById('card-content');
    const showAnswerButton = document.getElementById('show-answer');
    const answerButtons = document.getElementById('answer-buttons');
    const knowItButton = document.getElementById('know-it');
    const dontKnowItButton = document.getElementById('dont-know-it');

    let cards = [
        { front: "Frage 1", back: "Antwort 1" },
        { front: "Frage 2", back: "Antwort 2" },
        { front: "Frage 3", back: "Antwort 3" }
    ];
    let currentIndex = 0;
    let queue = [];

    function loadCard() {
        if (currentIndex >= cards.length) {
            currentIndex = 0;
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

    loadCard();
});
