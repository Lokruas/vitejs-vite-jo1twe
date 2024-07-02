document.addEventListener("DOMContentLoaded", function () {
    let db;
    let request = indexedDB.open("memorifyDB", 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        let userStore = db.createObjectStore("users", { keyPath: "username" });
        userStore.createIndex("email", "email", { unique: true });
        let cardStore = db.createObjectStore("cards", { keyPath: "id", autoIncrement: true });
        cardStore.createIndex("username", "username", { unique: false });
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadNextCard();
    };

    request.onerror = function (event) {
        console.error("Database error: ", event.target.errorCode);
    };

    function loadNextCard() {
        let username = getCurrentUsername();
        let transaction = db.transaction(["cards"], "readonly");
        let cardStore = transaction.objectStore("cards");
        let index = cardStore.index("username");
        let cards = [];

        index.openCursor(username).onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                cards.push(cursor.value);
                cursor.continue();
            } else {
                if (cards.length > 0) {
                    let card = cards[Math.floor(Math.random() * cards.length)];
                    displayCard(card);
                } else {
                    document.getElementById("card-content").innerText = "No cards available.";
                }
            }
        };
    }

    function displayCard(card) {
        document.getElementById("card-content").innerText = card.question;
        document.getElementById("card").dataset.cardId = card.id;
        document.getElementById("show-answer-button").style.display = "block";
        document.getElementById("answer-options").style.display = "none";
    }

    window.showAnswer = function () {
        let cardId = document.getElementById("card").dataset.cardId;
        let transaction = db.transaction(["cards"], "readonly");
        let cardStore = transaction.objectStore("cards");
        let request = cardStore.get(parseInt(cardId));

        request.onsuccess = function (event) {
            let card = event.target.result;
            document.getElementById("card-content").innerText = card.answer;
            document.getElementById("show-answer-button").style.display = "none";
            document.getElementById("answer-options").style.display = "block";
        };
    };

    window.handleAnswer = function (difficulty) {
        let cardId = document.getElementById("card").dataset.cardId;
        let transaction = db.transaction(["cards"], "readonly");
        let cardStore = transaction.objectStore("cards");
        let request = cardStore.get(parseInt(cardId));

        request.onsuccess = function (event) {
            let card = event.target.result;
            card.difficulty = difficulty;
            saveCard(card);
        };
    };

    function saveCard(card) {
        let transaction = db.transaction(["cards"], "readwrite");
        let cardStore = transaction.objectStore("cards");
        let request = cardStore.put(card);

        request.onsuccess = function () {
            setTimeout(loadNextCard, getTimeout(card.difficulty));
        };
    }

    function getTimeout(difficulty) {
        switch (difficulty) {
            case "skip":
                return 0;
            case "dont_know":
                return 60000;
            case "partially_recalled":
                return 300000;
            case "stressful":
                return 600000;
            case "easy":
                return 1200000;
            default:
                return 0;
        }
    }

    function getCurrentUsername() {
        return localStorage.getItem("username");
    }
});
