/* =========================================================
   FLARE U GLOBAL
   FUNDING / DONATION
   FIREBASE VERSION
========================================================= */

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { db } from "./firebase.js";


/* =========================================================
   FUNDING STATUS
========================================================= */

const FUNDING_ENABLED = true;


/* =========================================================
   STATE
========================================================= */

let currentMethod = "kofi";
let currentSort = "latest";

let allFunding = [];
let allGoals = [];
let allExpenses = [];

let campaignTargetUSD = 0;


/* =========================================================
   MANUAL EXCHANGE RATES
   VALUE = USD EQUIVALENT
========================================================= */

const EXCHANGE_RATES = {
    USD: 1,
    IDR: 1 / 17000,
    THB: 1 / 32,
    TWD: 1 / 31,
    PHP: 1 / 58
};


/* =========================================================
   DOM
========================================================= */

const fundingClosed =
    document.getElementById("fundingClosed");

const fundingMethodTabs =
    document.querySelector(".funding-method-tabs");

const fundingMethodFilters =
    document.querySelectorAll(
        ".funding-method-filter"
    );

const fundingContents =
    document.querySelectorAll(
        ".funding-content"
    );


/* =========================================================
   HELPER
========================================================= */

function cleanString(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
}


function toNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    if (typeof value === "number") {
        return Number.isFinite(value)
            ? value
            : 0;
    }

    const number =
        Number(
            String(value)
                .replace(/,/g, "")
                .trim()
        );

    return Number.isFinite(number)
        ? number
        : 0;
}


function escapeHTML(value) {

    return cleanString(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function normalizeBoolean(value) {

    if (
        value === true ||
        value === 1
    ) {
        return true;
    }

    const valueString =
        cleanString(value)
            .toLowerCase();

    return [
        "true",
        "yes",
        "y",
        "1",
        "received",
        "checked"
    ].includes(valueString);
}


function isReceived(value) {

    return normalizeBoolean(value);
}


function isActive(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return true;
    }

    return normalizeBoolean(value);
}


/* =========================================================
   DATE
========================================================= */

function parseDate(value) {

    if (!value) {
        return 0;
    }

    const date =
        new Date(value);

    const time =
        date.getTime();

    return Number.isFinite(time)
        ? time
        : 0;
}


function formatDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return cleanString(value);
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    ).format(date);
}


/* =========================================================
   CURRENCY
========================================================= */

function normalizeCurrency(value) {

    return cleanString(value)
        .toUpperCase();
}


function estimateUSD(
    amount,
    currency
) {

    const code =
        normalizeCurrency(currency);

    const rate =
        EXCHANGE_RATES[code];

    if (!rate) {
        return 0;
    }

    return (
        toNumber(amount) *
        rate
    );
}


function formatCurrency(
    amount,
    currency
) {

    const code =
        normalizeCurrency(currency);

    const number =
        toNumber(amount);

    if (!code) {
        return String(number);
    }

    try {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: code,
                maximumFractionDigits:
                    code === "IDR"
                        ? 0
                        : 2
            }
        ).format(number);

    } catch {

        return `${code} ${number}`;

    }
}


/* =========================================================
   NORMALIZE FUNDING
========================================================= */

function normalizeFunding(
    item,
    id
) {

    return {

        id:
            cleanString(
                item.ID ??
                item.id ??
                id
            ),

        submittedAt:
            item["Submitted At"] ??
            item.submittedAt ??
            item.submitted_at ??
            "",

        name:
            item.Name ??
            item.name ??
            "",

        method:
            item.Method ??
            item.method ??
            "",

        currency:
            normalizeCurrency(
                item.Currency ??
                item.currency ??
                ""
            ),

        submittedAmount:
            toNumber(
                item["Submitted Amount"] ??
                item.submittedAmount ??
                item.submitted_amount
            ),

        actualReceived:
            toNumber(
                item["Actual Received"] ??
                item.actualReceived ??
                item.actual_received
            ),

        proof:
            item.Proof ??
            item.proof ??
            "",

        note:
            item.Note ??
            item.note ??
            "",

        display:
            item.Display ??
            item.display ??
            "anonymous",

        received:
            item.Received ??
            item.received ??
            false
    };
}


/* =========================================================
   NORMALIZE GOALS
========================================================= */

