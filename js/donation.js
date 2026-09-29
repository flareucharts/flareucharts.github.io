/* =========================================================
FLARE U GLOBAL
COMEBACK FUNDING
========================================================= */

console.log("DONATION JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   CONFIG
===================================================== */

/*
 * Replace this with your deployed
 * Google Apps Script Web App URL.
 *
 * Example:
 *
 * const API_URL =
 *     "https://script.google.com/macros/s/XXXXXXXX/exec";
 */

const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";


/*
 * Temporary estimated USD conversion rates.
 *
 * These are ONLY used for estimated campaign progress
 * and highest-amount sorting.
 *
 * Actual received amounts remain in their
 * original currency.
 */

const estimatedRates = {

    USD: 1,
    IDR: 1 / 17000,
    THB: 1 / 32,
    TWD: 1 / 31,
    PHP: 1 / 58

};


/* =====================================================
   ELEMENTS
===================================================== */

const supportBtn =
    document.getElementById("supportBtn");

const supportSection =
    document.getElementById("supportSection");

const supportForm =
    document.getElementById("supportForm");

const cancelSupport =
    document.getElementById("cancelSupport");

const formSuccess =
    document.getElementById("formSuccess");

const successClose =
    document.getElementById("successClose");

const paymentMethod =
    document.getElementById("paymentMethod");

const paymentDestination =
    document.getElementById("paymentDestination");
    
const paymentMethodLogo =
    document.getElementById("paymentMethodLogo");

const paymentLogo =
    document.getElementById("paymentLogo");

const destinationContent =
    document.getElementById("destinationContent");

const copyPaymentBtn =
    document.getElementById("copyPaymentBtn");

const paymentProof =
    document.getElementById("paymentProof");

const uploadText =
    document.getElementById("uploadText");

const supportMessage =
    document.getElementById("supportMessage");

const messageCount =
    document.getElementById("messageCount");

const sortSelect =
    document.getElementById("sortSelect");

const transactionList =
    document.getElementById("transactionList");

const currencySummary =
    document.getElementById("currencySummary");

const raisedAmount =
    document.getElementById("raisedAmount");
    
const fundingTarget =
    document.getElementById("fundingTarget");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const goalList =
    document.getElementById("goalList");


/* =====================================================
   STATE
===================================================== */

let transactions = [];

let fundingGoals = [];

let campaignTargetUSD = 1000;


/* =====================================================
   PAYMENT DESTINATIONS
===================================================== */

/*
 * These can later be moved into a
 * FUNDING_SETTINGS sheet if needed.
 */

const paymentInfo = {

    paypal: {
        logo: "../images/pay/paypal.png",
        alt: "PayPal",
        value: "paypal@example.com"
    },

    qris: {
        logo: "../images/pay/qris.png",
        alt: "QRIS",
        value: "Scan the QR code above to send your support."
    },

    other: {
        logo: "../images/pay/other.png",
        alt: "Other payment method",
        value: "Payment information will appear here."
    }

};


/* =====================================================
   OPEN FORM
===================================================== */

if (supportBtn) {

    supportBtn.addEventListener("click", () => {

        supportSection.hidden = false;

        supportSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


/* =====================================================
   CLOSE FORM
===================================================== */

if (cancelSupport) {

    cancelSupport.addEventListener("click", () => {

        supportSection.hidden = true;

        supportForm.hidden = false;

        formSuccess.hidden = true;

    });

}


/* =====================================================
   PAYMENT METHOD
===================================================== */

if (paymentMethod) {

paymentMethod.addEventListener("change", () => {

    const method =
        paymentMethod.value;


    if (
        !method ||
        !paymentInfo[method]
    ) {

        paymentDestination.hidden = true;

        paymentMethodLogo.hidden = true;

        return;

    }


    const info =
        paymentInfo[method];


    paymentLogo.src =
        info.logo;

    paymentLogo.alt =
        info.alt;


    destinationContent.textContent =
        info.value;


    paymentDestination.hidden = false;

    paymentMethodLogo.hidden = false;

});
}


/* =====================================================
   COPY PAYMENT DESTINATION
===================================================== */

if (copyPaymentBtn) {

    copyPaymentBtn.addEventListener(
        "click",
        async () => {

            const text =
                destinationContent.textContent.trim();

            if (!text) return;

            try {

                await navigator.clipboard.writeText(text);

                copyPaymentBtn.textContent =
                    "Copied!";

                setTimeout(() => {

                    copyPaymentBtn.textContent =
                        "Copy";

                }, 1500);

            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );

            }

        }
    );

}


/* =====================================================
   FILE UPLOAD
===================================================== */

if (paymentProof) {

    paymentProof.addEventListener(
        "change",
        () => {

            const file =
                paymentProof.files[0];

            if (!file) {

                uploadText.textContent =
                    "Upload payment screenshot";

                return;

            }

            uploadText.textContent =
                file.name;

        }
    );

}


/* =====================================================
   MESSAGE CHARACTER COUNT
===================================================== */

if (supportMessage) {

    supportMessage.addEventListener(
        "input",
        () => {

            messageCount.textContent =
                supportMessage.value.length;

        }
    );

}


/* =====================================================
   FORM SUBMIT
===================================================== */

supportForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        /* ---------------------------------------------
           CHECK API
        --------------------------------------------- */

        if (
            !API_URL ||
            API_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL"
        ) {

            alert(
                "Funding submission is not connected yet."
            );

            console.error(
                "Apps Script API URL is not configured."
            );

            return;

        }


        /* ---------------------------------------------
           FORM VALUES
        --------------------------------------------- */

        const name =
            document
                .getElementById("supporterName")
                .value
                .trim();


        const method =
            paymentMethod.value;


        const currency =
            document
                .getElementById("currency")
                .value;


        const amount =
            Number(
                document
                    .getElementById("supportAmount")
                    .value
            );


        const message =
            supportMessage.value.trim();


        const displayName =
            document.querySelector(
                'input[name="displayName"]:checked'
            )?.value || "public";


        const proofFile =
            paymentProof.files[0];


        /* ---------------------------------------------
           BASIC VALIDATION
        --------------------------------------------- */

        if (!name) {

            alert(
                "Please enter your name."
            );

            return;

        }


        if (!method) {

            alert(
                "Please select a payment method."
            );

            return;

        }


        if (!currency) {

            alert(
                "Please select a currency."
            );

            return;

        }


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;

        }


        if (!proofFile) {

            alert(
                "Please upload your payment proof."
            );

            return;

        }


        /* ---------------------------------------------
           FILE VALIDATION
        --------------------------------------------- */

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                proofFile.type
            )
        ) {

            alert(
                "Please upload a PNG, JPG or WEBP image."
            );

            return;

        }


        /*
         * Keep uploads reasonably small.
         *
         * Large screenshots should be compressed
         * before being sent to Apps Script.
         */

        if (
            proofFile.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Payment proof must be smaller than 5 MB."
            );

            return;

        }


        /* ---------------------------------------------
           SUBMIT BUTTON STATE
        --------------------------------------------- */

        const submitBtn =
            supportForm.querySelector(
                ".submit-btn"
            );


        const originalText =
            submitBtn.textContent;


        submitBtn.disabled = true;

        submitBtn.textContent =
            "Submitting...";


        try {

            /* -----------------------------------------
               CONVERT PROOF TO BASE64
            ----------------------------------------- */

            const proofData =
                await fileToBase64(
                    proofFile
                );


            /* -----------------------------------------
               BUILD PAYLOAD
            ----------------------------------------- */

            const payload = {

                action: "submitFunding",

                name,
                method,
                currency,

                /*
                 * Supporter's submitted amount.
                 *
                 * Actual Received is NOT sent
                 * by the supporter.
                 */

                submittedAmount: amount,

                message,

                displayName,

                proof: {

                    name:
                        proofFile.name,

                    type:
                        proofFile.type,

                    data:
                        proofData

                }

            };


            /* -----------------------------------------
               SEND TO APPS SCRIPT
            ----------------------------------------- */

            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(payload)

                }
            );


            /* -----------------------------------------
               SHOW SUCCESS
            ----------------------------------------- */

            supportForm.hidden = true;

            formSuccess.hidden = false;


        } catch (error) {

            console.error(
                "Funding submission failed:",
                error
            );

            alert(
                "Something went wrong while submitting your support. Please try again."
            );

        } finally {

            submitBtn.disabled = false;

            submitBtn.textContent =
                originalText;

        }

    }
);


