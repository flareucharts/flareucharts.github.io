console.log("schedule-download.js READY");

window.downloadUpcomingSchedule = function () {

    console.log("schedule-download.js loaded");
    console.log(window.allSchedule);

    const target = document.getElementById("download-schedule");
    const content = document.getElementById("download-content");
    const yearEl = document.getElementById("download-year");
    const moreEl = document.getElementById("download-more");

console.log(target, content, yearEl, moreEl);

    const today = new Date();
    today.setHours(0,0,0,0);

    // =========================
    // UPCOMING EVENTS
    // =========================

    const events = (window.allSchedule || [])
        .filter(item => {
            const d = new Date(item.date);
            d.setHours(0,0,0,0);
            return d >= today;
        })
        .sort((a,b)=>new Date(a.date)-new Date(b.date));

    if(events.length===0){
        alert("No upcoming schedule.");
        return;
    }

    // =========================
    // YEAR
    // =========================

    const years = [
        ...new Set(
            events.map(e =>
                new Date(e.date).getFullYear()
            )
        )
    ];

    yearEl.textContent =
        years.length===1
            ? years[0]
            : `${years[0]}–${years[years.length-1]}`;

    // =========================
    // MAX 7 DATES
    // =========================

    const maxDates = 7;
    let displayEvents = [];
    let lastDateKey = "";
    let totalDates = 0;
    for(const event of events){
        const dateKey =
            new Date(event.date)
            .toISOString()
            .slice(0,10);
        if(dateKey!==lastDateKey){
            totalDates++;
            if(totalDates>maxDates){
                break;
            }
            lastDateKey = dateKey;
        }

        displayEvents.push(event);
    }
    const hasMore =
        displayEvents.length < events.length;

    // kosongkan isi lama
    content.innerHTML = "";
    // =========================
    // BUILD HTML
    // =========================
    let currentMonth = "";
    let currentDate = "";
    let dayGroup = null;
    let eventsBox = null;
    displayEvents.forEach(event=>{
        const d = new Date(event.date);
        const month = d.toLocaleString("en-US",{
            month:"long"
        }).toUpperCase();
        const dateKey = d.toISOString().slice(0,10);
        // =========================
        // MONTH
        // =========================

        if(month!==currentMonth){
            currentMonth = month;
            content.insertAdjacentHTML(
    "beforeend",
    `
    <div class="download-month">
        ${month}
    </div>

    <div class="download-line"></div>
    `
);
        }

        // =========================
        // DATE
        // =========================

        if(dateKey!==currentDate){

            currentDate = dateKey;

            dayGroup = document.createElement("div");
            dayGroup.className = "download-day-group";

            dayGroup.innerHTML = `

                <div class="download-date">
                    ${d.getDate()}
                </div>

                <div class="download-events"></div>

            `;

            content.appendChild(dayGroup);
            eventsBox =
        dayGroup.querySelector(".download-events");

        }

        // =========================
        // EVENT
        // =========================

        eventsBox.insertAdjacentHTML(
    "beforeend",
    `
    <div class="download-event">
    <span class="time">
        ${event.time || "-"}
    </span>
    <span class="title">
        ${String(event.cat || "")} ${String(event.title || "")}
    </span>
</div>
    </div>
    `
);

    });


    // =========================
    // MORE
    // =========================

    if(hasMore){

        const hiddenDates = new Set();

        events.slice(displayEvents.length).forEach(event=>{

            hiddenDates.add(
                new Date(event.date)
                    .toISOString()
                    .slice(0,10)
            );

        });

        moreEl.innerHTML = `
            More
            <br>
            ↓
            <br>
            +${hiddenDates.size} Date${hiddenDates.size>1?"s":""}
        `;

    }else{

        moreEl.innerHTML = "";

    }

    // =========================
    // SHOW
    // =========================

    target.style.left = "50%";
    target.style.top = "20px";
    target.style.transform = "translateX(-50%)";
    target.style.visibility = "visible";
    target.style.opacity = "1";

    // tunggu browser render
    requestAnimationFrame(()=>{

        requestAnimationFrame(()=>{

            htmlToImage.toPng(target,{
                pixelRatio:3,
                cacheBust:true
            }).then(function(dataUrl){

                target.style.left="-99999px";
                target.style.top="0";
                target.style.transform="";
                target.style.visibility="hidden";

                const link=document.createElement("a");
                link.download="FLARE-U-Upcoming-Schedule.png";
                link.href=dataUrl;
                link.click();

            }).catch(function(err){

                console.error(err);

                target.style.left="-99999px";
                target.style.top="0";
                target.style.transform="";
                target.style.visibility="hidden";

                alert("Failed to generate image.");

            });

        });

    });

};

console.log("END FILE");
console.log(typeof downloadUpcomingSchedule);
