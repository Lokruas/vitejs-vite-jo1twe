document.addEventListener("DOMContentLoaded", function() {
    let db;
    let request = indexedDB.open("memorifyDB", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        let cardStore = db.createObjectStore("cards", { keyPath: "id", autoIncrement: true });
        cardStore.createIndex("username", "username", { unique: false });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadCards();
    };

    request.onerror = function(event) {
        console.error("Database error: ", event.target.errorCode);
    };

    const cardFront = document.getElementById("card-front");
    const cardBack = document.getElementById("card-back");
    const showAnswerButton = document.getElementById("show-answer");

    let cards = [];
    let currentCardIndex = -1;

    function loadCards() {
        let transaction = db.transaction(["cards"], "readonly");
        let cardStore = transaction.objectStore("cards");
        let username = getCurrentUsername();
        let index = cardStore.index("username");
        let request = index.getAll(username);

        request.onsuccess = function(event) {
            cards = event.target.result;
            nextCard();
        };

        request.onerror = function(event) {
            console.error("Error loading cards: ", event.target.error);
        };
    }

    function getCurrentUsername() {
        return localStorage.getItem("username");
    }

    function nextCard() {
        if (cards.length === 0) {
            cardFront.textContent = "Keine Karten verfügbar.";
            cardBack.textContent = "";
            showAnswerButton.style.display = "none";
            return;
        }

        currentCardIndex = Math.floor(Math.random() * cards.length);
        cardFront.textContent = cards[currentCardIndex].question;
        cardBack.textContent = cards[currentCardIndex].answer;
        cardFront.style.display = "block";
        cardBack.style.display = "none";
        showAnswerButton.style.display = "block";
    }

    window.showAnswer = function() {
        cardFront.style.display = "none";
        cardBack.style.display = "block";
        showAnswerButton.style.display = "none";
    }

    window.rateCard = function(rating) {
        let currentCard = cards[currentCardIndex];
        currentCard.rating = rating;
        currentCard.timestamp = Date.now();
        updateCard(currentCard);
        nextCard();
    }

    function updateCard(card) {
        let transaction = db.transaction(["cards"], "readwrite");
        let cardStore = transaction.objectStore("cards");
        cardStore.put(card);
    }
});
