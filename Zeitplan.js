document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        firstDay: 1,
        selectable: true,
        select: function(info) {
            document.getElementById('date-range').innerText = `Gewählter Zeitraum: ${info.startStr} bis ${info.endStr}`;
        },
        events: []
    });
    calendar.render();

    const createScheduleBtn = document.getElementById('create-schedule-btn');
    const editScheduleBtn = document.getElementById('edit-schedule-btn');
    const createModal = document.getElementById('create-modal');
    const editModal = document.getElementById('edit-modal');
    const closeButtons = document.querySelectorAll('.close');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const cancelPlanBtn = document.getElementById('cancel-plan-btn');
    const setMilestoneBtn = document.getElementById('set-milestone-btn');
    const progressContainer = document.getElementById('progress-container');
    let milestoneDate = null;

    createScheduleBtn.onclick = function() {
        createModal.style.display = 'block';
    };

    editScheduleBtn.onclick = function() {
        editModal.style.display = 'block';
    };

    closeButtons.forEach(button => {
        button.onclick = function() {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
        };
    });

    savePlanBtn.onclick = function() {
        const stackSelect = document.getElementById('stack-select').value;
        const planName = document.getElementById('plan-name').value;
        const selectedDates = calendar.getSelection();
        if (selectedDates.length === 0) {
            alert('Bitte wählen Sie einen Zeitraum aus.');
            return;
        }
        const startDate = selectedDates[0].start;
        const endDate = selectedDates[0].end;

        const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        const cards = {
            'innovation-projektmanagement': 30,
            'strategieentwicklung': 40,
            'web-app': 50
        }[stackSelect];
        const cardsPerDay = Math.ceil(cards / totalDays);

        addProgressBar(planName, totalDays, cardsPerDay, startDate, endDate);
        createModal.style.display = 'none';
    };

    cancelPlanBtn.onclick = function() {
        createModal.style.display = 'none';
    };

    setMilestoneBtn.onclick = function() {
        const selectedDates = calendar.getSelection();
        if (selectedDates.length === 0) {
            alert('Bitte wählen Sie ein Datum für das Zwischenziel aus.');
            return;
        }
        milestoneDate = selectedDates[0].startStr;
        document.getElementById('milestone-date').innerText = `Zwischenziel: ${milestoneDate}`;
    };

    function addProgressBar(planName, totalDays, cardsPerDay, startDate, endDate) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <span>${planName}</span>
            <div class="progress"></div>
            <span class="timer"></span>
        `;
        progressContainer.appendChild(progressBar);

        const progress = progressBar.querySelector('.progress');
        const timer = progressBar.querySelector('.timer');
        const interval = setInterval(function() {
            const now = new Date();
            const timeDiff = new Date(endDate) - now;
            const daysElapsed = (now - new Date(startDate)) / (1000 * 60 * 60 * 24);
            const percentage = (daysElapsed / totalDays) * 100;
            progress.style.width = `${percentage}%`;
            timer.innerText = `${Math.floor(timeDiff / (1000 * 60 * 60)) % 24}h ${Math.floor(timeDiff / (1000 * 60)) % 60}m ${Math.floor(timeDiff / 1000) % 60}s`;

            if (timeDiff <= 0) {
                clearInterval(interval);
                timer.innerText = 'Zeit abgelaufen';
            }
        }, 1000);

        calendar.addEvent({
            title: planName,
            start: startDate,
            end: endDate,
            display: 'background'
        });

        if (milestoneDate) {
            calendar.addEvent({
                title: 'Zwischenziel',
                start: milestoneDate,
                end: milestoneDate,
                classNames: ['fc-event-milestone']
            });
        }
    }
});