/* =====================================================
   SUCCESS CLOSE
===================================================== */

if (successClose) {

    successClose.addEventListener(
        "click",
        () => {

            supportSection.hidden = true;

            supportForm.hidden = false;

            formSuccess.hidden = true;

            supportForm.reset();

            paymentDestination.hidden = true;

            uploadText.textContent =
                "Upload payment screenshot";

            messageCount.textContent =
                "0";

        }
    );

}


/* =====================================================
   FORMAT CURRENCY
===================================================== */

function formatCurrency(
    amount,
    currency
) {

    const numericAmount =
        Number(amount);


    if (
        !Number.isFinite(
            numericAmount
        )
    ) {

        return `${currency} 0`;

    }


    try {

        return new Intl.NumberFormat(
            "en-US",
            {

                style: "currency",

                currency,

                maximumFractionDigits:
                    [
                        "IDR",
                        "THB",
                        "TWD",
                        "PHP"
                    ].includes(currency)
                        ? 0
                        : 2

            }
        ).format(
            numericAmount
        );

    } catch {

        return `${currency} ${numericAmount}`;

    }

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-GB",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


/* =====================================================
   FORMAT DATE TIME
===================================================== */

function getTransactionDate(
    transaction
) {

    if (
        transaction.submittedAt
    ) {

        const parsed =
            new Date(
                transaction.submittedAt
            );

        if (
            !Number.isNaN(
                parsed.getTime()
            )
        ) {

            return parsed;

        }

    }


    if (
        transaction.date
    ) {

        const time =
            transaction.time ||
            "00:00:00";


        const parsed =
            new Date(
                `${transaction.date}T${time}`
            );


        if (
            !Number.isNaN(
                parsed.getTime()
            )
        ) {

            return parsed;

        }

    }


    return new Date(0);

}


/* =====================================================
   USD ESTIMATE
===================================================== */

function convertToEstimatedUSD(
    amount,
    currency
) {

    const numericAmount =
        Number(amount);


    const rate =
        estimatedRates[currency];


    if (
        !Number.isFinite(
            numericAmount
        ) ||
        !rate
    ) {

        return 0;

    }


    return numericAmount * rate;

}


/* =====================================================
   UPDATE CAMPAIGN PROGRESS
===================================================== */

function updateProgress() {

    let totalUSD = 0;


    /*
     * IMPORTANT:
     *
     * Only Actual Received is used here.
     */

    transactions.forEach(
        transaction => {

            const actualReceived =
                Number(
                    transaction.actualReceived
                );


            totalUSD +=
                convertToEstimatedUSD(
                    actualReceived,
                    transaction.currency
                );

        }
    );


    const target =
        Number(
            campaignTargetUSD
        ) || 0;


    if (!target) {

        raisedAmount.textContent =
            "~$0";

        progressPercent.textContent =
            "0%";

        progressFill.style.width =
            "0%";

        return;

    }


    const percentage =
        Math.min(
            (totalUSD / target) * 100,
            100
        );


    raisedAmount.textContent =
        `~$${totalUSD.toFixed(2)}`;


    progressPercent.textContent =
        `${percentage.toFixed(1)}%`;


    progressFill.style.width =
        `${percentage}%`;

}


/* =====================================================
   CURRENCY TOTALS
===================================================== */

function renderCurrencySummary() {

    const totals = {};


    /*
     * Only verified contributions are already
     * loaded into transactions.
     *
     * Therefore only Received = TRUE
     * reaches this calculation.
     */

    transactions.forEach(
        transaction => {

            const currency =
                transaction.currency;


            const amount =
                Number(
                    transaction.actualReceived
                );


            if (
                !currency ||
                !Number.isFinite(amount)
            ) {

                return;

            }


            if (
                !totals[currency]
            ) {

                totals[currency] = 0;

            }


            totals[currency] +=
                amount;

        }
    );


    currencySummary.innerHTML = "";


    const entries =
        Object.entries(
            totals
        );


    if (!entries.length) {

        currencySummary.innerHTML = `
            <div class="empty-state">
                No verified contributions yet.
            </div>
        `;

        return;

    }


    entries
        .sort(
            ([a], [b]) =>
                a.localeCompare(b)
        )
        .forEach(
            ([currency, amount]) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "currency-total";


                const label =
                    document.createElement(
                        "span"
                    );


                label.textContent =
                    currency;


                const value =
                    document.createElement(
                        "strong"
                    );


                value.textContent =
                    formatCurrency(
                        amount,
                        currency
                    );


                card.appendChild(
                    label
                );


                card.appendChild(
                    value
                );


                currencySummary.appendChild(
                    card
                );

            }
        );

}


