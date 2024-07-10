document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var hoverCalendarEl = document.getElementById('hover-calendar-view');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        select: function(info) {
            document.getElementById('date-range').innerText = `Zeitraum: ${info.startStr} bis ${info.endStr}`;
        }
    });
    var hoverCalendar = new FullCalendar.Calendar(hoverCalendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: []
    });
    calendar.render();
    hoverCalendar.render();

    var createModal = document.getElementById('create-modal');
    var editModal = document.getElementById('edit-modal');
    var hoverCalendarModal = document.getElementById('hover-calendar');
    var createBtn = document.getElementById('create-schedule-btn');
    var editBtn = document.getElementById('edit-schedule-btn');
    var closeBtns = document.querySelectorAll('.close');
    var setMilestoneBtn = document.getElementById('set-milestone-btn');
    var savePlanBtn = document.getElementById('save-plan-btn');
    var cancelPlanBtn = document.getElementById('cancel-plan-btn');
    var scheduleContainer = document.getElementById('schedule-container');
    var hoverCalendarClose = document.getElementById('hover-calendar-close');

    createBtn.onclick = function() {
        createModal.style.display = 'block';
    };

    editBtn.onclick = function() {
        editModal.style.display = 'block';
        populatePlanSelect();
    };

    closeBtns.forEach(btn => {
        btn.onclick = function() {
            btn.closest('.modal').style.display = 'none';
        };
    });

    window.onclick = function(event) {
        if (event.target == createModal || event.target == editModal || event.target == hoverCalendarModal) {
            event.target.style.display = 'none';
        }
    };

    setMilestoneBtn.onclick = function() {
        var selectedDates = calendar.getDateRange();
        document.getElementById('milestone-date').innerText = `Zwischenziel gesetzt für: ${selectedDates.startStr}`;
    };

    savePlanBtn.onclick = function() {
        var planName = document.getElementById('plan-name').value;
        var dateRange = document.getElementById('date-range').innerText;
        if (planName && dateRange) {
            addScheduleItem(planName, dateRange);
            createModal.style.display = 'none';
        } else {
            alert('Bitte einen Namen und einen Zeitraum für den Zeitplan festlegen.');
        }
    };

    cancelPlanBtn.onclick = function() {
        createModal.style.display = 'none';
    };

    function populatePlanSelect() {
        var selectPlan = document.getElementById('select-plan');
        selectPlan.innerHTML = '';
        var plans = getPlans();
        plans.forEach(plan => {
            var option = document.createElement('option');
            option.value = plan.name;
            option.innerText = plan.name;
            selectPlan.appendChild(option);
        });
    }

    function addScheduleItem(planName, dateRange) {
        var scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');
        scheduleItem.innerHTML = `<span>${planName} - ${dateRange}</span><div class="progress"><div class="progress-bar"><span>0%</span></div></div>`;
        scheduleContainer.appendChild(scheduleItem);
        scheduleItem.addEventListener('mouseover', function() {
            hoverCalendarModal.style.display = 'flex';
            updateHoverCalendar(planName);
        });
    }

    function getPlans() {
        // Placeholder for getting the plans from local storage or server
        return [
            { name: 'Plan 1', dateRange: '2023-01-01 bis 2023-01-07' },
            { name: 'Plan 2', dateRange: '2023-01-08 bis 2023-01-14' }
        ];
    }

    function updateHoverCalendar(planName) {
        // Placeholder for updating the calendar with the selected plan events
        hoverCalendar.removeAllEvents();
        var events = [
            { title: 'Event 1', start: '2023-01-01', end: '2023-01-02' },
            { title: 'Event 2', start: '2023-01-03', end: '2023-01-04' }
        ];
        hoverCalendar.addEventSource(events);
    }

    hoverCalendarClose.onclick = function() {
        hoverCalendarModal.style.display = 'none';
    };
});
