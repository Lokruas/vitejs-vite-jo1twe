document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let transaction = db.transaction(["users"], "readonly");
    let userStore = transaction.objectStore("users");
    let request = userStore.get(username);

    request.onsuccess = function (event) {
        let user = event.target.result;
        if (user && user.password === password) {
            localStorage.setItem("username", username);  // Benutzername speichern
            window.location.href = "Startfenster.html";  // Weiterleitung zur Startseite
        } else {
            alert("Invalid username or password");
        }
    };

    request.onerror = function (event) {
        console.error("Login error: ", event.target.errorCode);
    };
});
