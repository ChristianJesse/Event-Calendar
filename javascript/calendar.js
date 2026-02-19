// localStorage key
const STORAGE_KEY = 'fc-events-v1';

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveEvents(events) {
  //localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  renderEventList(events);
  console.log('Saved events:', events[0]);
}

function renderEventList(events) {
  const list = document.getElementById('eventList');
  list.innerHTML = '';
  if (!events || events.length === 0) {
    list.innerHTML = '<li class="small">(no events)</li>';
    return;
  }
  events.forEach(ev => {
    const li = document.createElement('li');
    li.textContent = `${ev.title} — ${new Date(ev.start).toLocaleString()}`;
    list.appendChild(li);
  });
}
// NDESSQAUAT\NDESSUAT
document.addEventListener('DOMContentLoaded', function() {
  const initialEvents = loadEvents();
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,prev,next today'
    },
    selectable: true,
    editable: true,
    navLinks: true,
    nowIndicator: true,
    dayMaxEvents: true,
    events: initialEvents,
    eventContent: function(arg) {
      let html = `<div style="font-weight: bold;">${arg.event.title} = ${arg.event.extendedProps.description}</div>`;
      return { html };
    },

    // select: function(info) {
    //   const title = prompt('Event title:');
    //   if (title) {
    //     const newEvent = {
    //       id: String(Date.now()),
    //       title,
    //       start: info.startStr,
    //       end: info.endStr || info.startStr,
    //       allDay: info.allDay
    //     };
    //     calendar.addEvent(newEvent);
    //     saveEvents(calendar.getEvents().map(mapEvent));
    //   }
    //   calendar.unselect();
    // },

    // eventClick: function(info) {
    //   const e = info.event;
    //   const newTitle = prompt('Edit title (leave empty to delete):', e.title);
    //   if (newTitle === null) return;

    //   if (newTitle === '') {
    //     if (confirm('Delete this event?')) e.remove();
    //   } else {
    //     e.setProp('title', newTitle);
    //   }
    //   saveEvents(calendar.getEvents().map(mapEvent));
    // },

    //eventDrop: () => saveEvents(calendar.getEvents().map(mapEvent)),
    //eventResize: () => saveEvents(calendar.getEvents().map(mapEvent))
  });

  calendar.render();
  renderEventList(initialEvents);

  document.getElementById('btnAdd').addEventListener('click', () => {
    Swal.fire({
      title: 'New Event',
      html: `
        <input type="text" id="eventTitle" placeholder="Event title" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
        <textarea id="eventDescription" placeholder="Event description (optional)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; min-height: 80px;"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Event',
      didOpen: () => {
        document.getElementById('eventTitle').focus();
      },
      preConfirm: () => {
        const title = document.getElementById('eventTitle').value;
        const description = document.getElementById('eventDescription').value;
        if (!title) {
          Swal.showValidationMessage('Please enter a title');
          return false;
        }
        return { title, description };
      }
    }).then((result) => {
      if (!result.isConfirmed) return;
      const { title, description } = result.value;

      const today = new Date();
      const iso = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const newEvent = { 
        id: String(Date.now()), 
        title, 
        description,
        start: iso, 
        allDay: true 
      };
      calendar.addEvent(newEvent);
      saveEvents(calendar.getEvents().map(mapEvent));

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        position: 'top',
        text: `"${title}" has been added to your calendar`,
        showConfirmButton: false,
        timer: 2000  
      });
    });
  });

  // document.getElementById('btnClear').addEventListener('click', () => {
  //   if (!confirm('Clear ALL saved events?')) return;
  //   calendar.getEvents().forEach(e => e.remove());
  //   saveEvents([]);
  // });
});

function mapEvent(ev) {
  return {
    id: ev.id,
    title: ev.title,
    start: ev.start.toISOString(),
    end: ev.end ? ev.end.toISOString() : null,
    allDay: ev.allDay
  };
}
