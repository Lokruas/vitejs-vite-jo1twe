document.addEventListener('DOMContentLoaded', () => {
    const createScheduleButton = document.getElementById('createSchedule');
    const editScheduleButton = document.getElementById('editSchedule');
    const scheduleModal = document.getElementById('scheduleModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.querySelectorAll('.close');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const cancelPlanBtn = document.getElementById('cancelPlanBtn');
    const selectPlan = document.getElementById('selectPlan');
    const editOptions = document.getElementById('editOptions');

    createScheduleButton.addEventListener('click', () => {
        scheduleModal.style.display = 'block';
    });

    editScheduleButton.addEventListener('click', () => {
        editModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            scheduleModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === scheduleModal) {
            scheduleModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    savePlanBtn.addEventListener('click', () => {
        const stackSelect = document.getElementById('stackSelect');
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const planName = document.getElementById('planName').value;

        if (stackSelect.value === "" || startDate === "" || endDate === "" || planName === "") {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }

        alert(`Zeitplan '${planName}' für den Stapel '${stackSelect.options[stackSelect.selectedIndex].text}' wurde von ${startDate} bis ${endDate} erstellt.`);
        scheduleModal.style.display = 'none';
    });

    cancelPlanBtn.addEventListener('click', () => {
        scheduleModal.style.display = 'none';
    });

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
