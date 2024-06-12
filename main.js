document.addEventListener('DOMContentLoaded', function() {
    const front = document.getElementById('front');
    const back = document.getElementById('back');
    const drawCanvas = document.getElementById('drawCanvas');
    const ctx = drawCanvas.getContext('2d');
    const colorSelector = document.getElementById('colorSelector');
    let drawing = false;
    let currentColor = '#000000';
    let isDrawingMode = false;
    let currentTool = 'pen'; // 'pen' oder 'eraser'

    // Canvas Größe anpassen
    function resizeCanvas() {
        drawCanvas.width = window.innerWidth;
        drawCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Werkzeuge und Zeichenmodus
    document.querySelectorAll('.toolbar button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.getAttribute('data-tool') === 'pen' || this.getAttribute('data-tool') === 'eraser') {
                isDrawingMode = true;
                currentTool = this.getAttribute('data-tool');
                drawCanvas.style.pointerEvents = 'auto';
                drawCanvas.style.display = 'block';
            } else {
                isDrawingMode = false;
                drawCanvas.style.pointerEvents = 'none';
                drawCanvas.style.display = 'none';
            }
        });
    });

    function startDrawing(e) {
        drawing = true;
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentTool === 'pen' ? 2 : 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    }

    function stopDrawing() {
        drawing = false;
    }

    drawCanvas.addEventListener('mousedown', startDrawing);
    drawCanvas.addEventListener('mousemove', draw);
    drawCanvas.addEventListener('mouseup', stopDrawing);

    document.addEventListener('click', function(event) {
        if (isDrawingMode && !event.target.closest('.card-side')) {
            isDrawingMode = false;
            drawCanvas.style.pointerEvents = 'none';
            drawCanvas.style.display = 'none';
        }
    });

    document.getElementById('drawCanvas').addEventListener('click', function(event) {
        if (event.target.closest('.toolbar') || event.target.closest('.card-side')) {
            drawCanvas.style.display = 'none';
        }
    });

    document.querySelectorAll('.color-selector button').forEach(button => {
        button.addEventListener('click', () => {
            currentColor = button.style.backgroundColor;
        });
    });

    // Einrückungen und Zentrieren
    function execCmd(command, value = null) {
        document.execCommand(command, false, value);
    }

    function toggleColorPicker(pickerId) {
        const picker = document.getElementById(pickerId);
        picker.style.display = picker.style.display === 'none' ? 'inline-block' : 'none';
    }

    function addCard() {
        const frontText = document.getElementById('front').innerHTML.trim();
        const backText = document.getElementById('back').innerHTML.trim();
        if (frontText && backText) {
            const historyContainer = document.getElementById('historyContainer');
            const card = document.createElement('div');
            card.className = 'history-card';

            const frontTextarea = document.createElement('textarea');
            frontTextarea.value = frontText;
            frontTextarea.setAttribute('readonly', true);
            frontTextarea.classList.add('history-card-content');

            const backTextarea = document.createElement('textarea');
            backTextarea.value = backText;
            backTextarea.setAttribute('readonly', true);
            backTextarea.classList.add('history-card-content');

            card.appendChild(frontTextarea);
            card.appendChild(backTextarea);
            historyContainer.appendChild(card);

            document.getElementById('front').innerHTML = '';
            document.getElementById('back').innerHTML = '';
        }
    }

    function toggleHistory() {
        const historyContainer = document.getElementById('historyContainer');
        historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
    }

    function uploadImages(input) {
        const files = input.files;
        const frontSide = document.getElementById('front');
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'uploaded-image';
                img.draggable = true;
                img.onmousedown = enableImageResize;
                frontSide.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    function enableImageResize(event) {
        const img = event.target;
        let startX, startY, startWidth, startHeight;

        img.addEventListener('mousedown', initResize);

        function initResize(e) {
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(img).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(img).height, 10);
            document.documentElement.addEventListener('mousemove', doResize);
            document.documentElement.addEventListener('mouseup', stopResize);
        }

        function doResize(e) {
            img.style.width = (startWidth + e.clientX - startX) + 'px';
            img.style.height = (startHeight + e.clientY - startY) + 'px';
        }

        function stopResize() {
            document.documentElement.removeEventListener('mousemove', doResize);
            document.documentElement.removeEventListener('mouseup', stopResize);
        }
    }

    function changeDrawColor(color) {
        currentColor = color;
    }
});
