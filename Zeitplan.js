document.addEventListener('DOMContentLoaded', function () {
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
    const editSelectedPlanBtn = document.getElementById('edit-selected-plan-btn');
    const progressContainer = document.getElementById('progress-container');
    const cardsTodayText = document.getElementById('cards-today-text');
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
            select: function (info) {
                if (!startDate) {
                    startDate = info.startStr;
                    dateRange.innerHTML = `Startzeitpunkt: ${startDate}`;
                    addCalendarEvent(info.startStr, 'Startzeitpunkt', 'event-start');
                } else if (!endDate) {
                    endDate = info.startStr;
                    dateRange.innerHTML += `, Endzeitpunkt: ${endDate}`;
                    addCalendarEvent(info.startStr, 'Endzeitpunkt', 'event-end');
                    calendar.unselect();
                    calculateDailyCards();
                } else if (isSettingMilestone) {
                    const milestoneCards = prompt('Wie viele Karten sollen bis zu diesem Datum gelernt werden?');
                    if (milestoneCards) {
                        const note = prompt('Notiz für dieses Zwischenziel:');
                        milestones.push({ date: info.startStr, cards: parseInt(milestoneCards), note: note });
                        document.getElementById('milestone-date').innerHTML = `Zwischenziel: ${info.startStr}, ${milestoneCards} Karten, Notiz: ${note}`;
                        addCalendarEvent(info.startStr, 'Zwischenziel', 'event-milestone');
                        isSettingMilestone = false;
                        calculateDailyCards();
                    }
                }
            },
            eventClick: function(info) {
                if (info.event.title === 'Zwischenziel') {
                    if (confirm('Möchten Sie dieses Zwischenziel wirklich entfernen?')) {
                        milestones = milestones.filter(milestone => milestone.date !== info.event.startStr);
                        info.event.remove();
                        calculateDailyCards();
                    }
                }
            }
        });
        calendar.render();
    }

    function addCalendarEvent(date, title, className) {
        calendar.addEvent({
            start: date,
            title: title,
            classNames: [className]
        });
    }

    function calculateDailyCards() {
        const stackSelect = document.getElementById('stack-select').value;
        const cardCounts = {
            'innovation-projektmanagement': 30,
            'strategieentwicklung': 40,
            'web-app': 50
        };
        const totalCards = cardCounts[stackSelect];
        const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
        let remainingCards = totalCards;
        let remainingDays = totalDays;
        let dailyCards = [];

        milestones.forEach((milestone, index) => {
            const milestoneDate = new Date(milestone.date);
            const milestoneDays = (milestoneDate - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
            const cardsForMilestone = Math.ceil((milestone.cards - (dailyCards.reduce((a, b) => a + b, 0))) / milestoneDays);

            for (let i = 0; i < milestoneDays; i++) {
                dailyCards.push(cardsForMilestone);
            }

            remainingCards -= milestone.cards;
            remainingDays -= milestoneDays;
        });

        const cardsForRemainingDays = Math.ceil(remainingCards / remainingDays);
        for (let i = 0; i < remainingDays; i++) {
            dailyCards.push(cardsForRemainingDays);
        }

        displayDailyCards(dailyCards);
    }

    function displayDailyCards(dailyCards) {
        const start = new Date(startDate);
        calendar.removeAllEvents();
        addCalendarEvent(startDate, 'Startzeitpunkt', 'event-start');
        addCalendarEvent(endDate, 'Endzeitpunkt', 'event-end');
        milestones.forEach(milestone => {
            addCalendarEvent(milestone.date, 'Zwischenziel', 'event-milestone');
        });
        dailyCards.forEach((cards, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            calendar.addEvent({
                start: date,
                title: `${cards} Karten`
            });
        });

        updateCardsToday(dailyCards);
    }

    function updateCardsToday(dailyCards) {
        const today = new Date();
        const start = new Date(startDate);
        const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const cardsToday = daysSinceStart >= 0 && daysSinceStart < dailyCards.length ? dailyCards[daysSinceStart] : 0;
        cardsTodayText.textContent = `Du hast heute noch ${cardsToday} Karten zu lernen`;
    }

    function updateCardsTodayFromAllPlans() {
        let totalCardsToday = 0;
        const today = new Date().toISOString().split('T')[0];
        for (const planName in plans) {
            const dailyCards = calculateDailyCardsForDate(plans[planName], today);
            totalCardsToday += dailyCards;
        }
        cardsTodayText.textContent = `Du hast heute noch ${totalCardsToday > 0 ? totalCardsToday : '-'} Karten zu lernen`;
    }

    function calculateDailyCardsForDate(plan, date) {
        const stackSelect = plan.stackSelect;
        const cardCounts = {
            'innovation-projektmanagement': 30,
            'strategieentwicklung': 40,
            'web-app': 50
        };
        const totalCards = cardCounts[stackSelect];
        const totalDays = (new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24) + 1;
        let remainingCards = totalCards;
        let remainingDays = totalDays;
        let dailyCards = [];
        let result = 0;

        plan.milestones.forEach((milestone, index) => {
            const milestoneDate = new Date(milestone.date);
            const milestoneDays = (milestoneDate - new Date(plan.startDate)) / (1000 * 60 * 60 * 24) + 1;
            const cardsForMilestone = Math.ceil((milestone.cards - (dailyCards.reduce((a, b) => a + b, 0))) / milestoneDays);

            for (let i = 0; i < milestoneDays; i++) {
                dailyCards.push(cardsForMilestone);
                if (new Date(plan.startDate).setDate(new Date(plan.startDate).getDate() + i) === new Date(date)) {
                    result = cardsForMilestone;
                }
            }

            remainingCards -= milestone.cards;
            remainingDays -= milestoneDays;
        });

        const cardsForRemainingDays = Math.ceil(remainingCards / remainingDays);
        for (let i = 0; i < remainingDays; i++) {
            dailyCards.push(cardsForRemainingDays);
            if (new Date(plan.startDate).setDate(new Date(plan.startDate).getDate() + i) === new Date(date)) {
                result = cardsForRemainingDays;
            }
        }

        return result;
    }

    createScheduleBtn.onclick = function () {
        editModal.style.display = 'none';
        createModal.style.display = 'block';
        renderCalendar();
    };

    editScheduleBtn.onclick = function () {
        createModal.style.display = 'none';
        editModal.style.display = 'block';
        populatePlans();
    };

    closeButtons.forEach(function (button) {
        button.onclick = function () {
            if (button.closest('#create-modal')) {
                if (confirm("Möchtest du wirklich abbrechen? Alle neuen Änderungen gehen verloren.")) {
                    createModal.style.display = 'none';
                    resetForm();
                }
            } else {
                editModal.style.display = 'none';
            }
        }
    });

    window.onclick = function (event) {
        if (event.target == createModal) {
            if (confirm("Möchtest du wirklich abbrechen? Alle neuen Änderungen gehen verloren.")) {
                createModal.style.display = 'none';
                resetForm();
            }
        }
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    };

    savePlanBtn.onclick = function () {
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

        plans[planName] = { name: planName, startDate, endDate, milestones: [...milestones], totalCards, stackSelect };
        updateProgressDisplay();
        resetForm();
        createModal.style.display = 'none';
        updateCardsTodayFromAllPlans();
    };

    cancelPlanBtn.onclick = function () {
        if (confirm("Möchtest du wirklich abbrechen? Alle neuen Änderungen gehen verloren.")) {
            createModal.style.display = 'none';
            resetForm();
        }
    };

    setMilestoneBtn.onclick = function () {
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
        const today = new Date().toISOString().split('T')[0];
        let totalCardsToday = 0;
        const sortedPlans = Object.values(plans).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        sortedPlans.forEach(plan => {
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            const progressText = document.createElement('span');
            const now = new Date();
            const startTime = new Date(plan.startDate);
            const totalTime = (new Date(plan.endDate) - startTime) / (1000 * 60 * 60 * 24);
            const elapsedTime = (now - startTime) / (1000 * 60 * 60 * 24);
            const timeDiff = Math.ceil((startTime - now) / (1000 * 60 * 60 * 24));
            const dailyCards = calculateDailyCardsForDate(plan, today);

            if (elapsedTime < 0) {
                progressText.textContent = `Plan "${plan.name}" startet in ${timeDiff} Tagen`;
                progressText.style.textAlign = 'center';
                progressBar.appendChild(progressText);
            } else {
                const progressPercent = Math.min((elapsedTime / totalTime) * 100, 100).toFixed(2);
                progressText.innerHTML = `${plan.name}: ${plan.startDate} - ${plan.endDate} <div class="percentage">${progressPercent}%</div>`;
                const progress = document.createElement('div');
                progress.classList.add('progress');
                progress.style.width = `${progressPercent}%`;
                progress.style.background = `linear-gradient(to right, #4facfe ${progressPercent}%, #00f2fe)`;
                progressBar.appendChild(progress);
                progressBar.appendChild(progressText);
            }

            progressContainer.appendChild(progressBar);
            totalCardsToday += dailyCards;
        });

        cardsTodayText.textContent = `Du hast heute noch ${totalCardsToday > 0 ? totalCardsToday : '-'} Karten zu lernen`;
    }

    selectPlan.onchange = function () {
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
                title: selectedPlan,
                classNames: ['event-start']
            });
            plan.milestones.forEach(milestone => {
                calendar.addEvent({
                    start: milestone.date,
                    title: 'Zwischenziel',
                    classNames: ['event-milestone'],
                    extendedProps: {
                        cards: milestone.cards,
                        note: milestone.note
                    }
                });
            });
            calculateDailyCards();
        }
    };

    editSelectedPlanBtn.onclick = function () {
        const selectedPlan = selectPlan.value;
        const plan = plans[selectedPlan];
        if (plan) {
            document.getElementById('plan-name').value = selectedPlan;
            startDate = plan.startDate;
            endDate = plan.endDate;
            milestones = plan.milestones;
            createModal.style.display = 'block';
            editModal.style.display = 'none';
            renderCalendar();
            calendar.addEvent({
                start: startDate,
                end: endDate,
                title: selectedPlan,
                classNames: ['event-start']
            });
            plan.milestones.forEach(milestone => {
                calendar.addEvent({
                    start: milestone.date,
                    title: 'Zwischenziel',
                    classNames: ['event-milestone'],
                    extendedProps: {
                        cards: milestone.cards,
                        note: milestone.note
                    }
                });
            });
            calculateDailyCards();
        }
    };

    calendar.on('dateClick', function(info) {
        if (info.dateStr === startDate || info.dateStr === endDate) {
            if (confirm('Möchten Sie die aktuelle Zeitlinie durch eine neue ersetzen?')) {
                startDate = null;
                endDate = null;
                milestones = [];
                dateRange.innerHTML = '';
                calendar.unselect();
            }
        }
    });

    editOptions.addEventListener('click', function (event) {
        const action = event.target.getAttribute('data-action');
        if (!action) return;

        const selectedPlan = selectPlan.value;
        if (!plans[selectedPlan]) return;

        switch (action) {
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

    updateProgressDisplay();
});
