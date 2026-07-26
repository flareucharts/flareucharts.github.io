function loadPage() {
 
document.getElementById("schedule-content").innerHTML = `
    <div class="schedule-loading">Loading...</div>
`;
 fetch("https://script.google.com/macros/s/AKfycbwzj_Z803mGAjpNHEUAAq5NFlDyZEV4Rzm2sipYNVxO2xski0LreN1D_kms9Jx9UQ3ASQ/exec")
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

window.allSchedule = [];

let currentMonthIndex = 0;
let groupedMonths = [];

function renderSchedule(schedule){
  window.allSchedule = schedule;

  const container =
    document.getElementById("schedule-content");

  // GROUP PER MONTH
  const grouped = {};
  schedule.forEach(item=>{
    const date = new Date(item.date);

const month = date.toLocaleString("en-US",{
  month:"long",
  year:"numeric"
}).toUpperCase();

if(!grouped[month]){
  grouped[month] = [];
}

grouped[month].push(item);
  });

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

  groupedMonths = Object.keys(grouped).sort((a, b) => {
  return new Date(grouped[a][0].date) - new Date(grouped[b][0].date);
});
  
  let html = `
<div class="download-hint" id="download-hint">
  Download Upcoming Schedule
</div>

<button
    class="download-fab"
    onclick="downloadUpcomingSchedule();hideDownloadHint();"
    aria-label="Download Upcoming Schedule">

<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 4V15" />
  <path d="M7 10L12 15L17 10" />
  <path d="M5 20H19" />
</svg>

</button>
`;

groupedMonths.forEach(month=>{
    const events = grouped[month];
    const date = new Date(events[0].date);

const monthIndex = date.getMonth();
const year = date.getFullYear();
    const firstDay =
      new Date(year, monthIndex, 1).getDay();
    const lastDate =
      new Date(year, monthIndex + 1, 0).getDate();
    const eventDates =
events.map(e=>
new Date(e.date).getDate()
);
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
      const key =
new Date(item.date).getDate();
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
              ${new Date(group[0].date)
.toLocaleString("en-US",{
month:"short"
}).toUpperCase()}
            </div>

            <div class="event-day">
              ${new Date(group[0].date).getDate()}
            </div>
          </div>

          <div class="event-info">
            ${group.map(e=>`
              <div class="event-line">
                <span class="event-time-inline">
                  ${e.time}
                </span>

                <span class="event-name">
  ${e.cat} ${e.title}
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
          </div>

          <div class="calendar-grid">
            ${calendarHTML}
          </div>
        </div>

        <div class="event-section">
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
showDownloadHint();
  // SHOW FIRST MONTH
  const sections = document.querySelectorAll(".month-section");

const now = new Date();

const currentMonth = now.toLocaleString("en-US", {
  month: "long",
  year: "numeric"
}).toUpperCase();

currentMonthIndex = groupedMonths.indexOf(currentMonth);

// kalau bulan sekarang tidak ada di data, tampilkan bulan pertama
if (currentMonthIndex === -1) {
  currentMonthIndex = 0;
}

sections.forEach((sec, i) => {
  sec.style.display =
    i === currentMonthIndex ? "block" : "none";
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

  const found = window.allSchedule.filter(item=>{
  const d = new Date(item.date);
  return (
  d.toLocaleString("en-US",{
    month:"long",
    year:"numeric"
  }).toUpperCase() === month &&
  d.getDate() === day
);
});

  if(found.length === 0){
  popup.classList.remove("show");
  return;
}

  popup.innerHTML = `
  <div class="popup-date">
    ${new Date(found[0].date).toLocaleString("en-US",{
  month:"long"
}).toUpperCase()}
${new Date(found[0].date).getDate()},
${new Date(found[0].date).getFullYear()}
  </div>

  <div class="popup-title">
    ${found.map(e => `
      <div class="popup-line">
        <span class="popup-time-inline">${e.time}</span>
        <span class="popup-name">
  ${e.cat} ${e.title}
</span>
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

function showDownloadHint(){
  const hint = document.getElementById("download-hint");
  if(!hint) return;

  hint.classList.add("show");

  clearTimeout(window.downloadHintTimeout);
  window.downloadHintTimeout = setTimeout(()=>{
    hint.classList.remove("show");
  },3000);
}

function hideDownloadHint(){
  const hint = document.getElementById("download-hint");
  if(hint){
    hint.classList.remove("show");
  }
}

window.addEventListener("scroll", function(){
  const popup = document.getElementById("event-popup");
  if(popup){popup.classList.remove("show");
  }
});


loadPage();