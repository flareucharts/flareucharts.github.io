console.log("schedule-download.js READY");

async function downloadSchedule(type = "upcoming") {

    console.log("DOWNLOAD TYPE:", type);
    console.log("ALL SCHEDULE:", window.allSchedule);

    const res = await fetch("/download/up-schedule-temp.html");

    console.log("FETCH:", res.status);

    const html = await res.text();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const target = wrapper.firstElementChild;

    if(!target){
        console.error("download-schedule tidak ditemukan");
        return;
    }

    document.body.appendChild(target);

    /* LOAD DOWNLOAD CSS */
    if(!document.querySelector('link[href*="download.css"]')){

        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "/css/download.css";

        document.head.appendChild(link);

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    /* ELEMENTS */

    const content = target.querySelector("#download-content");
    const yearEl = target.querySelector("#download-year");
    const titleEl = target.querySelector("#download-title");
    const moreEl = target.querySelector("#download-more");

    if(!content || !yearEl || !moreEl){
        console.error("Element download tidak lengkap");
        target.remove();
        return;
    }

    /* TODAY */

    const today = new Date();

    today.setHours(0,0,0,0);

    /* FILTER EVENTS */

    const events = (window.allSchedule || [])
    .filter(item => {

        const d = new Date(item.date);

        d.setHours(0,0,0,0);

        if(type === "today"){
            return d.getTime() === today.getTime();
        }

        return d >= today;

    })
    .sort((a,b) => {

        return new Date(a.date) - new Date(b.date);

    });

console.log("========== DOWNLOAD DEBUG ==========");
console.log("TYPE:", type);
console.log("ALL SCHEDULE:", window.allSchedule);
console.log("EVENTS:", events);
console.log("EVENT COUNT:", events.length);
console.log("====================================");

    /* NO EVENT */

    if(events.length === 0){

        alert(
            type === "today"
                ? "No schedule for today."
                : "No upcoming schedule."
        );

        target.remove();

        return;
    }

    /* =========================================
       TITLE + MODE
    ========================================= */

    if(type === "today"){

        target.classList.add("today-mode");

        if(titleEl){
            titleEl.textContent = "TODAY SCHEDULE";
        }

    }else{

        target.classList.remove("today-mode");

        if(titleEl){
            titleEl.textContent = "UPCOMING SCHEDULE";
        }

    }

    /* =========================================
       YEAR
    ========================================= */

    if(type === "today"){

        yearEl.textContent = today.getFullYear();

    }else{

        const years = [
            ...new Set(
                events.map(event =>
                    new Date(event.date).getFullYear()
                )
            )
        ];

        yearEl.textContent =
            years.length === 1
                ? years[0]
                : `${years[0]}–${years[years.length - 1]}`;

    }

    /* =========================================
       TODAY SCHEDULE
    ========================================= */

    if(type === "today"){

        const d = new Date(events[0].date);

        const weekday = d.toLocaleString("en-US", {
            weekday:"long"
        });

        const day = d.getDate();

        const month = d.toLocaleString("en-US", {
            month:"short"
        });

        const dateLabel =
            `${weekday}, ${day} ${month}`;

        content.innerHTML = `

            <div class="today-date">
                ${dateLabel}
            </div>

            <div class="today-events"></div>

        `;

        const eventsBox =
            content.querySelector(".today-events");

        events.forEach(event => {

            const eventEl =
                document.createElement("div");

            eventEl.className = "today-event";

            eventEl.innerHTML = `

                <span class="time">
                    ${event.time || "-"}
                </span>

                <span class="title">
                    ${String(event.cat || "")}
                    ${String(event.title || "")}
                </span>

            `;

            eventsBox.appendChild(eventEl);

        });

        /*
         * TODAY TIDAK PAKAI +MORE
         */

        moreEl.innerHTML = "";

    }

    /* =========================================
       UPCOMING SCHEDULE
    ========================================= */

    else{

        const maxEvents = 8;

        const displayEvents =
            events.slice(0, maxEvents);

        const hasMore =
            events.length > maxEvents;

        content.innerHTML = "";

        let currentMonth = "";
        let currentDate = "";

        let dayGroup = null;
        let eventsBox = null;

        displayEvents.forEach(event => {

            const d = new Date(event.date);

            const month =
                d.toLocaleString("en-US", {
                    month:"long"
                }).toUpperCase();

            const dateKey =
                d.getFullYear() +
                "-" +
                String(d.getMonth() + 1).padStart(2,"0") +
                "-" +
                String(d.getDate()).padStart(2,"0");

            /* MONTH */

            if(month !== currentMonth){

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

            /* DATE */

            if(dateKey !== currentDate){

                currentDate = dateKey;

                dayGroup =
                    document.createElement("div");

                dayGroup.className =
                    "download-day-group";

                dayGroup.innerHTML = `

                    <div class="download-date">
                        ${d.getDate()}
                    </div>

                    <div class="download-events"></div>

                `;

                content.appendChild(dayGroup);

                eventsBox =
                    dayGroup.querySelector(
                        ".download-events"
                    );
            }

            /* EVENT */

            eventsBox.insertAdjacentHTML(
                "beforeend",
                `
                <div class="download-event">

                    <span class="time">
                        ${event.time || "-"}
                    </span>

                    <span class="title">
                        ${String(event.cat || "")}
                        ${String(event.title || "")}
                    </span>

                </div>
                `
            );

        });

        /* MORE */

        if(hasMore){

            const hiddenEvents =
                events.length - displayEvents.length;

            moreEl.innerHTML =
                `+${hiddenEvents} more ↓`;

        }else{

            moreEl.innerHTML = "";

        }

    }

    /* =========================================
       PREPARE IMAGE
    ========================================= */

    /* PREPARE IMAGE */

target.style.position = "fixed";
target.style.left = "0px";
target.style.top = "0px";
target.style.visibility = "none";

target.style.width = "1080px";
target.style.boxSizing = "border-box";

/*
    TODAY = dynamic height
    UPCOMING = fixed 1080 x 1350
*/
if(type === "today"){

    /*
        Biarkan browser menghitung
        tinggi berdasarkan isi.
    */
    target.style.height = "auto";

    /*
        Sedikit padding bawah supaya
        isi tidak terlalu mepet.
    */
    target.style.paddingBottom = "80px";

}else{

    target.style.height = "1350px";

}

    /* =========================================
       WAIT FOR RENDER
    ========================================= */

    requestAnimationFrame(() => {

        requestAnimationFrame(async () => {

            await document.fonts.ready;

            await new Promise(resolve =>
                setTimeout(resolve, 500)
            );

            await document.fonts.load(
                "300 35px Inter"
            );

            await document.fonts.load(
                "500 35px Inter"
            );

            await document.fonts.load(
                "600 35px Inter"
            );

            await document.fonts.load(
                "700 30px Inter"
            );

            await document.fonts.load(
                "900 90px Inter"
            );

            /* IMAGES */

            const images =
                target.querySelectorAll("img");

            await Promise.all(

                [...images].map(img => {

                    if(img.complete){
                        return Promise.resolve();
                    }

                    return new Promise(resolve => {

                        img.onload = resolve;
                        img.onerror = resolve;

                    });

                })

            );

            /* FORCE SIZE */

            target.style.width = "1080px";
target.style.boxSizing = "border-box";

if(type === "today"){

    /*
        Ambil tinggi asli dari isi Today Schedule
    */
    const contentHeight = target.scrollHeight;

    target.style.height = `${contentHeight}px`;

}else{

    target.style.height = "1350px";

}

console.log(
    "FINAL SIZE:",
    target.offsetWidth,
    target.offsetHeight
);

            
            /* FONT EMBED */

            const fontEmbedCSS =
                await htmlToImage.getFontEmbedCSS(
                    target
                );

            /* =========================================
               CREATE PNG
            ========================================= */

            htmlToImage.toPng(target, {

                pixelRatio: 1,

                cacheBust: true,

                backgroundColor: "#91d3ca",

                fontEmbedCSS

            })

            .then(function(dataUrl){

                const link =
                    document.createElement("a");

                link.download =
                    type === "today"
                        ? "FLARE-U-Today-Schedule.png"
                        : "FLARE-U-Upcoming-Schedule.png";

                link.href = dataUrl;

                link.click();

                setTimeout(() => {

                    target.remove();

                }, 500);

            })

            .catch(function(err){

                console.error(
                    "PNG ERROR:",
                    err
                );

                target.remove();

                alert(
                    "Failed to generate image."
                );

            });

        });

    });

}


/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.downloadTodaySchedule = function(){
    return downloadSchedule("today");
};

window.downloadUpcomingSchedule = function(){
    return downloadSchedule("upcoming");
};

console.log(
    "Upcoming:",
    typeof window.downloadUpcomingSchedule
);

console.log(
    "Today:",
    typeof window.downloadTodaySchedule
);