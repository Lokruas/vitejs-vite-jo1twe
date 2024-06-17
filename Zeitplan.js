document.addEventListener('DOMContentLoaded', () => {
    const createScheduleButton = document.getElementById('createSchedule');
    const scheduleModal = document.getElementById('scheduleModal');
    const closeButton = document.querySelector('.close');
    const createScheduleBtn = document.getElementById('createScheduleBtn');

    createScheduleButton.addEventListener('click', () => {
        scheduleModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        scheduleModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === scheduleModal) {
            scheduleModal.style.display = 'none';
        }
    });

    createScheduleBtn.addEventListener('click', () => {
        const stackSelect = document.getElementById('stackSelect');
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (stackSelect.value === "" || startDate === "" || endDate === "") {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        alert(`Zeitplan für den Stapel '${stackSelect.options[stackSelect.selectedIndex].text}' wurde von ${startDate} bis ${endDate} erstellt.`);
        scheduleModal.style.display = 'none';
        // Hier kannst du den Zeitplan erstellen und speichern
    });
});
