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
                    milestones.push(info.startStr);
                    document.getElementById('milestone-date').innerHTML = `Zwischenziel: ${info.startStr}`;
                    isSettingMilestone = false;
                }
            }
        });
        calendar.render();
    }

    createScheduleBtn.onclick = function() {
        createModal.style.display = 'block';
        renderCalendar();
    };

    editScheduleBtn.onclick = function() {
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
        if (!planName || !startDate || !endDate) {
            alert('Bitte füllen Sie alle Felder aus und wählen Sie die Daten.');
            return;
        }
        plans[planName] = { startDate, endDate, milestones: [...milestones] };
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
            progressText.textContent = `${planName}: ${plans[planName].startDate} - ${plans[planName].endDate}`;
            progressBar.appendChild(progressText);
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
                    start: milestone,
                    title: 'Zwischenziel'
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
                const plan = plans[selectedPlan];
                document.getElementById('plan-name').value = selectedPlan;
                startDate = plan.startDate;
                endDate = plan.endDate;
                milestones = plan.milestones;
                renderCalendar();
                break;
            case 'rename':
                const newName = prompt('Neuer Name für den Zeitplan:', selectedPlan);
                if (newName && newName !== selectedPlan) {
                    plans[newName] = plans[selectedPlan];
                    delete plans[selectedPlan];
                    updateProgressDisplay();
                    populatePlans();
                }
                break;
            case 'new-end-date':
                isSettingMilestone = false;
                endDate = null;
                dateRange.innerHTML = `Startzeitpunkt: ${plans[selectedPlan].startDate}`;
                renderCalendar();
                break;
            case 'add-milestone':
                isSettingMilestone = true;
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