function normalizeGoal(
    item,
    id
) {

    return {

        id:
            cleanString(
                item.ID ??
                item.id ??
                id
            ),

        icon:
            item.Icon ??
            item.icon ??
            "🎯",

        goal:
            item.Goal ??
            item.goal ??
            "",

        description:
            item.Description ??
            item.description ??
            "",

        amount:
            toNumber(
                item.Amount ??
                item.amount
            ),

        currency:
            normalizeCurrency(
                item.Currency ??
                item.currency ??
                "USD"
            ),

        active:
            isActive(
                item.Active ??
                item.active
            )
    };
}


/* =========================================================
   NORMALIZE EXPENSES
========================================================= */

function normalizeExpense(
    item,
    id
) {

    return {

        id:
            cleanString(
                item.ID ??
                item.id ??
                id
            ),

        date:
            item.Date ??
            item.date ??
            "",

        category:
            item.Category ??
            item.category ??
            "",

        description:
            item.Description ??
            item.description ??
            "",

        amount:
            toNumber(
                item.Amount ??
                item.amount
            ),

        currency:
            normalizeCurrency(
                item.Currency ??
                item.currency ??
                "USD"
            ),

        proof:
            item.Proof ??
            item.proof ??
            ""
    };
}


/* =========================================================
   FUNDING CLOSE / OPEN
========================================================= */

function applyFundingState() {

    if (FUNDING_ENABLED) {

        if (fundingClosed) {
            fundingClosed.hidden = true;
        }

        if (fundingMethodTabs) {
            fundingMethodTabs.hidden = false;
        }

        fundingContents.forEach(
            content => {

                content.hidden =
                    content.id !==
                    `funding-${currentMethod}`;

            }
        );

    } else {

        if (fundingClosed) {
            fundingClosed.hidden = false;
        }

        if (fundingMethodTabs) {
            fundingMethodTabs.hidden = true;
        }

        fundingContents.forEach(
            content => {

                content.hidden = true;

            }
        );

    }
}


/* =========================================================
   METHOD TABS
========================================================= */

function setupMethodTabs() {

    fundingMethodFilters.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const method =
                        cleanString(
                            button.dataset.method
                        ).toLowerCase();

                    if (!method) {
                        return;
                    }

                    currentMethod =
                        method;


                    fundingMethodFilters
                        .forEach(
                            item => {

                                item.classList.toggle(
                                    "active",
                                    item === button
                                );

                            }
                        );


                    fundingContents
                        .forEach(
                            content => {

                                content.hidden =
                                    content.id !==
                                    `funding-${method}`;

                            }
                        );


                    /*
                       Close E-Wallet form
                       when leaving the E-Wallet tab.
                    */

                    const supportSection =
                        document.getElementById(
                            "supportSection"
                        );

                    if (
                        supportSection &&
                        method !== "ewallet"
                    ) {

                        supportSection.hidden =
                            true;

                    }

                }
            );

        }
    );


    applyFundingState();
}


/* =========================================================
   CAMPAIGN TARGET
========================================================= */

function calculateCampaignTarget() {

    campaignTargetUSD = 0;

    allGoals.forEach(
        goal => {

            if (!goal.active) {
                return;
            }

            campaignTargetUSD +=
                estimateUSD(
                    goal.amount,
                    goal.currency
                );

        }
    );

}


/* =========================================================
   VERIFIED FUNDING
========================================================= */

function getVerifiedFunding() {

    return allFunding.filter(
        item =>
            isReceived(
                item.received
            )
    );
}


/* =========================================================
   METHOD MATCH
========================================================= */

function normalizeMethod(value) {

    return cleanString(value)
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
}


function methodMatches(
    fundingMethod,
    targetMethod
) {

    const item =
        normalizeMethod(
            fundingMethod
        );

    const target =
        normalizeMethod(
            targetMethod
        );


    if (target === "kofi") {

        return (
            item === "kofi" ||
            item === "kofi"
        );

    }


    if (target === "ewallet") {

        return (
            item === "ewallet"
        );

    }


    return false;
}


/* =========================================================
   RAISED
========================================================= */

