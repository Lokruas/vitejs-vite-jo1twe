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

    let startDate = null;
    let endDate = null;
    let milestones = [];
    let isSettingMilestone = false;

    function renderCalendar() {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'de',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            dateClick: function(info) {
                if (isSettingMilestone) {
                    setMilestone(info.dateStr);
                    return;
                }
                if (!startDate) {
                    startDate = info.dateStr;
                    dateRange.innerHTML = `Start: ${startDate}`;
                } else if (!endDate) {
                    endDate = info.dateStr;
                    if (new Date(endDate) < new Date(startDate)) {
                        [startDate, endDate] = [endDate, startDate];
                    }
                    dateRange.innerHTML = `Zeitraum: ${startDate} - ${endDate}`;
                    calculateCardsPerDay();
                }
            }
        });
        calendar.render();
    }

    function calculateCardsPerDay() {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = Math.abs(end - start);
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const cardsPerDay = 5; // Annahme: 5 Karten pro Tag

        for (let i = 0; i <= daysDiff; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(currentDate.getDate() + i);
            const formattedDate = currentDate.toISOString().split('T')[0];

            calendar.addEvent({
                title: `${cardsPerDay} Karten`,
                start: formattedDate,
                color: 'blue'
            });
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

    document.querySelectorAll('.edit-option').forEach(button => {
        button.onclick = function() {
            alert(`Option ${button.innerHTML} gewählt.`);
        };
    });
});
