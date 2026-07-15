function loadPage() {
  fetch("https://script.google.com/macros/s/AKfycbwsYIjF8eJTi54N40LE7pfyT6ZJw5wGTNKK5_2j26qf6T3AsmljVklTc5CReCaz4FbvQg/exec")
    .then(res => res.json())
    .then(data => {
      console.log("DATA:", data);
      if (!data.schedule) {
        console.error("No schedule data!", data);
        return;
      }
      renderSchedule(data.schedule);
    })
    .catch(err => {
      console.error("Fetch error:", err);
    });
}

let allSchedule = [];

let currentMonthIndex = 0;
let groupedMonths = [];
function renderSchedule(schedule){
  allSchedule = schedule;
  const container =
    document.getElementById("schedule-content");

  // GROUP PER MONTH
  const grouped = {};
  schedule.forEach(item=>{
    if(!grouped[item.month]){
      grouped[item.month] = [];
    }
    grouped[item.month].push(item);
  });
  groupedMonths = Object.keys(grouped);
  const monthNames = {
    JANUARY:0,
    FEBRUARY:1,
    MARCH:2,
    APRIL:3,
    MAY:4,
    JUNE:5,
    JULY:6,
    AUGUST:7,
    SEPTEMBER:8,
    OCTOBER:9,
    NOVEMBER:10,
    DECEMBER:11
  };

  let html = "";

  Object.keys(grouped).forEach(month => {
    const events = grouped[month];
    const monthIndex =
      monthNames[month.toUpperCase()];
    const year = 2026;
    const firstDay =
      new Date(year, monthIndex, 1).getDay();
    const lastDate =
      new Date(year, monthIndex + 1, 0).getDate();
    const eventDates =
      events.map(e => Number(e.date));
    const dayNames =
      ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    
    let calendarHTML = "";
    // DAY NAMES
    dayNames.forEach(day=>{
      calendarHTML += `
        <div class="day-name">${day}</div>
      `;
    });

    // EMPTY
    for(let i=0;i<firstDay;i++){
      calendarHTML += `
        <div class="day empty"></div>
      `;
    }

    // DAYS
    for(let d=1; d<=lastDate; d++){
      const hasEvent =
        eventDates.includes(d);
      calendarHTML += `
        <div
          class="day ${hasEvent ? 'event' : ''}"
          onclick="showEvent('${month}', ${d}, this)"
        >
          ${d}
        </div>
      `;
    }

    // GROUP EVENTS
    const groupedEvents = {};
    events.forEach(item=>{
      const key = item.date;
      if(!groupedEvents[key]){
        groupedEvents[key] = [];
      }

      groupedEvents[key].push(item);
    });

    const eventCards =
      Object.values(groupedEvents)
      .map(group=>`
        <div class="event-card">
          <div class="event-date-box">
            <div class="event-month">
              ${group[0].month}
            </div>

            <div class="event-day">
              ${group[0].date}
            </div>
          </div>

          <div class="event-info">
            ${group.map(e=>`
              <div class="event-line">
                <span class="event-time-inline">
                  ${e.time}
                </span>

                <span class="event-name">
                  ${e.title}
                </span>
              </div>

            `).join("")}
          </div>
        </div>
      `).join("");

    html += `
      <div class="month-section">
        <div class="calendar-card">
          <div class="calendar-top">

            <div class="calendar-month">
              ${month}
            </div>

            <div class="calendar-year">
              ${year}
            </div>
          </div>

          <div class="calendar-grid">
            ${calendarHTML}
          </div>
        </div>

        <div class="event-section">
  <button 
    class="download-btn"
    onclick="downloadMonthSchedule('${month}')">
    ↓ Download ${month} Schedule
  </button>
          <button
            class="event-toggle"
            onclick="toggleEvents('${month}', this)"
          >
            <span>⭐ View all events</span>
            <span class="dropdown-icon">
              ⌄
            </span>
          </button>
          <div class="event-list" id="events-${month}" style="display:none;">
            ${eventCards}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // SHOW FIRST MONTH
  const sections =
    document.querySelectorAll(".month-section");
  sections.forEach((sec, i)=>{
    sec.style.display =
      i === 0 ? "block" : "none";

  });
}

function nextMonth(){
  if(currentMonthIndex < groupedMonths.length - 1){
    currentMonthIndex++;
    document
      .querySelectorAll(".month-section")
      .forEach(el => el.style.display = "none");
    document
      .querySelectorAll(".month-section")[currentMonthIndex]
      .style.display = "block";
  }
}

function prevMonth(){
  if(currentMonthIndex > 0){
    currentMonthIndex--;
    document
      .querySelectorAll(".month-section")
      .forEach(el => el.style.display = "none");
    document
      .querySelectorAll(".month-section")[currentMonthIndex]
      .style.display = "block";
  }
}
  function showEvent(month, day, el){

  const popup = document.getElementById("event-popup");

  const found = allSchedule.filter(item => 
    item.month === month &&
    Number(item.date) === Number(day)
  );

  if(found.length === 0){
  popup.classList.remove("show");
  return;
}

  popup.innerHTML = `
  <div class="popup-date">
    ${found[0].month} ${found[0].date}, 2026
  </div>

  <div class="popup-title">
    ${found.map(e => `
      <div class="popup-line">
        <span class="popup-time-inline">${e.time}</span>
        <span class="popup-name">${e.title}</span>
      </div>
    `).join("")}
  </div>
`;

  // POSISI POPUP DEKAT TANGGAL
// POSISI POPUP
const rect = el.getBoundingClientRect();

popup.style.visibility = "hidden";
popup.classList.add("show");

const popupWidth = popup.offsetWidth;
const padding = 12;

let left = rect.left + rect.width / 2;
let transform = "translate(-50%, -100%)";

// kalau mentok kanan
if(left + popupWidth / 2 > window.innerWidth - padding){
  left = rect.right;
  transform = "translate(-100%, -100%)";
}
// kalau mentok kiri
if(left - popupWidth / 2 < padding){
  left = rect.left;
  transform = "translate(0%, -100%)";
}
const top = rect.top - 10;
popup.style.left = left + "px";
popup.style.top = top + "px";
popup.style.transform = transform;
popup.style.visibility = "visible";
  popup.classList.add("show");
  clearTimeout(window.popupTimeout);
  window.popupTimeout = setTimeout(()=>{
    popup.classList.remove("show");
  },3000);
}
  
  document.addEventListener("click", function(e){
  const popup = document.getElementById("event-popup");
  // kalau klik tanggal event → jangan close
  if(e.target.closest(".day.event")){
    return;
  }
  // klik area lain → close
  popup.classList.remove("show");
});
  
function toggleEvents(month, btn){
  const box = document.getElementById(`events-${month}`);
  const icon = btn.querySelector('.dropdown-icon');
  if(box.style.display === "none"){
    box.style.display = "block";
    icon.style.transform = "rotate(-45deg)";
  } else {
    box.style.display = "none";
    icon.style.transform = "rotate(135deg)";
  }
}

function downloadMonthSchedule(month){
  const target =
    document.getElementById("download-schedule");
  const content =
    document.getElementById("download-content");
  const title =
    document.getElementById("download-month");
  const events =
    allSchedule.filter(item =>
      item.month === month
    );

  title.innerHTML =
  `${month} 2026`;
content.innerHTML =
  events.map(e=>`
    <div class="download-item">
      <div class="download-date">
        ${e.date}
      </div>
      <div class="download-time">
        ${e.time}
      </div>
      <div class="download-title">
        ${e.title}
      </div>
    </div>
  `).join("");

html2canvas(target,{
  scale:2,
  useCORS:true
})
.then(canvas=>{
  const link = document.createElement("a");
  link.download =
  `FLARE-U-${month}-Schedule.png`;
  link.href =
  canvas.toDataURL("image/png");
  link.click();
});
}



window.addEventListener("scroll", function(){
  const popup = document.getElementById("event-popup");
  if(popup){popup.classList.remove("show");
  }
});