function getRaisedUSD(
    method
) {

    return getVerifiedFunding()
        .filter(
            item =>
                methodMatches(
                    item.method,
                    method
                )
        )
        .reduce(
            (
                total,
                item
            ) => {

                return total +
                    estimateUSD(
                        item.actualReceived,
                        item.currency
                    );

            },
            0
        );
}


/* =========================================================
   UPDATE CAMPAIGN
========================================================= */

function updateCampaign(
    method
) {

    const suffix =
        method === "kofi"
            ? "Kofi"
            : "Ewallet";


    const raisedAmount =
        document.getElementById(
            `raisedAmount${suffix}`
        );

    const fundingTarget =
        document.getElementById(
            `fundingTarget${suffix}`
        );

    const progressFill =
        document.getElementById(
            `progressFill${suffix}`
        );

    const progressPercent =
        document.getElementById(
            `progressPercent${suffix}`
        );


    if (!raisedAmount) {
        return;
    }


    const raised =
        getRaisedUSD(
            method
        );


    const target =
        campaignTargetUSD;


    raisedAmount.textContent =
        `$${raised.toFixed(2)}`;


    if (fundingTarget) {

        fundingTarget.textContent =
            `$${target.toFixed(2)}`;

    }


    let percentage = 0;


    if (target > 0) {

        percentage =
            (raised / target) * 100;

    }


    percentage =
        Math.min(
            100,
            Math.max(
                0,
                percentage
            )
        );


    if (progressFill) {

        progressFill.style.width =
            `${percentage}%`;

    }


    if (progressPercent) {

        progressPercent.textContent =
            `${percentage.toFixed(1)}%`;

    }

}


/* =========================================================
   FUNDING GOALS
========================================================= */

