document.addEventListener('DOMContentLoaded', () => {
    const createScheduleButton = document.getElementById('createSchedule');
    const editScheduleButton = document.getElementById('editSchedule');
    const createModal = document.getElementById('createModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.querySelectorAll('.close');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const cancelPlanBtn = document.getElementById('cancelPlanBtn');
    const selectPlan = document.getElementById('selectPlan');
    const editOptions = document.getElementById('editOptions');

    // Zeitplan erstellen
    createScheduleButton.addEventListener('click', () => {
        createModal.style.display = 'block';
    });

    // Zeitplan bearbeiten
    editScheduleButton.addEventListener('click', () => {
        editModal.style.display = 'block';
    });

    // Modal schließen
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    // Modal schließen bei Klick außerhalb des Modals
    window.addEventListener('click', (event) => {
        if (event.target === createModal) {
            createModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Zeitplan speichern
    savePlanBtn.addEventListener('click', () => {
        const stackSelect = document.getElementById('stackSelect');
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const planName = document.getElementById('planName').value;

        alert(`Zeitplan '${planName}' für den Stapel '${stackSelect.options[stackSelect.selectedIndex].text}' wurde von ${startDate} bis ${endDate} erstellt.`);
        createModal.style.display = 'none';
    });

    // Zeitplan abbrechen
    cancelPlanBtn.addEventListener('click', () => {
        createModal.style.display = 'none';
    });

    // Zeitplan auswählen zum Bearbeiten
    selectPlan.addEventListener('change', () => {
        editOptions.classList.remove('hidden');
    });

    // Dummy-Funktionen für die Bearbeitungsoptionen
    document.querySelectorAll('.editOption').forEach(button => {
        button.addEventListener('click', () => {
            alert(`Du hast '${button.textContent}' gewählt. Funktion ist noch nicht implementiert.`);
        });
    });
});
