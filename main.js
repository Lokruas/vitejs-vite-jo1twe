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

    document.getElementById('colorSelector').addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            changeDrawColor(event.target.style.backgroundColor);
        }
    });

    document.getElementById('imageUpload').addEventListener('change', function () {
        uploadImages(this);
    });

    loadHistory(); // Historie beim Laden der Seite laden
    window.addEventListener('beforeunload', saveHistory); // Historie beim Verlassen der Seite speichern

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

        let newCard = {
            front: frontContent,
            back: backContent
        };

        history.unshift(newCard); // Neue Karte zur Historie hinzufügen
        renderHistory(); // Historie rendern

        // Inhalt der Textfelder zurücksetzen
        document.getElementById('front').innerHTML = '';
        document.getElementById('back').innerHTML = '';
    }

    function renderHistory() {
        const historyContainer = document.getElementById('historyContainer');
        historyContainer.innerHTML = '';
        history.forEach((entry, index) => {
            const historyCard = document.createElement('div');
            historyCard.className = 'history-card';
            historyCard.innerHTML = `
                <div><strong>Karte ${index + 1}</strong></div>
                <div class="front-preview">${entry.front}</div>
                <button class="delete-button" onclick="deleteCard(event, this)">×</button>
            `;
            historyCard.onclick = function() {
                document.getElementById('front').innerHTML = entry.front;
                document.getElementById('back').innerHTML = entry.back;
                checkPlaceholders();
            };
            historyContainer.appendChild(historyCard);
        });

        updateHistoryScroll();
        updateHistoryVisibility();
    }

    function toggleHistory() {
        const historyContainer = document.getElementById('historyContainer');
        historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
    }

    function removePlaceholder(event) {
        const target = event.target;
        if (target.textContent === target.dataset.placeholder) {
            target.classList.remove('placeholder');
            target.textContent = '';
        }
    }

    function addPlaceholder(event) {
        const target = event.target;
        if (target.textContent === '') {
            target.classList.add('placeholder');
            target.textContent = target.dataset.placeholder;
        }
    }

    function uploadImages(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.draggable = false;
                img.style.resize = 'both';
                img.style.overflow = 'auto';
                document.getElementById('front').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    function saveToHistory() {
        const frontContent = document.getElementById('front').innerHTML;
        const backContent = document.getElementById('back').innerHTML;
        history.push({ front: frontContent, back: backContent });
        renderHistory();
    }

    function updateHistoryScroll() {
        const historyContainer = document.getElementById('historyContainer');
        if (historyContainer.scrollWidth > historyContainer.clientWidth) {
            historyContainer.style.overflowX = 'scroll';
        } else {
            historyContainer.style.overflowX = 'hidden';
        }
    }

    function saveHistory() {
        localStorage.setItem('cardsHistory', JSON.stringify(history));
    }

    function loadHistory() {
        const savedHistory = localStorage.getItem('cardsHistory');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
            renderHistory();
        }
    }

    function deleteCard(event, button) {
        event.stopPropagation();
        const confirmed = confirm('Möchten Sie diese Karte wirklich löschen?');
        if (confirmed) {
            const cardIndex = Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement);
            history.splice(cardIndex, 1);
            renderHistory();
        }
    }

    function initializeToolbarButtons() {
        document.querySelector('.toolbar').insertAdjacentHTML('beforeend', `
            <button data-command="justifyLeft">Links</button>
            <button data-command="justifyCenter">Zentrieren</button>
            <button data-command="justifyRight">Rechts</button>
            <button data-command="justifyFull">Blocksatz</button>
            <button data-command="insertImage">Bild</button>
            <button class="indent-button">Einzug verkleinern</button>
        `);

        document.querySelector('.toolbar').addEventListener('click', function (event) {
            const command = event.target.getAttribute('data-command');
            if (command === 'justifyLeft') {
                event.preventDefault();
                document.execCommand('outdent'); // Einzug verkleinern
            } else {
                execCmd(command);
            }
        });
    }

    function checkPlaceholders() {
        const front = document.getElementById('front');
        const back = document.getElementById('back');

        if (front.textContent === '') {
            front.classList.add('placeholder');
            front.textContent = front.dataset.placeholder;
        }

        if (back.textContent === '') {
            back.classList.add('placeholder');
            back.textContent = back.dataset.placeholder;
        }
    }

    function updateHistoryVisibility() {
        const historyContainer = document.getElementById('historyContainer');
        if (history.length === 0) {
            historyContainer.style.display = 'none';
        } else {
            historyContainer.style.display = 'block';
        }
    }

    function adjustToolbar() {
        const toolbar = document.querySelector('.toolbar');
        if (window.innerWidth < 600) {
            toolbar.style.flexDirection = 'column';
        } else {
            toolbar.style.flexDirection = 'row';
        }
    }

    function adjustInputAreas() {
        const front = document.getElementById('front');
        const back = document.getElementById('back');

        if (window.innerWidth < 600) {
            front.style.height = '40%';
            back.style.height = '40%';
        } else {
            front.style.height = '100%';
            back.style.height = '100%';
        }
    }

    window.addEventListener('resize', () => {
        adjustToolbar();
        adjustInputAreas();
        resizeCanvases();
    });

    // Initialisierungen
    checkPlaceholders();
    adjustToolbar();
    adjustInputAreas();
    resizeCanvases();
});
