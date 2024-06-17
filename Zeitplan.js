document.addEventListener('DOMContentLoaded', () => {
    const createScheduleBtn = document.getElementById('createSchedule');
    const editScheduleBtn = document.getElementById('editSchedule');
    const createModal = document.getElementById('createModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.querySelectorAll('.close');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const cancelPlanBtn = document.getElementById('cancelPlanBtn');
    const selectPlan = document.getElementById('selectPlan');
    const editOptions = document.getElementById('editOptions');

    // Event Listener für den Zeitplan erstellen Button
    createScheduleBtn.addEventListener('click', () => {
        createModal.style.display = 'block';
    });

    // Event Listener für den Zeitpläne bearbeiten Button
    editScheduleBtn.addEventListener('click', () => {
        editModal.style.display = 'block';
    });

    // Event Listener für das Schließen der Modale
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    // Event Listener für den Abbrechen Button
    cancelPlanBtn.addEventListener('click', () => {
        createModal.style.display = 'none';
    });

    // Event Listener für den Speichern Button
    savePlanBtn.addEventListener('click', () => {
        // Hier wird später die Logik zum Speichern des Zeitplans hinzugefügt
        alert('Zeitplan gespeichert!');
        createModal.style.display = 'none';
    });

    // Event Listener für den Dropdown-Select des Zeitplans
    selectPlan.addEventListener('change', () => {
        editOptions.classList.remove('hidden');
    });

    // Klick außerhalb des Modals schließt dieses
    window.addEventListener('click', (event) => {
        if (event.target === createModal) {
            createModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});
