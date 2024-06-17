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
    let calendar;
    let isSettingMilestone = false;
    let startDate = null;
    let endDate = null;
    let milestones = [];

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
                calendar.addEvent({
                    title: `${cardsPerDay} Karten`,
                    start: currentDate.toISOString().split('T')[0],
                    display: 'background'
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

    createScheduleBtn.onclick = function() {
        renderCalendar();
        createModal.style.display = 'block';
    };

    editScheduleBtn.onclick = function() {
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
        createModal.style.display = 'none';
        // Hier würde der Code zum Speichern des Zeitplans stehen
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
});
