// Platzhalter-Text-Logik
document.querySelectorAll('.card-side').forEach(element => {
    element.addEventListener('focus', function() {
        const placeholder = this.getAttribute('data-placeholder');
        if (this.textContent === placeholder) {
            this.textContent = '';
            this.classList.remove('placeholder');
        }
    });

    element.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
            const placeholder = this.getAttribute('data-placeholder');
            this.textContent = placeholder;
            this.classList.add('placeholder');
        }
    });

    // Initiale Platzhalteranzeige
    const placeholder = element.getAttribute('data-placeholder');
    if (element.textContent.trim() === '') {
        element.textContent = placeholder;
        element.classList.add('placeholder');
    }
});

// Funktion, um eine Karte hinzuzufügen
function addCard() {
    const front = document.getElementById('front').textContent.trim();
    const back = document.getElementById('back').textContent.trim();
    const historyContainer = document.getElementById('historyContainer');

    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
        <div class="front-preview">${front}</div>
        <button class="delete-button" onclick="deleteCard(event, this)">×</button>
    `;
    card.onclick = function() {
        document.getElementById('front').textContent = front;
        document.getElementById('back').textContent = back;
        checkPlaceholders();
    };

    historyContainer.appendChild(card);

    // Leeren der Eingabefelder und Platzhalter aktualisieren
    document.getElementById('front').textContent = '';
    document.getElementById('back').textContent = '';
    checkPlaceholders();
    updateHistoryVisibility();
}

// Funktion, um eine Karte zu löschen
function deleteCard(event, button) {
    event.stopPropagation();
    const confirmed = confirm('Möchten Sie diese Karte wirklich löschen?');
    if (confirmed) {
        button.parentElement.remove();
        updateHistoryVisibility();
    }
}

// Editor-Befehle ausführen
function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

// Bild-Upload-Funktion
function uploadImages(input) {
    if (input.files) {
        [...input.files].forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.display = 'block';
                img.style.position = 'relative';
                img.draggable = true;
                img.classList.add('uploaded-image');

                const container = document.createElement('div');
                container.style.position = 'relative';
                container.appendChild(img);

                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = '×';
                deleteBtn.className = 'delete-button';
                deleteBtn.onclick = function() {
                    container.remove();
                };
                container.appendChild(deleteBtn);

                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'image-resize-handle';
                resizeHandle.onmousedown = resizeMouseDown;
                container.appendChild(resizeHandle);

                img.ondragstart = dragStart;
                img.ondragend = dragEnd;

                const range = window.getSelection().getRangeAt(0);
                range.insertNode(container);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Drag-and-drop Logik
let dragSrcEl = null;

function dragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
}

function dragEnd() {
    dragSrcEl = null;
}

// Stift- und Radiergummi-Logik
let isDrawing = false;
let isErasing = false;
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let startX, startY;

function toggleDrawMode() {
    if (isDrawing) {
        deactivateDrawMode();
    } else {
        activateDrawMode();
    }
}

function toggleEraserMode() {
    if (isErasing) {
        deactivateEraserMode();
    } else {
        activateEraserMode();
    }
}

function activateDrawMode() {
    isDrawing = true;
    isErasing = false;
    setupCanvas();
}

function deactivateDrawMode() {
    isDrawing = false;
    canvas.style.display = 'none';
    document.body.style.cursor = 'default';
}

function activateEraserMode() {
    isErasing = true;
    isDrawing = false;
    setupCanvas();
}

function deactivateEraserMode() {
    isErasing = false;
    canvas.style.display = 'none';
    document.body.style.cursor = 'default';
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    document.body.style.cursor = 'crosshair';
}

canvas.addEventListener('mousedown', (e) => {
    if (!isDrawing && !isErasing) return;
    startX = e.clientX;
    startY = e.clientY;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing && !isErasing) return;
    if (e.buttons !== 1) return; // Nur bei gedrückter Maustaste zeichnen
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    if (isDrawing) {
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    } else if (isErasing) {
        ctx.clearRect(mouseX - 5, mouseY - 5, 10, 10);
    }
});

canvas.addEventListener('mouseup', () => {
    if (!isDrawing && !isErasing) return;
    ctx.closePath();
});

// Stiftfarbe ändern
function changeDrawColor(color) {
    ctx.strokeStyle = color;
}

// Bildgrößenänderung
function resizeMouseDown(e) {
    e.preventDefault();
    const img = e.target.previousSibling;
    document.onmousemove = function(event) {
        img.style.width = (event.clientX - img.offsetLeft) + 'px';
        img.style.height = (event.clientY - img.offsetTop) + 'px';
    };
    document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
    };
}

// Platzhalter überprüfen und einstellen
function checkPlaceholders() {
    document.querySelectorAll('.card-side').forEach(element => {
        const placeholder = element.getAttribute('data-placeholder');
        if (element.textContent.trim() === '') {
            element.textContent = placeholder;
            element.classList.add('placeholder');
        } else {
            element.classList.remove('placeholder');
        }
    });
}

// Karten-Historie umschalten
function toggleHistory() {
    const historyContainer = document.getElementById('historyContainer');
    if (historyContainer.style.display === 'flex') {
        historyContainer.style.display = 'none';
    } else {
        historyContainer.style.display = 'flex';
    }
}

// Historie Sichtbarkeit aktualisieren
function updateHistoryVisibility() {
    const historyContainer = document.getElementById('historyContainer');
    if (historyContainer.children.length > 0) {
        historyContainer.style.display = 'flex';
    } else {
        historyContainer.style.display = 'none';
    }
}
