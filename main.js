<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karteneditor</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="editor">
            <h2>Karteneditor</h2>
            <div class="toolbar">
                <select id="fontSelect">
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                </select>
                <button onclick="execCmd('bold')"><b>B</b></button>
                <button onclick="execCmd('foreColor', '#FF0000')">Rot</button>
                <button onclick="execCmd('foreColor', '#0000FF')">Blau</button>
            </div>
            <div class="card">
                <div contenteditable="true" id="front" class="card-side">Vorderseite</div>
                <div contenteditable="true" id="back" class="card-side">Rückseite</div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>

body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.editor {
    max-width: 600px;
}

.toolbar {
    margin-bottom: 10px;
}

.toolbar select,
.toolbar button {
    margin-right: 5px;
    padding: 5px;
}

.card {
    display: flex;
    flex-direction: column;
}

.card-side {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    min-height: 100px;

document.getElementById('fontSelect').addEventListener('change', function() {
    execCmd('fontName', this.value);
});

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