/* =====================================================
   RENDER FUNDING GOALS
===================================================== */

function renderFundingGoals() {

    goalList.innerHTML = "";


    const activeGoals =
        fundingGoals.filter(
            goal =>
                goal.active !== false
        );


    if (
        !activeGoals.length
    ) {

        goalList.innerHTML = `
            <div class="empty-state">
                No funding goals available.
            </div>
        `;

        return;

    }


    activeGoals.forEach(
        goal => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "goal-item";


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "goal-icon";


            icon.textContent =
                goal.icon || "💚";


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "goal-info";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                goal.goal || "";


            const description =
                document.createElement(
                    "p"
                );


            description.textContent =
                goal.description ||
                "Estimated budget";


            info.appendChild(
                title
            );


            info.appendChild(
                description
            );


            const amount =
                document.createElement(
                    "strong"
                );


            amount.textContent =
                formatCurrency(
                    Number(
                        goal.amount
                    ) || 0,
                    goal.currency ||
                        "USD"
                );


            item.appendChild(
                icon
            );


            item.appendChild(
                info
            );


            item.appendChild(
                amount
            );


            goalList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   RENDER TRANSACTIONS
===================================================== */

function renderTransactions(
    list
) {

    transactionList.innerHTML = "";


    if (
        !list.length
    ) {

        transactionList.innerHTML = `
            <div class="empty-state">
                No verified contributions yet.
            </div>
        `;

        return;

    }


    list.forEach(
        transaction => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "transaction-item";


            const displayName =
                transaction.public
                    ? (
                        transaction.name ||
                        "Supporter"
                    )
                    : "Anonymous";


            const message =
                transaction.message
                    ? `
                        <p class="transaction-message">
                            “${escapeHTML(
                                transaction.message
                            )}”
                        </p>
                      `
                    : "";


            const transactionDate =
                getTransactionDate(
                    transaction
                );


            let dateText = "";


            if (
                transactionDate.getTime()
                !== 0
            ) {

                dateText =
                    transactionDate.toLocaleDateString(
                        "en-GB",
                        {

                            day: "2-digit",

                            month: "short",

                            year: "numeric"

                        }
                    );

            }


            const timeText =
                transaction.time
                    ? ` · ${escapeHTML(
                        transaction.time
                    )} KST`
                    : "";


            item.innerHTML = `

                <div class="transaction-main">

                    <div class="transaction-info">

                        <p class="transaction-name">
                            ${escapeHTML(
                                displayName
                            )}
                        </p>

                        <p class="transaction-meta">
                            ${escapeHTML(
                                dateText
                            )}
                            ${timeText}
                        </p>

                    </div>


                    <div class="transaction-amount">

                        <strong>
                            ${formatCurrency(
                                Number(
                                    transaction.actualReceived
                                ) || 0,
                                transaction.currency
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                transaction.currency ||
                                ""
                            )}
                        </small>

                    </div>

                </div>

                ${message}

            `;


            transactionList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   SORT TRANSACTIONS
===================================================== */

function sortTransactions() {

    const mode =
        sortSelect.value;


    const sorted =
        [...transactions];


    /* ---------------------------------------------
       LATEST
    --------------------------------------------- */

    if (
        mode === "latest"
    ) {

        sorted.sort(
            (a, b) =>
                getTransactionDate(b)
                    -
                getTransactionDate(a)
        );

    }


    /* ---------------------------------------------
       OLDEST
    --------------------------------------------- */

    if (
        mode === "oldest"
    ) {

        sorted.sort(
            (a, b) =>
                getTransactionDate(a)
                    -
                getTransactionDate(b)
        );

    }


    /* ---------------------------------------------
       HIGHEST
       Uses Actual Received
    --------------------------------------------- */

    if (
        mode === "highest"
    ) {

        sorted.sort(
            (a, b) =>
                convertToEstimatedUSD(
                    Number(
                        b.actualReceived
                    ) || 0,
                    b.currency
                )
                -
                convertToEstimatedUSD(
                    Number(
                        a.actualReceived
                    ) || 0,
                    a.currency
                )
        );

    }


    /* ---------------------------------------------
       CURRENCY
    --------------------------------------------- */

    if (
        mode === "currency"
    ) {

        sorted.sort(
            (a, b) =>
                (
                    a.currency || ""
                ).localeCompare(
                    b.currency || ""
                )
        );

    }


    renderTransactions(
        sorted
    );

}


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        sortTransactions
    );

}


/* =====================================================
   LOAD FUNDING DATA
===================================================== */

async function loadFundingData() {

    if (
        !API_URL ||
        API_URL ===
            "YOUR_APPS_SCRIPT_WEB_APP_URL"
    ) {

        console.warn(
            "Funding API URL has not been configured."
        );

        renderLoadingState(
            "Funding data will appear here."
        );

        renderGoalLoadingState(
            "Funding goals will appear here."
        );

        return;

    }


    try {

        /* ---------------------------------------------
           FUNDING DATA
        --------------------------------------------- */

        const fundingResponse =
            await fetch(
                `${API_URL}?action=funding`
            );


        if (
            !fundingResponse.ok
        ) {

            throw new Error(
                "Failed to load funding data."
            );

        }


        const fundingData =
            await fundingResponse.json();


        /*
         * Backend should already filter:
         *
         * Received = TRUE
         *
         * But we filter again here as an
         * additional safety layer.
         */

        const rawTransactions =
            Array.isArray(
                fundingData
            )
                ? fundingData
                : (
                    fundingData.data ||
                    []
                );


        transactions =
            rawTransactions
                .filter(
                    transaction =>
                        isReceived(
                            transaction.received
                        )
                )
                .map(
                    normalizeTransaction
                );


        /* ---------------------------------------------
           GOALS
        --------------------------------------------- */

        const goalsResponse =
            await fetch(
                `${API_URL}?action=fundingGoals`
            );


        if (
            !goalsResponse.ok
        ) {

            throw new Error(
                "Failed to load funding goals."
            );

        }


        const goalsData =
            await goalsResponse.json();


        const rawGoals =
            Array.isArray(
                goalsData
            )
                ? goalsData
                : (
                    goalsData.data ||
                    []
                );


        fundingGoals =
            rawGoals
                .filter(
                    goal =>
                        isActive(
                            goal.active
                        )
                )
                .map(
                    normalizeGoal
                );


        /* ---------------------------------------------
           CAMPAIGN TARGET
        --------------------------------------------- */

        const targetGoal =
            fundingGoals.reduce(
                (
                    total,
                    goal
                ) => {

                    if (
                        goal.currency !==
                        "USD"
                    ) {

                        return total;

                    }


                    return total +
                        (
                            Number(
                                goal.amount
                            ) || 0
                        );

                },
                0
            );


if (targetGoal > 0) {

    campaignTargetUSD =
        targetGoal;

    fundingTarget.textContent =
        `$${targetGoal.toLocaleString("en-US")}`;

}


        /* ---------------------------------------------
           RENDER
        --------------------------------------------- */

        updateProgress();

        renderCurrencySummary();

        sortTransactions();

        renderFundingGoals();


    } catch (error) {

        console.error(
            "Failed to load funding data:",
            error
        );


        renderLoadingState(
            "Unable to load funding data."
        );


        renderGoalLoadingState(
            "Unable to load funding goals."
        );

    }

}


/* =====================================================
   NORMALIZE TRANSACTION
===================================================== */

function normalizeTransaction(
    transaction
) {

    return {

        id:
            transaction.id ||
            "",

        name:
            transaction.name ||
            "",

        method:
            transaction.method ||
            "",

        currency:
            String(
                transaction.currency ||
                "USD"
            ).toUpperCase(),

        submittedAmount:
            Number(
                transaction.submittedAmount
            ) || 0,

        actualReceived:
            Number(
                transaction.actualReceived
            ) || 0,

        message:
            transaction.message ||
            transaction.note ||
            "",

        public:
            isPublic(
                transaction.display ||
                transaction.public
            ),

        date:
            transaction.date ||
            "",

        time:
            transaction.time ||
            "",

        submittedAt:
            transaction.submittedAt ||
            ""

    };

}


/* =====================================================
   NORMALIZE GOAL
===================================================== */

function normalizeGoal(
    goal
) {

    return {

        id:
            goal.id ||
            "",

        icon:
            goal.icon ||
            "💚",

        goal:
            goal.goal ||
            "",

        description:
            goal.description ||
            "Estimated budget",

        amount:
            Number(
                goal.amount
            ) || 0,

        currency:
            String(
                goal.currency ||
                "USD"
            ).toUpperCase(),

        active:
            isActive(
                goal.active
            )

    };

}


/* =====================================================
   RECEIVED CHECK
===================================================== */

function isReceived(
    value
) {

    if (
        value === true ||
        value === 1
    ) {

        return true;

    }


    const normalized =
        String(
            value
        )
            .trim()
            .toLowerCase();


    return (
        normalized === "true" ||
        normalized === "yes" ||
        normalized === "1" ||
        normalized === "received"
    );

}


/* =====================================================
   ACTIVE CHECK
===================================================== */

function isActive(
    value
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return true;

    }


    if (
        value === true ||
        value === 1
    ) {

        return true;

    }


    const normalized =
        String(
            value
        )
            .trim()
            .toLowerCase();


    return (
        normalized === "true" ||
        normalized === "yes" ||
        normalized === "1" ||
        normalized === "active"
    );

}


/* =====================================================
   PUBLIC CHECK
===================================================== */

function isPublic(
    value
) {

    if (
        value === true
    ) {

        return true;

    }


    const normalized =
        String(
            value ?? ""
        )
            .trim()
            .toLowerCase();


    return (
        normalized === "public" ||
        normalized === "true" ||
        normalized === "yes"
    );

}


/* =====================================================
   LOADING STATES
===================================================== */

function renderLoadingState(
    message
) {

    currencySummary.innerHTML = "";

    transactionList.innerHTML = `
        <div class="empty-state">
            ${escapeHTML(message)}
        </div>
    `;

}


function renderGoalLoadingState(
    message
) {

    goalList.innerHTML = `
        <div class="empty-state">
            ${escapeHTML(message)}
        </div>
    `;

}


/* =====================================================
   FILE → BASE64
===================================================== */

function fileToBase64(
    file
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                const result =
                    String(
                        reader.result
                    );


                /*
                 * Remove:
                 *
                 * data:image/jpeg;base64,
                 *
                 * and keep only the base64 content.
                 */

                const base64 =
                    result.includes(",")
                        ? result.split(",")[1]
                        : result;


                resolve(
                    base64
                );

            };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "Unable to read payment proof."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   INITIALIZE
===================================================== */

renderLoadingState(
    "Loading verified contributions..."
);


renderGoalLoadingState(
    "Loading funding goals..."
);


loadFundingData();

});
