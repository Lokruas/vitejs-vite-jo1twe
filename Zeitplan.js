document.addEventListener('DOMContentLoaded', () => {
    const createScheduleBtn = document.getElementById('createSchedule');
    const editScheduleBtn = document.getElementById('editSchedule');
    const createModal = document.getElementById('createModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.querySelectorAll('.close');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const cancelPlanBtn = document.getElementById('cancelPlanBtn');
    const setMilestoneBtn = document.getElementById('setMilestoneBtn');
    const selectPlan = document.getElementById('selectPlan');
    const editOptions = document.getElementById('editOptions');
    const calendarEl = document.getElementById('calendar');
    const startDisplay = document.getElementById('startDisplay');
    const endDisplay = document.getElementById('endDisplay');
    const milestonesEl = document.getElementById('milestones');

    let calendar, startDate, endDate, isSettingMilestone = false, milestones = [];

    function renderCalendar() {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            selectable: true,
            select: function(info) {
                if (isSettingMilestone) {
                    addMilestone(info.startStr);
                } else if (!startDate) {
                    startDate = info.startStr;
                    startDisplay.textContent = `Startdatum: ${startDate}`;
                    calendar.addEvent({
                        title: 'Startdatum',
                        start: startDate,
                        color: '#008000'
                    });
                } else if (!endDate) {
                    endDate = info.startStr;
                    endDisplay.textContent = `Enddatum: ${endDate}`;
                    calendar.addEvent({
                        title: 'Enddatum',
                        start: endDate,
                        color: '#FF0000'
                    });
                    // Fügen Sie hier die Logik für den Hover-Effekt hinzu
                    calculateCardAssignments();
                }
            }
        });
        calendar.render();
    }

    function calculateCardAssignments() {
        // Beispielhafte Logik für die Berechnung der Karten pro Tag
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
                display: 'background'
            });
        });

        // Fügen Sie hier den Hover-Effekt hinzu
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
        milestonesEl.appendChild(milestoneEl);

        calendar.addEvent({
            title: 'Zwischenziel',
            start: date,
            color: '#FFA500'
        });
        isSettingMilestone = false;
    }

    // Event Listener für den Zeitplan erstellen Button
    createScheduleBtn.addEventListener('click', () => {
        createModal.style.display = 'block';
        renderCalendar();
    });

    // Event Listener für den Zeitpläne bearbeiten Button
    editScheduleBtn.addEventListener('click', () => {
        editModal.style.display = 'block';
    });

    // Event Listener für das Schließen der Modale
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            createModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    // Event Listener für den Abbrechen Button
    cancelPlanBtn.addEventListener('click', () => {
        createModal.style.display = 'none';
    });

    // Event Listener für den Speichern Button
    savePlanBtn.addEventListener('click', () => {
        alert('Zeitplan gespeichert!');
        createModal.style.display = 'none';
    });

    // Event Listener für den Dropdown-Select des Zeitplans
    selectPlan.addEventListener('change', () => {
        editOptions.classList.remove('hidden');
    });

    // Event Listener für den Zwischenziel Button
    setMilestoneBtn.addEventListener('click', () => {
        isSettingMilestone = true;
    });

    // Klick außerhalb des Modals schließt dieses
    window.addEventListener('click', (event) => {
        if (event.target === createModal) {
            createModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});