function renderFundingGoals(
    method
) {

    const suffix =
        method === "kofi"
            ? "Kofi"
            : "Ewallet";


    const container =
        document.getElementById(
            `goalList${suffix}`
        );


    if (!container) {
        return;
    }


    const activeGoals =
        allGoals.filter(
            goal =>
                goal.active
        );


    if (!activeGoals.length) {

        container.innerHTML = `
            <div class="funding-empty">
                No funding goals available.
            </div>
        `;

        return;
    }


    container.innerHTML =
        activeGoals
            .map(
                goal => {

                    return `
                        <div class="funding-goal">

                            <div class="funding-goal-icon">
                                ${escapeHTML(
                                    goal.icon
                                )}
                            </div>

                            <div class="funding-goal-content">

                                <div class="funding-goal-title">
                                    ${escapeHTML(
                                        goal.goal
                                    )}
                                </div>

                                ${
                                    goal.description
                                        ? `
                                            <div class="funding-goal-description">
                                                ${escapeHTML(
                                                    goal.description
                                                )}
                                            </div>
                                          `
                                        : ""
                                }

                            </div>

                            <div class="funding-goal-amount">
                                ${escapeHTML(
                                    formatCurrency(
                                        goal.amount,
                                        goal.currency
                                    )
                                )}
                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   SORT TRANSACTIONS
========================================================= */

function getTransactions(
    method
) {

    const transactions =
        getVerifiedFunding()
            .filter(
                item =>
                    methodMatches(
                        item.method,
                        method
                    )
            );


    if (
        currentSort === "latest"
    ) {

        transactions.sort(
            (a, b) =>
                parseDate(
                    b.submittedAt
                ) -
                parseDate(
                    a.submittedAt
                )
        );

    }

    else if (
        currentSort === "oldest"
    ) {

        transactions.sort(
            (a, b) =>
                parseDate(
                    a.submittedAt
                ) -
                parseDate(
                    b.submittedAt
                )
        );

    }

    else if (
        currentSort === "highest"
    ) {

        transactions.sort(
            (a, b) =>
                estimateUSD(
                    b.actualReceived,
                    b.currency
                ) -
                estimateUSD(
                    a.actualReceived,
                    a.currency
                )
        );

    }

    else if (
        currentSort === "currency"
    ) {

        transactions.sort(
            (a, b) =>
                String(
                    a.currency
                ).localeCompare(
                    String(
                        b.currency
                    )
                )
        );

    }


    return transactions;
}


/* =========================================================
   DISPLAY NAME
========================================================= */

function getDisplayName(
    transaction
) {

    const display =
        cleanString(
            transaction.display
        ).toLowerCase();


    if (
        display === "public"
    ) {

        return (
            cleanString(
                transaction.name
            ) ||
            "Supporter"
        );

    }


    return "Anonymous";
}


/* =========================================================
   TRANSACTIONS
========================================================= */

function renderTransactions(
    method
) {

    const suffix =
        method === "kofi"
            ? "Kofi"
            : "Ewallet";


    const container =
        document.getElementById(
            `transactionList${suffix}`
        );


    if (!container) {
        return;
    }


    const transactions =
        getTransactions(
            method
        );


    if (!transactions.length) {

        container.innerHTML = `
            <div class="funding-empty">
                No verified contributions yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        transactions
            .map(
                transaction => {

                    const name =
                        getDisplayName(
                            transaction
                        );


                    const amount =
                        formatCurrency(
                            transaction.actualReceived,
                            transaction.currency
                        );


                    const date =
                        formatDate(
                            transaction.submittedAt
                        );


                    return `
                        <div class="funding-transaction">

                            <div class="funding-transaction-main">

                                <div class="funding-transaction-name">
                                    ${escapeHTML(
                                        name
                                    )}
                                </div>

                                ${
                                    transaction.note
                                        ? `
                                            <div class="funding-transaction-note">
                                                ${escapeHTML(
                                                    transaction.note
                                                )}
                                            </div>
                                          `
                                        : ""
                                }

                                ${
                                    date
                                        ? `
                                            <div class="funding-transaction-date">
                                                ${escapeHTML(
                                                    date
                                                )}
                                            </div>
                                          `
                                        : ""
                                }

                            </div>

                            <div class="funding-transaction-amount">
                                ${escapeHTML(
                                    amount
                                )}
                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   CURRENCY SUMMARY
========================================================= */

function renderCurrencySummary(
    method
) {

    const suffix =
        method === "kofi"
            ? "Kofi"
            : "Ewallet";


    const container =
        document.getElementById(
            `currencySummary${suffix}`
        );


    if (!container) {
        return;
    }


    const transactions =
        getVerifiedFunding()
            .filter(
                item =>
                    methodMatches(
                        item.method,
                        method
                    )
            );


    if (!transactions.length) {

        container.innerHTML = "";

        return;
    }


    const summary = {};


    transactions.forEach(
        transaction => {

            const currency =
                transaction.currency ||
                "UNKNOWN";


            if (
                !summary[currency]
            ) {

                summary[currency] = 0;

            }


            summary[currency] +=
                toNumber(
                    transaction.actualReceived
                );

        }
    );


    container.innerHTML =
        Object.entries(summary)
            .map(
                ([currency, amount]) => {

                    return `
                        <span class="currency-summary-item">
                            ${escapeHTML(
                                currency
                            )}
                            ${escapeHTML(
                                amount.toLocaleString(
                                    "en-US"
                                )
                            )}
                        </span>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   SORT DROPDOWN
========================================================= */

function setupSortDropdown(
    method
) {

    const suffix =
        method === "kofi"
            ? "Kofi"
            : "Ewallet";


    const trigger =
        document.getElementById(
            `sortTrigger${suffix}`
        );

    const label =
        document.getElementById(
            `sortLabel${suffix}`
        );

    const dropdown =
        document.getElementById(
            `sortDropdown${suffix}`
        );

    const select =
        document.getElementById(
            `sortSelect${suffix}`
        );


    if (
        !trigger ||
        !dropdown
    ) {
        return;
    }


    trigger.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            document
                .querySelectorAll(
                    ".sort-dropdown.active"
                )
                .forEach(
                    item => {

                        if (
                            item !== dropdown
                        ) {

                            item.classList
                                .remove(
                                    "active"
                                );

                        }

                    }
                );


            dropdown.classList.toggle(
                "active"
            );

        }
    );


    dropdown.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    const options =
        dropdown.querySelectorAll(
            "[data-sort]"
        );


    options.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    const value =
                        option.dataset.sort;


                    if (!value) {
                        return;
                    }


                    currentSort =
                        value;


                    options.forEach(
                        item =>
                            item.classList
                                .remove(
                                    "active"
                                )
                    );


                    option.classList.add(
                        "active"
                    );


                    if (label) {

                        label.textContent =
                            option.textContent
                                .trim();

                    }


                    if (select) {

                        select.value =
                            currentSort;

                    }


                    syncSortDropdowns();


                    dropdown.classList
                        .remove(
                            "active"
                        );


                    renderTransactions(
                        "kofi"
                    );

                    renderTransactions(
                        "ewallet"
                    );

                }
            );

        }
    );


    if (select) {

        select.value =
            currentSort;


        select.addEventListener(
            "change",
            () => {

                currentSort =
                    select.value ||
                    "latest";


                syncSortDropdowns();


                renderTransactions(
                    "kofi"
                );

                renderTransactions(
                    "ewallet"
                );

            }
        );

    }

}


