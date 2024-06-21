document.addEventListener('DOMContentLoaded', function() {
    const createScheduleBtn = document.getElementById('create-schedule-btn');
    const editScheduleBtn = document.getElementById('edit-schedule-btn');
    const createModal = document.getElementById('create-modal');
    const editModal = document.getElementById('edit-modal');
    const closeButtons = document.querySelectorAll('.close');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const cancelPlanBtn = document.getElementById('cancel-plan-btn');
    const setMilestoneBtn = document.getElementById('set-milestone-btn');
    const dateRange = document.getElementById('date-range');
    const selectPlan = document.getElementById('select-plan');
    const editSelectedPlanBtn = document.getElementById('edit-selected-plan-btn');
    const progressContainer = document.getElementById('progress-container');
    let calendar;
    let isSettingMilestone = false;
    let startDate = null;
    let endDate = null;
    let milestones = [];
    let plans = {};
    let editingPlan = null;

    function renderCalendar() {
        const calendarEl = document.getElementById('calendar');
        calendarEl.innerHTML = ''; // Kalender zurücksetzen
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'de',
            selectable: true,
            dateClick: function(info) {
                if (!startDate) {
                    startDate = info.startStr;
                    dateRange.innerHTML = `Startzeitpunkt: ${startDate}`;
                } else if (!endDate) {
                    endDate = info.startStr;
                    dateRange.innerHTML += `<br>Endzeitpunkt: ${endDate}`;
                    updateCardDistribution();
                } else if (isSettingMilestone) {
                    setMilestone(info.startStr);
                }
            }
        });
        calendar.render();

        if (editingPlan) {
            // Vorhandene Daten im Kalender anzeigen
            calendar.addEvent({
                title: 'Startzeitpunkt',
                start: editingPlan.startDate,
                color: 'green'
            });

            calendar.addEvent({
                title: 'Endzeitpunkt',
                start: editingPlan.endDate,
                color: 'red'
            });

            editingPlan.milestones.forEach(milestone => {
                calendar.addEvent({
                    title: 'Zwischenziel',
                    start: milestone,
                    color: 'orange'
                });
            });
        }
    }

    function updateCardDistribution() {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const cardsPerDay = Math.floor(100 / diffDays); // Beispielanzahl: 100 Karten

            for (let i = 0; i <= diffDays; i++) {
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + i);
                const formattedDate = currentDate.toISOString().split('T')[0];

                calendar.addEvent({
                    title: `${cardsPerDay} Karten`,
                    start: formattedDate,
                    color: 'blue'
                });
            }
        }
    }

    function setMilestone(date) {
        milestones.push(date);
        const milestoneEl = document.createElement('div');
        milestoneEl.innerHTML = `Zwischenziel: ${date}`;
        milestoneEl.style.color = 'orange';
        document.getElementById('milestone-date').appendChild(milestoneEl);

        calendar.addEvent({
            title: 'Zwischenziel',
            start: date,
            color: 'orange'
        });
        isSettingMilestone = false;
    }

    function savePlan() {
        const planName = document.getElementById('plan-name').value;
        if (!planName) {
            alert('Bitte gib einen Namen für den Zeitplan ein.');
            return;
        }

        const newPlan = {
            name: planName,
            startDate: startDate,
            endDate: endDate,
            milestones: milestones,
            progress: 0
        };

        plans[planName] = newPlan;
        updateProgressDisplay();
        createModal.style.display = 'none';
    }

    function updateProgressDisplay() {
        progressContainer.innerHTML = '';
        for (const planName in plans) {
            const plan = plans[planName];
            const progressEl = document.createElement('div');
            progressEl.classList.add('progress-bar');
            const start = new Date(plan.startDate);
            const end = new Date(plan.endDate);
            const today = new Date();
            const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
            const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

            progressEl.innerHTML = `<span>${progress.toFixed(2)}% - ${planName} (${plan.startDate} - ${plan.endDate})</span>`;
            progressContainer.appendChild(progressEl);
        }
    }

    function resetProgress(planName) {
        if (plans[planName]) {
            plans[planName].progress = 0;
            updateProgressDisplay();
        }
    }

    function deletePlan(planName) {
        if (plans[planName]) {
            delete plans[planName];
            updateProgressDisplay();
            alert('Zeitplan erfolgreich gelöscht!');
        }
    }

    createScheduleBtn.onclick = function() {
        editingPlan = null; // Keine Bearbeitung, sondern Erstellung
        renderCalendar();
        createModal.style.display = 'block';
    };

    editScheduleBtn.onclick = function() {
        if (selectPlan.value) {
            editingPlan = plans[selectPlan.value]; // Plan zum Bearbeiten setzen
            startDate = editingPlan.startDate;
            endDate = editingPlan.endDate;
            milestones = [...editingPlan.milestones];
            document.getElementById('plan-name').value = editingPlan.name;
            renderCalendar();
            createModal.style.display = 'block';
        } else {
            alert('Bitte wähle einen Zeitplan zum Bearbeiten aus.');
        }
    };

    closeButtons.forEach(button => {
        button.onclick = function() {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
            startDate = null;
            endDate = null;
            milestones = [];
            dateRange.innerHTML = '';
            document.getElementById('milestone-date').innerHTML = '';
        };
    });

    savePlanBtn.onclick = function() {
        if (confirm('Möchtest du den Zeitplan wirklich speichern?')) {
            savePlan();
        }
    };

    cancelPlanBtn.onclick = function() {
        createModal.style.display = 'none';
        startDate = null;
        endDate = null;
        milestones = [];
        dateRange.innerHTML = '';
        document.getElementById('milestone-date').innerHTML = '';
    };

    setMilestoneBtn.onclick = function() {
        isSettingMilestone = true;
    };

    editSelectedPlanBtn.onclick = function() {
        const planName = selectPlan.value;
        if (planName) {
            editingPlan = plans[planName]; // Setze den Plan, der bearbeitet werden soll
            startDate = editingPlan.startDate;
            endDate = editingPlan.endDate;
            milestones = [...editingPlan.milestones];
            document.getElementById('plan-name').value = editingPlan.name;
            renderCalendar();
            createModal.style.display = 'block';
        } else {
            alert('Bitte wähle einen Zeitplan zum Bearbeiten aus.');
        }
    };

    document.getElementById('copy-plan-btn').onclick = function() {
        const planName = selectPlan.value;
        if (planName) {
            const planCopy = { ...plans[planName] };
            const copyName = `${planName} (Kopie)`;
            plans[copyName] = planCopy;
            const newOption = document.createElement('option');
            newOption.textContent = copyName;
            selectPlan.appendChild(newOption);
            updateProgressDisplay();
            alert('Zeitplan erfolgreich kopiert!');
        } else {
            alert('Bitte wähle einen Zeitplan zum Kopieren aus.');
        }
    };

    document.getElementById('reset-progress-btn').onclick = function() {
        const planName = selectPlan.value;
        if (planName && confirm('Möchtest du den Fortschritt wirklich zurücksetzen?')) {
            resetProgress(planName);
        } else {
            alert('Bitte wähle einen Zeitplan zum Zurücksetzen aus.');
        }
    };

    document.getElementById('delete-plan-btn').onclick = function() {
        const planName = selectPlan.value;
        if (planName && confirm('Möchtest du diesen Zeitplan wirklich löschen?')) {
            selectPlan.removeChild(selectPlan.querySelector(`option[value="${planName}"]`));
            deletePlan(planName);
        } else {
            alert('Bitte wähle einen Zeitplan zum Löschen aus.');
        }
    };

    updateProgressDisplay(); // Initiale Fortschrittsanzeige aktualisieren
});
