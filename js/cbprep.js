/* =========================
   COMEBACK CHECKLIST
========================= */

/* =========================
   SETTINGS
========================= */

const COMEBACK_CHECKLIST_ENABLED = true;


/* =========================
   CHECKLIST DATA
========================= */

const comebackChecklist = [

    {
    app: "BigC",
    logo: "images/apps/bigc.png",
    target: "Collect Free gems 💎 as many as possible",
    note: "Unlimited Voting | Multiple acc",
    link: "https://link.bigc.im/TCHy/app"
    },

    {
    app: "Idol Champ",
    logo: "images/apps/idolchamp.png",
    target: "Collect 💙/💖 as many as possible",
    note: "Unlimited voting | Multiple acc",
    link: " https://promo-web.idolchamp.com/app_proxy.html?deeplink="
    },

    {
    app: "Coogoong",
    logo: "images/apps/coogoong.jpg",
    target: "Collect 💙/💛 as many as possible",
    note: "Unlimited voting | Multiple acc",
    link: "https://open.coogoong.com/"
    },

    {
    app: "Muniverse",
    logo: "images/apps/muniverse.png",
    target: "Collect AD Lumy as many as possible | Live vote: 250 AD Lumy/acc",
    note: "Unlimited for pre-vote | Multiple acc",
    link: "https://www.muniverse.io/"
    },

    {
    app: "Mubeat",
    logo: "images/apps/mubeat.png",
    target: "Collect heartbeat as many as possible | Live vote: 150 💜/acc",
    note: "Unlimited for pre-vote | Multiple acc",
    link: "https://mubeat.applink.info/"
    },

    {
    app: "LinC",
    logo: "images/apps/linc.png",
    target: "1,500 fanpoints/acc (Pre-vote)",
    note: "Multiple acc | for a week vote",
    link: "https://app.linc.fan/"
    },

    {
    app: "Higher",
    logo: "images/apps/higher.png",
    target: "750💎 (Hot Stage) | 250💎 (Live vote)",
    note: "Multiple acc | for a week vote",
    link: "https://higher.fan/app/theme/"
    },

    {
    app: "DuckAd",
    logo: "images/apps/duckad.png",
    target: "Collect vts as many as possible",
    note: "for streaming sponsor k-streaming platform",
    link: "http://duckad.co.kr/xe/index.php?"
    },
    
    {
    app: "Mnet Plus",
    logo: "images/apps/mnetplus.webp",
    target: "No Collection",
    note: "Multiple Device",
    link: "https://mnetplus.onelink.me/"
    }

];


/* =========================
   LOCAL STORAGE
========================= */

const CHECKLIST_STORAGE_KEY =
    "flareU_comeback_checklist";


/* =========================
   GET KST DATE
========================= */

function getKSTDate() {

    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).format(new Date());

}


/* =========================
   LOAD SAVED DATA
========================= */

function loadChecklistData() {

    const today = getKSTDate();

    const saved =
        localStorage.getItem(
            CHECKLIST_STORAGE_KEY
        );


    /* No previous data */

    if (!saved) {

        return {
            date: today,
            checked: {}
        };

    }


    try {

        const data = JSON.parse(saved);


        /*
         * New KST day
         * → reset everything
         */

        if (data.date !== today) {

            const freshData = {
                date: today,
                checked: {}
            };

            localStorage.setItem(
                CHECKLIST_STORAGE_KEY,
                JSON.stringify(freshData)
            );

            return freshData;

        }


        return data;

    } catch (error) {

        console.error(
            "Comeback checklist storage error:",
            error
        );

        return {
            date: today,
            checked: {}
        };

    }

}


/* =========================
   SAVE DATA
========================= */

function saveChecklistData(data) {

    localStorage.setItem(
        CHECKLIST_STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================
   CREATE CHECKLIST
========================= */

function renderComebackChecklist() {

    const section =
        document.getElementById(
            "comeback-checklist"
        );

    const list =
        document.getElementById(
            "comeback-checklist-list"
        );


    if (!section || !list) return;


    /*
     * OFF
     */

    if (!COMEBACK_CHECKLIST_ENABLED) {

        section.hidden = true;

        return;

    }


    section.hidden = false;


    const data =
        loadChecklistData();


    list.innerHTML = "";


    comebackChecklist.forEach(
        (item, index) => {

            const checked =
                data.checked[index] === true;


            const row =
                document.createElement("div");

            row.className =
                "comeback-checklist-row";


            row.innerHTML = `

<div class="checklist-app">

    <img
        src="${item.logo}"
        alt="${item.app}"
        class="checklist-app-logo"
    >

</div>


                <div class="checklist-target">

                    <span>
                        ${item.target}
                    </span>

                    ${
                        item.note
                            ? `
                                <small>
                                    ${item.note}
                                </small>
                              `
                            : ""
                    }

                </div>


                <div class="checklist-check">

                    <label
                        class="checklist-checkbox"
                    >

                        <input
                            type="checkbox"
                            data-index="${index}"
                            ${checked ? "checked" : ""}
                        >

                        <span></span>

                    </label>

                </div>


<div class="checklist-action">

    <a
        href="${item.link}"
        class="checklist-open-app"
        target="_blank"
        rel="noopener noreferrer"
    >

        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3z"/>
            <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>
        </svg>

        <span>Open App</span>

    </a>

</div>

            `;


            list.appendChild(row);

        }
    );


    /*
     * Checkbox event
     */

    list
        .querySelectorAll(
            'input[type="checkbox"]'
        )
        .forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );


                        const currentData =
                            loadChecklistData();


                        currentData.checked[index] =
                            this.checked;


                        saveChecklistData(
                            currentData
                        );

                    }
                );

            }
        );

}


/* =========================
   INITIALIZE
========================= */

function initComebackChecklist() {

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            renderComebackChecklist
        );

    } else {

        renderComebackChecklist();

    }

}


initComebackChecklist();