function syncSortDropdowns() {

    [
        "Kofi",
        "Ewallet"
    ].forEach(
        suffix => {

            const label =
                document.getElementById(
                    `sortLabel${suffix}`
                );

            const select =
                document.getElementById(
                    `sortSelect${suffix}`
                );

            const dropdown =
                document.getElementById(
                    `sortDropdown${suffix}`
                );


            if (select) {

                select.value =
                    currentSort;

            }


            if (!dropdown) {
                return;
            }


            const options =
                dropdown.querySelectorAll(
                    "[data-sort]"
                );


            options.forEach(
                option => {

                    const active =
                        option.dataset.sort ===
                        currentSort;


                    option.classList.toggle(
                        "active",
                        active
                    );


                    if (
                        active &&
                        label
                    ) {

                        label.textContent =
                            option.textContent
                                .trim();

                    }

                }
            );

        }
    );

}


/* =========================================================
   SUPPORT FORM
========================================================= */

const supportBtn =
    document.getElementById(
        "supportBtn"
    );

const supportSection =
    document.getElementById(
        "supportSection"
    );

const supportForm =
    document.getElementById(
        "supportForm"
    );

const cancelSupport =
    document.getElementById(
        "cancelSupport"
    );


if (
    supportBtn &&
    supportSection
) {

    supportBtn.addEventListener(
        "click",
        () => {

            supportSection.hidden =
                false;

            supportSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


if (
    cancelSupport &&
    supportSection
) {

    cancelSupport.addEventListener(
        "click",
        () => {

            supportSection.hidden =
                true;

        }
    );

}


/* =========================================================
   PAYMENT METHOD
========================================================= */

const paymentMethod =
    document.getElementById(
        "supportPaymentMethod"
    );

const paymentMethodTrigger =
    document.getElementById(
        "paymentMethodTrigger"
    );

const paymentMethodLabel =
    document.getElementById(
        "paymentMethodLabel"
    );

const paymentMethodMenu =
    document.getElementById(
        "paymentMethodMenu"
    );

const paymentDestination =
    document.getElementById(
        "paymentDestination"
    );

const paymentMethodLogo =
    document.getElementById(
        "paymentMethodLogo"
    );

const destinationContent =
    document.getElementById(
        "destinationContent"
    );

const copyPaymentBtn =
    document.getElementById(
        "copyPaymentBtn"
    );


/*
   Isi manual sesuai data pembayaranmu.
*/

const paymentInfo = {

    "QRIS": {
        value: "",
        logo: "",
        alt: "QRIS"
    },

    "G-Cash": {
        value: "",
        logo: "",
        alt: "G-Cash"
    },

    "Other": {
        value: "",
        logo: "",
        alt: "Other"
    }

};


function updatePaymentDestination() {

    if (!paymentMethod) {
        return;
    }


    const method =
        cleanString(
            paymentMethod.value
        );


    const info =
        paymentInfo[method];


    if (
        !method ||
        !info
    ) {

        if (paymentDestination) {

            paymentDestination.hidden =
                true;

        }

        return;

    }


    if (paymentDestination) {

        paymentDestination.hidden =
            false;

    }


    if (destinationContent) {

        destinationContent.textContent =
            info.value ||
            "Payment destination will be provided here.";

    }


    if (paymentMethodLogo) {

        if (info.logo) {

            paymentMethodLogo.hidden =
                false;

            paymentMethodLogo.innerHTML = `
                <img
                    src="${escapeHTML(
                        info.logo
                    )}"
                    alt="${escapeHTML(
                        info.alt || method
                    )}"
                >
            `;

        } else {

            paymentMethodLogo.hidden =
                true;

            paymentMethodLogo.innerHTML =
                "";

        }

    }

}


if (
    paymentMethodTrigger &&
    paymentMethodMenu
) {

    paymentMethodTrigger.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            paymentMethodMenu.classList
                .toggle("active");

        }
    );


    paymentMethodMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    const options =
        paymentMethodMenu.querySelectorAll(
            "[data-value]"
        );


    options.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    const value =
                        option.dataset.value;


                    if (!value) {
                        return;
                    }


                    if (paymentMethod) {

                        paymentMethod.value =
                            value;

                    }


                    if (paymentMethodLabel) {

                        paymentMethodLabel.textContent =
                            option.textContent
                                .trim();

                    }


                    options.forEach(
                        item =>
                            item.classList
                                .remove(
                                    "active"
                                )
                    );


                    option.classList.add(
                        "active"
                    );


                    paymentMethodMenu.classList
                        .remove(
                            "active"
                        );


                    updatePaymentDestination();

                }
            );

        }
    );

}


