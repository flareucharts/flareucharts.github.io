function downloadUpcomingSchedule(){

console.log("schedule-download.js READY");

window.downloadUpcomingSchedule = function(){

console.log("schedule-download.js loaded");
console.log(window.allSchedule);

    const target = document.getElementById("download-schedule");
    const content = document.getElementById("download-content");

    const today = new Date();
    today.setHours(0,0,0,0);

    const events = window.allSchedule
        .filter(item=>{
            const d = new Date(item.date);
            d.setHours(0,0,0,0);
            return d >= today;
        })
        .sort((a,b)=>new Date(a.date)-new Date(b.date));

    if(events.length===0){
        alert("No upcoming schedule.");
        return;
    }

    let currentMonth = "";

    content.innerHTML = events.map(e=>{

        const d = new Date(e.date);

        const month = d.toLocaleString("en-US",{
            month:"short"
        }).toUpperCase();

        const day = String(d.getDate()).padStart(2,"0");

        const divider =
        currentMonth!==month
        ? `
        <div class="month-divider">
            <span>${month}</span>
        </div>
        `
        : "";

        currentMonth = month;

        return `
        ${divider}

        <div class="download-row">

            <div class="download-date">
                ${day}
            </div>

            <div class="download-time">
                ${e.time || "-"}
            </div>

            <div class="download-title">
                ${e.cat || ""} ${e.title}
            </div>

        </div>
        `;

    }).join("");

    target.style.left = "0";
target.style.visibility = "visible";
target.style.opacity = "1";

html2canvas(target,{
    scale:2,
    useCORS:true,
    backgroundColor:null
}).then(canvas=>{

    target.style.left = "-99999px";
    target.style.visibility = "hidden";
    target.style.opacity = "1";

    const link = document.createElement("a");
    link.download = "FLARE-U-Upcoming-Schedule.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
}