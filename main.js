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
    let currentCanvas = frontCanvas; // Standardmäßig auf der Vorderseite
    let currentCtx = frontCtx; // Standardmäßig auf der Vorderseite

    // Initialisieren des Canvas zum Zeichnen
    [frontCanvas, backCanvas].forEach(canvas => {
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        window.addEventListener('resize', resizeCanvases);
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

    // Setze das aktuelle Canvas basierend auf dem Fokus
    document.getElementById('front').addEventListener('focus', () => {
        currentCanvas = frontCanvas;
        currentCtx = frontCtx;
    });

    document.getElementById('back').addEventListener('focus', () => {
        currentCanvas = backCanvas;
        currentCtx = backCtx;
    });
});

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

let history = [];

function addCard() {
    const frontContent = document.getElementById('front').innerHTML;
    const backContent = document.getElementById('back').innerHTML;
    history.unshift({ front: frontContent, back: backContent }); // Neueste Karte vorne einfügen
    renderHistory();
    saveHistory();
}

function toggleHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
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
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';
    history.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('history-card');
        cardDiv.innerHTML = `
            <div class="history-card-front">${card.front}</div>
            <div class="history-card-back">${card.back}</div>
            <button onclick="deleteCard(${index})">Löschen</button>
        `;
        historyContainer.appendChild(cardDiv);
    });
}

function deleteCard(index) {
    history.splice(index, 1);
    renderHistory();
    saveHistory();
}

function startDrawing(event) {
    isDrawing = true;
    currentCtx.beginPath();
    currentCtx.moveTo(event.offsetX, event.offsetY);
}

function draw(event) {
    if (!isDrawing) return;
    currentCtx.lineTo(event.offsetX, event.offsetY);
    currentCtx.strokeStyle = drawColor;
    currentCtx.lineWidth = 2;
    currentCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function changeDrawColor(color) {
    drawColor = color;
}

function toggleDrawMode() {
    const canvases = document.querySelectorAll('.drawCanvas');
    canvases.forEach(canvas => {
        canvas.style.pointerEvents = canvas.style.pointerEvents === 'none' ? 'auto' : 'none';
    });
}

function toggleEraserMode() {
    drawColor = 'white'; // Radiergummi-Farbe auf Weiß setzen
}

function uploadImages(input) {
    const files = input.files;
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            document.execCommand('insertHTML', false, `<img src="${canvas.toDataURL()}">`);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function resizeCanvases() {
    const frontContainer = document.getElementById('frontContainer');
    const backContainer = document.getElementById('backContainer');
    frontCanvas.width = frontContainer.clientWidth;
    frontCanvas.height = frontContainer.clientHeight;
    backCanvas.width = backContainer.clientWidth;
    backCanvas.height = backContainer.clientHeight;
}

function removePlaceholder(event) {
    const element = event.target;
    if (element.innerHTML === element.getAttribute('data-placeholder')) {
        element.innerHTML = '';
        element.classList.remove('placeholder');
    }
}

function addPlaceholder(event) {
    const element = event.target;
    if (element.innerHTML.trim() === '') {
        element.innerHTML = element.getAttribute('data-placeholder');
        element.classList.add('placeholder');
    }
}

function initializeToolbarButtons() {
    const toolbarButtons = document.querySelectorAll('.toolbar button');
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function () {
            toolbarButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}