/* =========================================================
   COPY PAYMENT
========================================================= */

if (copyPaymentBtn) {

    copyPaymentBtn.addEventListener(
        "click",
        async () => {

            const method =
                cleanString(
                    paymentMethod?.value
                );


            const value =
                paymentInfo[method]
                    ?.value;


            if (!value) {
                return;
            }


            try {

                await navigator.clipboard
                    .writeText(value);


                const original =
                    copyPaymentBtn.textContent;


                copyPaymentBtn.textContent =
                    "Copied!";


                setTimeout(
                    () => {

                        copyPaymentBtn.textContent =
                            original;

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   CURRENCY
========================================================= */

const currency =
    document.getElementById(
        "supportCurrency"
    );

const currencyTrigger =
    document.getElementById(
        "currencyTrigger"
    );

const currencyLabel =
    document.getElementById(
        "currencyLabel"
    );

const currencyMenu =
    document.getElementById(
        "currencyMenu"
    );


if (
    currencyTrigger &&
    currencyMenu
) {

    currencyTrigger.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            currencyMenu.classList
                .toggle("active");

        }
    );


    currencyMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    const options =
        currencyMenu.querySelectorAll(
            "[data-value]"
        );


    options.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    const value =
                        option.dataset.value;


                    if (!value) {
                        return;
                    }


                    if (currency) {

                        currency.value =
                            value;

                    }


                    if (currencyLabel) {

                        currencyLabel.textContent =
                            option.textContent
                                .trim();

                    }


                    options.forEach(
                        item =>
                            item.classList
                                .remove(
                                    "active"
                                )
                    );


                    option.classList.add(
                        "active"
                    );


                    currencyMenu.classList
                        .remove(
                            "active"
                        );

                }
            );

        }
    );

}


/* =========================================================
   PAYMENT PROOF
========================================================= */

const paymentProof =
    document.getElementById(
        "supportProof"
    );

const uploadText =
    document.getElementById(
        "uploadText"
    );


if (paymentProof) {

    paymentProof.addEventListener(
        "change",
        () => {

            if (!uploadText) {
                return;
            }


            if (
                paymentProof.files &&
                paymentProof.files.length
            ) {

                uploadText.textContent =
                    paymentProof.files[0].name;

            } else {

                uploadText.textContent =
                    "Upload payment proof";

            }

        }
    );

}


/* =========================================================
   NOTE
========================================================= */

const supportMessage =
    document.getElementById(
        "supportNote"
    );

const messageCount =
    document.getElementById(
        "characterCount"
    );


if (
    supportMessage &&
    messageCount
) {

    function updateMessageCount() {

        messageCount.textContent =
            `${supportMessage.value.length} / 150`;

    }


    supportMessage.addEventListener(
        "input",
        updateMessageCount
    );


    updateMessageCount();

}


/* =========================================================
   SUCCESS
========================================================= */

const formSuccess =
    document.getElementById(
        "formSuccess"
    );

const successClose =
    document.getElementById(
        "successClose"
    );


