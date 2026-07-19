alert("SCHEDULE DOWNLOAD TELAH AKTIF");

console.log("schedule-download.js READY");
console.log("BEFORE FUNCTION");

window.downloadUpcomingSchedule = async function () {

    console.log("schedule-download.js loaded");
    console.log(window.allSchedule);

const res = await fetch("/download/up-schedule-temp.html");

console.log("FETCH:", res.status);

const html = await res.text();

console.log(html);

console.log("HTML LENGTH:", html.length);
const wrapper = document.createElement("div");
wrapper.innerHTML = html;
const target = wrapper.firstElementChild;

console.log("TARGET TEMPLATE:", target);

if(!target){
    console.error("download-schedule tidak ditemukan");
    return;
}

document.body.appendChild(target);

// LOAD DOWNLOAD CSS ONCE
if(!document.querySelector('link[href*="download.css"]')){
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/download.css";
    document.head.appendChild(link);
    await new Promise(resolve=>setTimeout(resolve,300));
};

const content = target.querySelector("#download-content");
const yearEl = target.querySelector("#download-year");
const moreEl = target.querySelector("#download-more");

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

console.log("target =", target);
console.log("yearEl =", yearEl);
console.log("content =", content);
console.log("moreEl =", moreEl);

    yearEl.textContent =
        years.length===1
            ? years[0]
            : `${years[0]}–${years[years.length-1]}`;

    // =========================
    // MAX 7 DATES
    // =========================

    const maxEvents = 8;
const displayEvents = events.slice(0, maxEvents);
const hasMore = events.length > maxEvents;
    
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
    `
);

    });


    // =========================
    // MORE
    // =========================

    if(hasMore){
    const hiddenEvents = events.length - displayEvents.length;
    moreEl.innerHTML = `
        +${hiddenEvents} more ↓
    `;
}else{
    moreEl.innerHTML = "";
}

// =========================
// SHOW FOR CAPTURE ONLY
// =========================

target.style.position="fixed";
target.style.left="0px";
target.style.top="0px";
target.style.visibility="none";
target.style.width="1080px";
target.style.height="1350px";

    // tunggu browser render
    requestAnimationFrame(()=>{
    requestAnimationFrame(async ()=>{

await document.fonts.ready;
await new Promise(resolve => setTimeout(resolve, 500));
await document.fonts.load("300 35px Inter"); // light
await document.fonts.load("500 35px Inter"); // medium
await document.fonts.load("600 35px Inter"); // semibold
await document.fonts.load("700 30px Inter"); // bold
await document.fonts.load("900 90px Inter"); // black

const images = target.querySelectorAll("img");
await Promise.all(
    [...images].map(img=>{
        if(img.complete) return Promise.resolve();
        return new Promise(resolve=>{
            img.onload = resolve;
            img.onerror = resolve;
        });
    })
);

console.log("TARGET:", target);
console.log("SIZE:", target.offsetWidth, target.offsetHeight);
console.log("HTML:", target.innerHTML);

console.log("BEFORE PNG");
console.log(target.offsetWidth, target.offsetHeight);
console.log(target.querySelector(".download-logo").naturalWidth);

const logo = target.querySelector(".download-logo");

console.log("LOGO:", {
    src: logo?.src,
    complete: logo?.complete,
    naturalWidth: logo?.naturalWidth,
    naturalHeight: logo?.naturalHeight
});

console.log("BEFORE FORCE SIZE");

target.style.width = "1080px";
target.style.height = "1350px";
target.style.boxSizing = "border-box";

console.log(
    "AFTER FORCE SIZE:",
    target.offsetWidth,
    target.offsetHeight
);

console.log(
  "INTER CHECK:",
  document.fonts.check("900 90px Inter")
);

const fontEmbedCSS = await htmlToImage.getFontEmbedCSS(target);

htmlToImage.toPng(target, {
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: "#91d3ca",
    fontEmbedCSS
            })
.then(function(dataUrl){

    const link=document.createElement("a");
    link.download="FLARE-U-Upcoming-Schedule.png";
    link.href=dataUrl;
    link.click();

    setTimeout(()=>{
        target.remove();
    },500);

})
.catch(function(err){
    console.error("PNG ERROR:", err);
    target.remove();
    alert("Failed to generate image.");

});

        });

    });

};

console.log("END FILE");
console.log(typeof window.downloadUpcomingSchedule);