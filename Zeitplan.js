document.addEventListener('DOMContentLoaded', () => {
    const createScheduleBtn = document.getElementById('create-schedule');
    const editScheduleBtn = document.getElementById('edit-schedule');
    const createModal = document.getElementById('create-modal');
    const editModal = document.getElementById('edit-modal');
    const closeButtons = document.querySelectorAll('.close');
    const savePlanBtn = document.getElementById('save-plan');
    const cancelPlanBtn = document.getElementById('cancel-plan');
    const selectPlan = document.getElementById('select-plan');
    const editOptions = document.getElementById('edit-options');
    const setMilestoneBtn = document.getElementById('set-milestone');

    let calendar;
    let startDate, endDate;
    let milestones = [];
    let isSettingMilestone = false;

    function renderCalendar() {
        calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
            initialView: 'dayGridMonth',
            locale: 'de',
            height: 'auto',
            selectable: true,
            selectMirror: true,
            dateClick: (info) => {
                if (!startDate) {
                    startDate = info.dateStr;
                    document.getElementById('start-date').textContent = `Startdatum: ${startDate}`;
                    calendar.addEvent({
                        title: 'Startdatum',
                        start: startDate,
                        color: '#008000'
                    });
                } else if (!endDate) {
                    endDate = info.dateStr;
                    document.getElementById('end-date').textContent = `Enddatum: ${endDate}`;
                    calendar.addEvent({
                        title: 'Enddatum',
                        start: endDate,
                        color: '#FF0000'
                    });
                    calculateCardAssignments();
                } else if (isSettingMilestone) {
                    addMilestone(info.dateStr);
                }
            }
        });
        calendar.render();
    }

    function calculateCardAssignments() {
        let days = [];
        let currentDate = new Date(startDate);
        let endDateObj = new Date(endDate);
        while (currentDate <= endDateObj) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        days.forEach(day => {
            calendar.addEvent({
                title: `Karten: ${Math.floor(Math.random() * 10) + 1}`,
                start: day,
                display: 'background',
                backgroundColor: '#ADD8E6'
            });
        });

        document.querySelectorAll('.fc-daygrid-day').forEach(dayEl => {
            dayEl.addEventListener('mouseover', () => {
                let date = dayEl.getAttribute('data-date');
                let cardsInfo = calendar.getEvents().find(event => event.startStr === date && event.display === 'background');
                if (cardsInfo) {
                    dayEl.setAttribute('title', cardsInfo.title);
                }
            });
        });
    }

    function addMilestone(date) {
        milestones.push(date);
        const milestoneEl = document.createElement('p');
        milestoneEl.textContent = `Zwischenziel: ${date}`;
        document.getElementById('milestone-date').appendChild(milestoneEl);
        calendar.addEvent({
            title: 'Zwischenziel',
            start: date,
            color: '#FFA500'
        });
        isSettingMilestone = false;
    }

    createScheduleBtn.addEventListener('click', () => {
        createModal.style.display = 'block';
        renderCalendar();
    });

    editScheduleBtn.addEventListener('click', () => {
        editModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === createModal || event.target === editModal) {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
        }
    });

    savePlanBtn.addEventListener('click', () => {
        alert('Zeitplan gespeichert!');
    });

    cancelPlanBtn.addEventListener('click', () => {
        createModal.style.display = 'none';
    });

    selectPlan.addEventListener('change', () => {
        if (selectPlan.value) {
            editOptions.classList.remove('hidden');
        } else {
            editOptions.classList.add('hidden');
        }
    });

    setMilestoneBtn.addEventListener('click', () => {
        isSettingMilestone = true;
    });
});
