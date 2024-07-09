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
                    dateRange.innerHTML += `, Endzeitpunkt: ${endDate}`;
                    calendar.unselect();
                } else if (isSettingMilestone) {
                    const milestoneCards = prompt('Wie viele Karten sollen bis zu diesem Datum gelernt werden?');
                    if (milestoneCards) {
                        const note = prompt('Notiz für dieses Zwischenziel:');
                        milestones.push({ date: info.startStr, cards: parseInt(milestoneCards), note: note });
                        document.getElementById('milestone-date').innerHTML = `Zwischenziel: ${info.startStr}, ${milestoneCards} Karten, Notiz: ${note}`;
                        isSettingMilestone = false;
                    }
                }
            }
        });
        calendar.render();
    }

    createScheduleBtn.onclick = function() {
        editModal.style.display = 'none';  // Schließt das Bearbeitungsfenster
        createModal.style.display = 'block';
        renderCalendar();
    };

    editScheduleBtn.onclick = function() {
        createModal.style.display = 'none'; // Schließt das Erstellungsfenster
        editModal.style.display = 'block';
        populatePlans();
    };

    closeButtons.forEach(function(button) {
        button.onclick = function() {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
            resetForm();
        }
    });

    window.onclick = function(event) {
        if (event.target == createModal) {
            createModal.style.display = 'none';
            resetForm();
        }
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    };

    savePlanBtn.onclick = function() {
        const planName = document.getElementById('plan-name').value;
        const stackSelect = document.getElementById('stack-select').value;
        const cardCounts = {
            'innovation-projektmanagement': 30,
            'strategieentwicklung': 40,
            'web-app': 50
        };
        const totalCards = cardCounts[stackSelect];

        if (!planName || !startDate || !endDate) {
            alert('Bitte füllen Sie alle Felder aus und wählen Sie die Daten.');
            return;
        }

        plans[planName] = { startDate, endDate, milestones: [...milestones], totalCards };
        updateProgressDisplay();
        resetForm();
        createModal.style.display = 'none';
    };

    cancelPlanBtn.onclick = function() {
        createModal.style.display = 'none';
        resetForm();
    };

    setMilestoneBtn.onclick = function() {
        isSettingMilestone = true;
    };

    function resetForm() {
        document.getElementById('plan-name').value = '';
        startDate = null;
        endDate = null;
        milestones = [];
        dateRange.innerHTML = '';
        document.getElementById('milestone-date').innerHTML = '';
        isSettingMilestone = false;
        if (calendar) {
            calendar.unselect();
        }
    }

    function populatePlans() {
        const select = document.getElementById('select-plan');
        select.innerHTML = '';
        for (const planName in plans) {
            const option = document.createElement('option');
            option.value = planName;
            option.textContent = planName;
            select.appendChild(option);
        }
        editOptions.classList.remove('hidden');
    }

    function updateProgressDisplay() {
        progressContainer.innerHTML = '';
        for (const planName in plans) {
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            const progressText = document.createElement('span');
            const plan = plans[planName];
            const now = new Date();
            const totalTime = (new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24);
            const elapsedTime = (now - new Date(plan.startDate)) / (1000 * 60 * 60 * 24);
            const progressPercent = Math.min((elapsedTime / totalTime) * 100, 100).toFixed(2);
            const timeDiff = new Date(plan.endDate) - now;
            const timerText = timeDiff > 0
                ? `${Math.floor(timeDiff / (1000 * 60 * 60)) % 24}h ${Math.floor(timeDiff / (1000 * 60)) % 60}m`
                : 'Zeit abgelaufen';

            progressText.textContent = `${planName}: ${plan.startDate} - ${plan.endDate} (${progressPercent}%)`;
            progressBar.appendChild(progressText);
            const progress = document.createElement('div');
            progress.classList.add('progress');
            progress.style.width = `${progressPercent}%`;
            progressBar.appendChild(progress);
            const timer = document.createElement('span');
            timer.classList.add('timer');
            timer.textContent = timerText;
            progressBar.appendChild(timer);
            progressContainer.appendChild(progressBar);
        }
    }

    selectPlan.onchange = function() {
        const selectedPlan = selectPlan.value;
        const plan = plans[selectedPlan];
        if (plan) {
            startDate = plan.startDate;
            endDate = plan.endDate;
            milestones = plan.milestones;
            renderCalendar();
            calendar.addEvent({
                start: startDate,
                end: endDate,
                title: selectedPlan
            });
            plan.milestones.forEach(milestone => {
                calendar.addEvent({
                    start: milestone.date,
                    title: 'Zwischenziel',
                    extendedProps: {
                        cards: milestone.cards,
                        note: milestone.note
                    }
                });
            });
        }
    };

    editOptions.addEventListener('click', function(event) {
        const action = event.target.getAttribute('data-action');
        if (!action) return;

        const selectedPlan = selectPlan.value;
        if (!plans[selectedPlan]) return;

        switch (action) {
            case 'edit':
                createModal.style.display = 'block';
                editModal.style.display = 'none';  // Schließt das Bearbeitungsfenster
                const plan = plans[selectedPlan];
                document.getElementById('plan-name').value = selectedPlan;
                startDate = plan.startDate;
                endDate = plan.endDate;
                milestones = plan.milestones;
                renderCalendar();
                break;
            case 'copy':
                const copyName = prompt('Name für die Kopie des Zeitplans:', `${selectedPlan} - Kopie`);
                if (copyName) {
                    plans[copyName] = { ...plans[selectedPlan], milestones: [...plans[selectedPlan].milestones] };
                    updateProgressDisplay();
                    populatePlans();
                }
                break;
            case 'reset':
                if (confirm('Sind Sie sicher, dass Sie den Fortschritt dieses Zeitplans zurücksetzen möchten?')) {
                    plans[selectedPlan].milestones = [];
                    updateProgressDisplay();
                }
                break;
            case 'delete':
                if (confirm(`Möchten Sie den Zeitplan '${selectedPlan}' wirklich löschen?`)) {
                    delete plans[selectedPlan];
                    updateProgressDisplay();
                    populatePlans();
                }
                break;
        }
    });
});
