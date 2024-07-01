<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karten Erstellen</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        #cardContainer {
            display: flex;
            justify-content: space-between;
            margin: 20px;
        }

        .card {
            width: 45%;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .card-side {
            width: 100%;
            height: 200px;
            border: 1px solid #ddd;
            padding: 10px;
            box-sizing: border-box;
            overflow: auto;
        }

        .card-side.placeholder {
            color: #aaa;
        }

        #toolbar {
            margin: 20px;
        }

        .history-card {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border: 1px solid #ccc;
            margin: 5px 0;
        }
    </style>
</head>

<body>
    <div id="toolbar">
        <button onclick="execCmd('bold')"><b>Bold</b></button>
        <button onclick="execCmd('italic')"><i>Italic</i></button>
        <button onclick="execCmd('underline')"><u>Underline</u></button>
        <button onclick="execCmd('insertOrderedList')">Numbered List</button>
        <button onclick="execCmd('insertUnorderedList')">Bulleted List</button>
        <button onclick="execCmd('justifyLeft')">Align Left</button>
        <button onclick="execCmd('justifyCenter')">Align Center</button>
        <button onclick="execCmd('justifyRight')">Align Right</button>
        <button onclick="toggleDrawMode()">Draw</button>
        <button onclick="toggleEraserMode()">Eraser</button>
        <input type="color" id="colorSelector" />
        <button onclick="addCard()">Add Card</button>
    </div>

    <div id="cardContainer">
        <div class="card">
            <div contenteditable="true" class="card-side" id="front" data-placeholder="Front side..."></div>
            <canvas id="frontCanvas"></canvas>
        </div>
        <div class="card">
            <div contenteditable="true" class="card-side" id="back" data-placeholder="Back side..."></div>
            <canvas id="backCanvas"></canvas>
        </div>
    </div>

    <div class="history-scroll-container"></div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const cardSides = document.querySelectorAll('.card-side');
            cardSides.forEach(side => {
                side.addEventListener('focus', removePlaceholder);
                side.addEventListener('blur', addPlaceholder);
            });

            const frontCanvas = document.getElementById('frontCanvas');
            const backCanvas = document.getElementById('backCanvas');
            const frontCtx = frontCanvas.getContext('2d');
            const backCtx = backCanvas.getContext('2d');
            let isDrawing = false;
            let drawColor = 'black';
            let currentCanvas = null;
            let currentCtx = null;
            let history = [];
            let db;

            // Setze das aktuelle Canvas basierend auf dem Fokus
            document.getElementById('front').addEventListener('focus', () => {
                currentCanvas = frontCanvas;
                currentCtx = frontCtx;
            });

            document.getElementById('back').addEventListener('focus', () => {
                currentCanvas = backCanvas;
                currentCtx = backCtx;
            });

            // Initialisieren der Canvas zum Zeichnen
            [frontCanvas, backCanvas].forEach(canvas => {
                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', draw);
                canvas.addEventListener('mouseup', stopDrawing);
                canvas.addEventListener('mouseout', stopDrawing);
            });
            resizeCanvases();

            document.getElementById('colorSelector').addEventListener('input', function () {
                changeDrawColor(this.value);
            });

            window.addEventListener('beforeunload', saveHistory); // Historie beim Verlassen der Seite speichern

            // IndexedDB initialisieren
            initializeIndexedDB();

            // Toolbar-Buttons initialisieren
            initializeToolbarButtons();

            // Funktionen für das Zeichnen
            function startDrawing(event) {
                if (currentCanvas && drawMode) {
                    isDrawing = true;
                    currentCtx.strokeStyle = drawColor;
                    currentCtx.lineWidth = 2; // Linienbreite für das Zeichnen
                    currentCtx.lineCap = 'round'; // Linienstil
                    currentCtx.beginPath();
                    const rect = currentCanvas.getBoundingClientRect();
                    currentCtx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
                }
            }

            function draw(event) {
                if (isDrawing) {
                    const rect = currentCanvas.getBoundingClientRect();
                    currentCtx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
                    currentCtx.stroke();
                }
            }

            function stopDrawing() {
                if (isDrawing) {
                    isDrawing = false;
                    currentCtx.closePath();
                }
            }

            function resizeCanvases() {
                const frontContainer = document.getElementById('frontContainer');
                const backContainer = document.getElementById('backContainer');
                [frontCanvas, backCanvas].forEach((canvas, index) => {
                    const container = index === 0 ? frontContainer : backContainer;
                    canvas.width = container.offsetWidth;
                    canvas.height = container.offsetHeight;
                });
            }

            function changeDrawColor(color) {
                drawColor = color;
            }

            let drawMode = false;
            function toggleDrawMode() {
                drawMode = !drawMode;
                frontCanvas.style.pointerEvents = drawMode ? 'auto' : 'none';
                backCanvas.style.pointerEvents = drawMode ? 'auto' : 'none';
            }

            function toggleEraserMode() {
                isErasing = !isErasing;
                frontCanvas.style.pointerEvents = isErasing ? 'auto' : 'none';
                backCanvas.style.pointerEvents = isErasing ? 'auto' : 'none';
                drawMode = false;
            }

            // HTML-Funktionen
            function execCmd(command, value = null) {
                document.execCommand(command, false, value);
            }

            function addCard() {
                const frontContent = document.getElementById('front').innerHTML;
                const backContent = document.getElementById('back').innerHTML;
                const frontImageData = frontCanvas.toDataURL();
                const backImageData = backCanvas.toDataURL();

                let newCard = {
                    id: Date.now(),
                    userId: getCurrentUserId(),
                    front: frontContent,
                    back: backContent,
                    frontImage: frontImageData,
                    backImage: backImageData
                };

                saveCardToIndexedDB(newCard);
            }

            function removePlaceholder() {
                const placeholder = this.dataset.placeholder;
                if (this.innerHTML.trim() === placeholder) {
                    this.innerHTML = '';
                    this.classList.remove('placeholder');
                }
            }

            function addPlaceholder() {
                const placeholder = this.dataset.placeholder;
                if (this.innerHTML.trim() === '') {
                    this.innerHTML = placeholder;
                    this.classList.add('placeholder');
                }
            }

            function saveHistory() {
                localStorage.setItem('cardHistory', JSON.stringify(history));
            }

            function loadHistory() {
                const savedHistory = localStorage.getItem('cardHistory');
                if (savedHistory) {
                    history = JSON.parse(savedHistory);
                    renderHistory();
                }
            }

            function renderHistory() {
                const historyContainer = document.querySelector('.history-scroll-container');
                historyContainer.innerHTML = ''; // Vorherige Historie löschen

                history.forEach((card, index) => {
                    let historyCard = document.createElement('div');
                    historyCard.classList.add('history-card');
                    historyCard.innerHTML = `
                        <div class="history-content">
                            <p>Card ${index + 1}</p>
                        </div>
                        <button class="delete-button" onclick="deleteHistoryCard(${index})">x</button>
                    `;
                    historyCard.addEventListener('click', () => loadCardFromHistory(index));
                    historyContainer.appendChild(historyCard);
                });
            }

            function loadCardFromHistory(index) {
                const card = history[index];
                document.getElementById('front').innerHTML = card.front;
                document.getElementById('back').innerHTML = card.back;
                loadCanvasImage(frontCanvas, card.frontImage);
                loadCanvasImage(backCanvas, card.backImage);
            }

            function loadCanvasImage(canvas, dataUrl) {
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = function () {
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas löschen
                    ctx.drawImage(img, 0, 0);
                };
                img.src = dataUrl;
            }

            function deleteHistoryCard(index) {
                history.splice(index, 1);
                renderHistory();
                saveHistory();
            }

            // IndexedDB Funktionen
            function initializeIndexedDB() {
                const request = indexedDB.open('cardsDatabase', 1);

                request.onerror = function (event) {
                    console.error('IndexedDB error:', event.target.errorCode);
                };

                request.onsuccess = function (event) {
                    db = event.target.result;
                    loadUserCards(); // Karten des aktuellen Nutzers laden
                };

                request.onupgradeneeded = function (event) {
                    db = event.target.result;
                    const objectStore = db.createObjectStore('cards', { keyPath: 'id' });
                    objectStore.createIndex('userId', 'userId', { unique: false });
                };
            }

            function saveCardToIndexedDB(card) {
                const transaction = db.transaction(['cards'], 'readwrite');
                const objectStore = transaction.objectStore('cards');
                const request = objectStore.add(card);

                request.onsuccess = function (event) {
                    history.push(card); // Karte zur Historie hinzufügen
                    renderHistory(); // Historie rendern
                    saveHistory(); // Historie speichern
                };

                request.onerror = function (event) {
                    console.error('IndexedDB error:', event.target.errorCode);
                };
            }

            function loadUserCards() {
                const transaction = db.transaction(['cards'], 'readonly');
                const objectStore = transaction.objectStore('cards');
                const userIdIndex = objectStore.index('userId');
                let currentUserId = getCurrentUserId();

                let request = userIdIndex.getAll(IDBKeyRange.only(currentUserId));

                request.onsuccess = function (event) {
                    let userCards = event.target.result;
                    history = userCards; // Karten des aktuellen Nutzers zur Historie hinzufügen
                    renderHistory(); // Historie rendern
                    saveHistory(); // Historie speichern
                };

                request.onerror = function (event) {
                    console.error('IndexedDB error:', event.target.errorCode);
                };
            }

            function getCurrentUserId() {
                // Ersetzen Sie dies durch Ihre eigene Logik zur Ermittlung der Benutzer-ID
                // Beispielsweise können Sie die Benutzer-ID aus einem Token oder einer Session abrufen
                return 'currentUserId';
            }

            function initializeToolbarButtons() {
                document.getElementById('addCardBtn').addEventListener('click', addCard);
            }

            window.toggleDrawMode = toggleDrawMode; // Globale Funktion
            window.toggleEraserMode = toggleEraserMode; // Globale Funktion
            window.deleteHistoryCard = deleteHistoryCard; // Globale Funktion
        });
    </script>
</body>

</html>
