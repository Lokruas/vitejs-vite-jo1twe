document.addEventListener('DOMContentLoaded', function () {
    const cardSides = document.querySelectorAll('.card-side');
    cardSides.forEach(side => {
        side.addEventListener('focus', removePlaceholder);
        side.addEventListener('blur', addPlaceholder);
    });

    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let isErasing = false;
    let drawColor = 'black';

    // Initialisieren des Canvas zum Zeichnen
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

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
});

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
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        const selectedSide = document.querySelector('.card-side:focus');
        selectedSide.appendChild(img);
    };
    reader.readAsDataURL(file);
}

// Canvas-Zeichenfunktionen
function toggleDrawMode() {
    isDrawing = !isDrawing;
    isErasing = false; // Deaktiviere Radiermodus, wenn Zeichnen aktiviert wird
    document.querySelectorAll('.drawCanvas').forEach(canvas => canvas.style.pointerEvents = isDrawing ? 'auto' : 'none');
}

function toggleEraserMode() {
    isErasing = !isErasing;
    isDrawing = false; // Deaktiviere Zeichnen, wenn Radiermodus aktiviert wird
    document.querySelectorAll('.drawCanvas').forEach(canvas => canvas.style.pointerEvents = isErasing ? 'auto' : 'none');
}

function changeDrawColor(color) {
    drawColor = color;
}

function startDrawing(event) {
    isDrawing = true;
    draw(event);
}

function draw(event) {
    if (!isDrawing) return;
    const canvas = event.target;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawColor;

    if (isErasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
    ctx.closePath();
}

function stopDrawing() {
    isDrawing = false;
}

function resizeCanvas() {
    const canvases = document.querySelectorAll('.drawCanvas');
    canvases.forEach(canvas => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    });
}

// Funktion zum initialisieren der Toolbar-Buttons
function initializeToolbarButtons() {
    document.getElementById('fontSelect').addEventListener('change', function() {
        execCmd('fontName', this.value);
    });
    document.getElementById('fontSizeSelect').addEventListener('change', function() {
        execCmd('fontSize', this.value);
    });
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

// Initialisierung
let history = [];
function updateHistoryScroll() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.scrollTop = 0;
}

function updateHistoryVisibility() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.style.display = history.length > 0 ? 'block' : 'none';
}

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
}

function addSubstackOption(text) {
    const option = document.createElement('option');
    option.value = text.toLowerCase().replace(/\s+/g, '');
    option.text = text;
    document.getElementById('substackSelect').appendChild(option);
}
