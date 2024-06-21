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
    const editOptions = document.getElementById('edit-options');
    const progressContainer = document.getElementById('progress-container');
    let calendar;
    let isSettingMilestone = false;
    let startDate = null;
    let endDate = null;
    let milestones = [];
    let plans = {};

    function renderCalendar() {
        const calendarEl = document.getElementById('calendar');
        calendarEl.innerHTML = ''; // Kalender zurücksetzen
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            height: 'auto',
            selectable: true,
            select: function(info) {
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
        renderCalendar();
        createModal.style.display = 'block';
    };

    editScheduleBtn.onclick = function() {
        editOptions.classList.remove('hidden');
        editModal.style.display = 'block';
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

    selectPlan.onchange = function() {
        editOptions.classList.remove('hidden');
    };

    document.querySelectorAll('.edit-option').forEach(option => {
        option.onclick = function() {
            const selectedOption = selectPlan.options[selectPlan.selectedIndex];
            const planName = selectedOption.textContent.trim();
            switch (this.textContent.trim()) {
                case 'Zeitplan bearbeiten':
                    if (plans[planName]) {
                        const plan = plans[planName];
                        startDate = plan.startDate;
                        endDate = plan.endDate;
                        milestones = plan.milestones;
                        document.getElementById('plan-name').value = plan.name;
                        renderCalendar();
                        createModal.style.display = 'block';
                    }
                    break;
                case 'Zeitplan umbenennen':
                    const newName = prompt('Neuer Name für den Zeitplan:', planName);
                    if (newName && plans[planName]) {
                        plans[newName] = { ...plans[planName], name: newName };
                        delete plans[planName];
                        selectedOption.text = newName;
                        updateProgressDisplay();
                    }
                    break;
                case 'Neues Zeitziel festlegen':
                    if (plans[planName]) {
                        startDate = plans[planName].startDate;
                        endDate = null;
                        milestones = [];
                        renderCalendar();
                        createModal.style.display = 'block';
                    }
                    break;
                case 'Zwischenziel festlegen':
                    if (plans[planName]) {
                        renderCalendar();
                        createModal.style.display = 'block';
                        isSettingMilestone = true;
                    }
                    break;
                case 'Zeitplan kopieren':
                    const planCopy = { ...plans[planName] };
                    const copyName = `${planName} (Kopie)`;
                    plans[copyName] = planCopy;
                    const newOption = document.createElement('option');
                    newOption.textContent = copyName;
                    selectPlan.appendChild(newOption);
                    updateProgressDisplay();
                    alert('Zeitplan erfolgreich kopiert!');
                    break;
                case 'Fortschritt zurücksetzen':
                    if (confirm('Möchtest du den Fortschritt wirklich zurücksetzen?')) {
                        resetProgress(planName);
                    }
                    break;
                case 'Löschen':
                    if (confirm('Möchtest du diesen Zeitplan wirklich löschen?')) {
                        selectPlan.removeChild(selectedOption);
                        deletePlan(planName);
                        editOptions.classList.add('hidden');
                    }
                    break;
            }
        };
    });

    updateProgressDisplay(); // Initiale Fortschrittsanzeige aktualisieren
});
