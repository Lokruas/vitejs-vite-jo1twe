document.addEventListener('DOMContentLoaded', function() {
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

    document.getElementById('colorSelector').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            changeDrawColor(event.target.style.backgroundColor);
        }
    });

    document.getElementById('imageUpload').addEventListener('change', function() {
        uploadImages(this);
    });
});

// HTML-Funktionen
function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

function addCard() {
    // Funktion zum Hinzufügen einer neuen Karte
    console.log('Neue Karte hinzufügen');
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
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.draggable = false;
            img.style.resize = 'both';
            img.style.overflow = 'auto';
            document.getElementById('front').appendChild(img);
        }
        reader.readAsDataURL(file);
    }
}

let drawMode = false;

function toggleDrawMode() {
    drawMode = !drawMode;
    const canvas = document.getElementById('drawCanvas');
    canvas.style.display = drawMode ? 'block' : 'none';
    isErasing = false;
}

function toggleEraserMode() {
    isErasing = !isErasing;
    const canvas = document.getElementById('drawCanvas');
    if (isErasing) {
        drawMode = false;
        canvas.style.display = 'block';
    } else {
        canvas.style.display = 'none';
    }
}

function changeDrawColor(color) {
    drawColor = color;
}

function startDrawing(event) {
    if (drawMode || isErasing) {
        isDrawing = true;
        const canvas = document.getElementById('drawCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY);
    }
}

function draw(event) {
    if (!isDrawing) return;
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    if (drawMode) {
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    } else if (isErasing) {
        ctx.clearRect(event.clientX - 10, event.clientY - 10, 20, 20);
    }
}

function stopDrawing() {
    isDrawing = false;
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    ctx.closePath();
}

function resizeCanvas() {
    const canvas = document.getElementById('drawCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Vorhandene Kartenhistorie
let history = [];
function saveToHistory() {
    const frontContent = document.getElementById('front').innerHTML;
    const backContent = document.getElementById('back').innerHTML;
    history.push({ front: frontContent, back: backContent });
    renderHistory();
}

function renderHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';
    history.forEach((entry, index) => {
        const historyCard = document.createElement('div');
        historyCard.className = 'history-card';
        historyCard.innerHTML = `
            <div><strong>Karte ${index + 1}</strong></div>
            <div>Vorderseite: ${entry.front}</div>
            <div>Rückseite: ${entry.back}</div>
        `;
        historyContainer.appendChild(historyCard);
    });
}

// Anpassung der Toolbar Buttons
document.querySelector('.toolbar').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        const command = event.target.getAttribute('data-command');
        if (command) execCmd(command);
    }
});

// Hinzufügen von Einfüge- und Zentrierbuttons
document.querySelector('.toolbar').insertAdjacentHTML('beforeend', `
    <button data-command="justifyLeft">Links</button>
    <button data-command="justifyCenter">Zentrieren</button>
    <button data-command="justifyRight">Rechts</button>
    <button data-command="justifyFull">Blocksatz</button>
    <button data-command="insertImage">Bild</button>
`);

// Bilder einfügen
function execCmd(command, value = null) {
    if (command === 'insertImage') {
        const url = prompt('Enter the image URL:', 'http://');
        if (url) document.execCommand('insertImage', false, url);
    } else {
        document.execCommand(command, false, value);
    }
}

// Bildgröße anpassen
document.querySelectorAll('.card-side img').forEach(img => {
    img.addEventListener('click', function() {
        const newWidth = prompt('Enter new width:', img.width);
        const newHeight = prompt('Enter new height:', img.height);
        if (newWidth && newHeight) {
            img.width = newWidth;
            img.height = newHeight;
        }
    });
});

// Zeichnen aktivieren
document.getElementById('drawCanvas').addEventListener('mousedown', function(event) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
});
document.getElementById('drawCanvas').addEventListener('mousemove', function(event) {
    if (isDrawing) {
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    }
});
document.getElementById('drawCanvas').addEventListener('mouseup', function() {
    isDrawing = false;
    ctx.closePath();
});
document.getElementById('drawCanvas').addEventListener('mouseout', function() {
    isDrawing = false;
    ctx.closePath();
});

// History-Funktionalität
function saveCardToHistory() {
    const frontContent = document.getElementById('front').innerHTML;
    const backContent = document.getElementById('back').innerHTML;
    history.push({ front: frontContent, back: backContent });
    updateHistory();
}

function updateHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';
    history.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'history-card';
        cardElement.innerHTML = `
            <div>Karte ${index + 1}</div>
            <div><b>Vorderseite:</b> ${card.front}</div>
            <div><b>Rückseite:</b> ${card.back}</div>
        `;
        historyContainer.appendChild(cardElement);
    });
}

// Stift-Funktion nur in editierbaren Bereichen
function toggleDrawMode() {
    drawMode = !drawMode;
    const canvas = document.getElementById('drawCanvas');
    canvas.style.display = drawMode ? 'block' : 'none';
    isErasing = false;
}

function toggleEraserMode() {
    isErasing = !isErasing;
    const canvas = document.getElementById('drawCanvas');
    if (isErasing) {
        drawMode = false;
        canvas.style.display = 'block';
    } else {
        canvas.style.display = 'none';
    }
}

function changeDrawColor(color) {
    drawColor = color;
}

function startDrawing(event) {
    if (drawMode || isErasing) {
        isDrawing = true;
        const canvas = document.getElementById('drawCanvas');
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY);
    }
}

function draw(event) {
    if (!isDrawing) return;
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    if (drawMode) {
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    } else if (isErasing) {
        ctx.clearRect(event.clientX - 10, event.clientY - 10, 20, 20);
    }
}

function stopDrawing() {
    isDrawing = false;
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    ctx.closePath();
}

function resizeCanvas() {
    const canvas = document.getElementById('drawCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