if (
    formSuccess &&
    successClose
) {

    successClose.addEventListener(
        "click",
        () => {

            formSuccess.hidden =
                true;

        }
    );

}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (supportForm) {

    supportForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /*
               IMPORTANT:

               Firebase is used for READ.

               Apps Script is only needed here
               if you want to submit the form
               into Google Sheets.
            */


            alert(
                "The funding form submission endpoint has not been configured yet."
            );

        }
    );

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    calculateCampaignTarget();


    updateCampaign("kofi");
    updateCampaign("ewallet");


    renderFundingGoals("kofi");
    renderFundingGoals("ewallet");


    renderCurrencySummary("kofi");
    renderCurrencySummary("ewallet");


    renderTransactions("kofi");
    renderTransactions("ewallet");

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    [
        "goalListKofi",
        "goalListEwallet"
    ].forEach(
        id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.innerHTML = `
                    <div class="funding-loading">
                        Loading...
                    </div>
                `;

            }

        }
    );


    [
        "transactionListKofi",
        "transactionListEwallet"
    ].forEach(
        id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.innerHTML = `
                    <div class="funding-loading">
                        Loading...
                    </div>
                `;

            }

        }
    );

}


/* =========================================================
   LOAD FUNDING FROM FIREBASE
========================================================= */

async function loadFundingData() {

    showLoading();


    try {

        /* =================================================
           FUNDING
        ================================================= */

        const fundingSnapshot =
            await get(
                ref(
                    db,
                    "funding"
                )
            );


        if (
            fundingSnapshot.exists()
        ) {

            const firebaseData =
                fundingSnapshot.val();


            allFunding =
                Object.entries(
                    firebaseData
                )
                .map(
                    ([id, item]) =>
                        normalizeFunding(
                            item || {},
                            id
                        )
                );

        } else {

            allFunding = [];

        }


        /* =================================================
           FUNDING GOALS
        ================================================= */

        const goalsSnapshot =
            await get(
                ref(
                    db,
                    "fundingGoals"
                )
            );


        if (
            goalsSnapshot.exists()
        ) {

            const firebaseData =
                goalsSnapshot.val();


            allGoals =
                Object.entries(
                    firebaseData
                )
                .map(
                    ([id, item]) =>
                        normalizeGoal(
                            item || {},
                            id
                        )
                );

        } else {

            allGoals = [];

        }


        /* =================================================
           FUNDING EXPENSES
        ================================================= */

        const expensesSnapshot =
            await get(
                ref(
                    db,
                    "fundingExpenses"
                )
            );


        if (
            expensesSnapshot.exists()
        ) {

            const firebaseData =
                expensesSnapshot.val();


            allExpenses =
                Object.entries(
                    firebaseData
                )
                .map(
                    ([id, item]) =>
                        normalizeExpense(
                            item || {},
                            id
                        )
                );

        } else {

            allExpenses = [];

        }


        /* =================================================
           DEBUG
        ================================================= */

        console.log(
            "FIREBASE FUNDING:",
            allFunding
        );

        console.log(
            "FIREBASE FUNDING GOALS:",
            allGoals
        );

        console.log(
            "FIREBASE FUNDING EXPENSES:",
            allExpenses
        );


        /*
           Optional global access for debugging
        */

        window.allFunding =
            allFunding;

        window.allFundingGoals =
            allGoals;

        window.allFundingExpenses =
            allExpenses;


        /* =================================================
           RENDER
        ================================================= */

        renderAll();


    } catch (error) {

        console.error(
            "Failed to load Funding from Firebase:",
            error
        );


        [
            "goalListKofi",
            "goalListEwallet"
        ].forEach(
            id => {

                const element =
                    document.getElementById(id);

                if (element) {

                    element.innerHTML = `
                        <div class="funding-error">
                            Failed to load funding goals.
                        </div>
                    `;

                }

            }
        );


        [
            "transactionListKofi",
            "transactionListEwallet"
        ].forEach(
            id => {

                const element =
                    document.getElementById(id);

                if (element) {

                    element.innerHTML = `
                        <div class="funding-error">
                            Failed to load funding data.
                        </div>
                    `;

                }

            }
        );

    }

}


/* =========================================================
   START
========================================================= */

function initFunding() {

    applyFundingState();

    setupMethodTabs();

    setupSortDropdown("kofi");
    setupSortDropdown("ewallet");

    syncSortDropdowns();

    updatePaymentDestination();

    loadFundingData();

}


initFunding();