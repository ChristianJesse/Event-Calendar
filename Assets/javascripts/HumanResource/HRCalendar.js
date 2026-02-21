/*
'    ********************************************************************************************************************************
'   Description:		HR
'	Author:				COORETO
'	History
'	Change Number	Date					Author								Description
'	00              19 Feb 2026				COORETO								Initial Creation
'
'	____________________________________________________________________________________________________________________________________
'	** For developers: Please update history For us To keep track Of the changes made On this source code
'
'	*********************************************************************************************************************************/



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

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (s) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s];
  });
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
    fixedWeekCount: true,
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
      const title = escapeHtml(arg.event.title);
      const desc = arg.event.extendedProps && arg.event.extendedProps.description;
      const icon = (desc === 'APPROVED')
        ? ' <i data-bs-toggle="tooltip" title="APPROVED" class="fas fa-thumbs-up" style="color: green; font-size:15px; margin-left: 3px;"></i>'
        : '';
      const bg = (desc === 'APPROVED') ? '#008b3c' : '#4e4485';
      const html = `<div style="font-weight: bold; background-color: ${bg}; padding: 4px 6px; border-radius: 6px; display: inline-block;">${title}${icon}</div>`;
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

  document.getElementById('btnHRAddOnlineApplication').addEventListener('click', () => {
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
