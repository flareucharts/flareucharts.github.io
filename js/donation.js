/* =========================================================
   FLARE U GLOBAL
   FUNDING / DONATION
   FIREBASE READ + GOOGLE APPS SCRIPT WRITE
========================================================= */

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { db } from "./firebase.js";


/* =========================================================
   CONFIGURATION
========================================================= */

/*
   PASTE GOOGLE APPS SCRIPT WEB APP URL HERE

   Example:
   const APPS_SCRIPT_URL =
       "https://script.google.com/macros/s/XXXXXXXX/exec";
*/

const APPS_SCRIPT_URL = "";


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
    document.getElementById(
        "fundingClosed"
    );

const fundingMethodTabs =
    document.querySelector(
        ".funding-method-tabs"
    );

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

    if (
        typeof value === "number"
    ) {

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
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function normalizeBoolean(value) {

    if (
        value === true ||
        value === 1
    ) {
        return true;
    }

    const text =
        cleanString(value)
            .toLowerCase();

    return [
        "true",
        "yes",
        "y",
        "1",
        "received",
        "checked"
    ].includes(text);

}


function isReceived(value) {

    return normalizeBoolean(
        value
    );

}


function isActive(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return true;
    }

    return normalizeBoolean(
        value
    );

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
        return cleanString(
            value
        );
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
        normalizeCurrency(
            currency
        );

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
        normalizeCurrency(
            currency
        );

    const number =
        toNumber(amount);

    if (!code) {
        return String(
            number
        );
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
   FUNDING OPEN / CLOSE
========================================================= */

function applyFundingState() {

    if (!FUNDING_ENABLED) {

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

        return;
    }


    if (fundingClosed) {
        fundingClosed.hidden = true;
    }

    if (fundingMethodTabs) {
        fundingMethodTabs.hidden = false;
    }

    switchFundingMethod(
        currentMethod
    );

}


/* =========================================================
   SWITCH FUNDING METHOD
========================================================= */

function switchFundingMethod(
    method
) {

    method =
        cleanString(
            method
        ).toLowerCase();


    if (
        method !== "kofi" &&
        method !== "ewallet"
    ) {
        method = "kofi";
    }


    currentMethod =
        method;


    fundingMethodFilters.forEach(
        button => {

            const buttonMethod =
                cleanString(
                    button.dataset.method
                ).toLowerCase();

            button.classList.toggle(
                "active",
                buttonMethod === method
            );

        }
    );


    fundingContents.forEach(
        content => {

            const contentMethod =
                cleanString(
                    content.id
                        .replace(
                            "funding-",
                            ""
                        )
                ).toLowerCase();

            content.hidden =
                contentMethod !== method;

        }
    );


    const supportSection =
        document.getElementById(
            "supportSection"
        );


    if (
        supportSection &&
        method !== "ewallet"
    ) {

        supportSection.hidden = true;

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

                    switchFundingMethod(
                        button.dataset.method
                    );

                }
            );

        }
    );


    switchFundingMethod(
        currentMethod
    );

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
   NORMALIZE METHOD
========================================================= */

function normalizeMethod(value) {

    return cleanString(
        value
    )
        .toLowerCase()
        .replace(
            /[\s_-]+/g,
            ""
        );

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


    if (
        target === "kofi"
    ) {

        return item === "kofi";

    }


    if (
        target === "ewallet"
    ) {

        return item === "ewallet";

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

                return (
                    total +
                    estimateUSD(
                        item.actualReceived,
                        item.currency
                    )
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
            `Goal: $${target.toFixed(2)}`;

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
                goal => `

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

                `
            )
            .join("");

}


/* =========================================================
   TRANSACTIONS
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
   RENDER TRANSACTIONS
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
                ([currency, amount]) => `

                    <span class="currency-summary-item">
                        ${escapeHTML(currency)}
                        ${escapeHTML(
                            amount.toLocaleString(
                                "en-US"
                            )
                        )}
                    </span>

                `
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


/* =========================================================
   SYNC SORT DROPDOWNS
========================================================= */

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


/* =========================================================
   PAYMENT INFORMATION
========================================================= */

const paymentInfo = {

qris: {
    value: "QRIS",
    logo: "../images/qris.png",
    alt: "QRIS"
}

other: {
        value: "Other",
        logo: "../images/other.png",
        alt: "Other Payment"
    }

};


/* =========================================================
   UPDATE PAYMENT DESTINATION
========================================================= */

function updatePaymentDestination() {

    if (!paymentMethod) {
        return;
    }


    const method =
        cleanString(
            paymentMethod.value
        ).toLowerCase();


    const info =
        paymentInfo[method];


    if (
        !method ||
        !info
    ) {

        if (paymentDestination) {
            paymentDestination.hidden = true;
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


/* =========================================================
   PAYMENT METHOD DROPDOWN
========================================================= */

if (
    paymentMethodTrigger &&
    paymentMethodMenu
) {

    paymentMethodTrigger.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            paymentMethodMenu.classList
                .toggle(
                    "active"
                );

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
                        cleanString(
                            option.dataset.value
                        ).toLowerCase();


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
   COPY PAYMENT DESTINATION
========================================================= */

if (copyPaymentBtn) {

    copyPaymentBtn.addEventListener(
        "click",
        async () => {

            const text =
                destinationContent
                    ? cleanString(
                        destinationContent
                            .textContent
                    )
                    : "";


            if (
                !text ||
                text ===
                    "Payment destination will be provided here."
            ) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    text
                );


                const originalText =
                    copyPaymentBtn.textContent;


                copyPaymentBtn.textContent =
                    "Copied";


                setTimeout(
                    () => {

                        copyPaymentBtn.textContent =
                            originalText;

                    },
                    1500
                );

            } catch (error) {

                console.error(
                    "Failed to copy payment destination:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   CURRENCY DROPDOWN
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
                .toggle(
                    "active"
                );

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
                        cleanString(
                            option.dataset.value
                        ).toUpperCase();


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
   CLOSE DROPDOWNS WHEN CLICK OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                ".sort-dropdown.active"
            )
            .forEach(
                dropdown => {

                    dropdown.classList
                        .remove(
                            "active"
                        );

                }
            );


        if (paymentMethodMenu) {

            paymentMethodMenu.classList
                .remove(
                    "active"
                );

        }


        if (currencyMenu) {

            currencyMenu.classList
                .remove(
                    "active"
                );

        }

    }
);


/* =========================================================
   FORM VALIDATION
========================================================= */

function validateSupportForm() {

    if (!supportForm) {
        return false;
    }


    const name =
        document.getElementById(
            "supportName"
        );

    const amount =
        document.getElementById(
            "supportAmount"
        );


    if (
        !name ||
        !cleanString(
            name.value
        )
    ) {

        alert(
            "Please enter your name or nickname."
        );

        name?.focus();

        return false;

    }


    if (
        !paymentMethod ||
        !cleanString(
            paymentMethod.value
        )
    ) {

        alert(
            "Please select a payment method."
        );

        return false;

    }


    if (
        !currency ||
        !cleanString(
            currency.value
        )
    ) {

        alert(
            "Please select a currency."
        );

        return false;

    }


    if (
        !amount ||
        toNumber(
            amount.value
        ) <= 0
    ) {

        alert(
            "Please enter a valid payment amount."
        );

        amount?.focus();

        return false;

    }


    if (
        !paymentProof ||
        !paymentProof.files ||
        !paymentProof.files.length
    ) {

        alert(
            "Please upload your payment proof."
        );

        return false;

    }


    return true;

}


/* =========================================================
   FILE TO BASE64
========================================================= */

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

                resolve(
                    reader.result
                );

            };


            reader.onerror = () => {

                reject(
                    reader.error
                );

            };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   SUBMIT TO GOOGLE APPS SCRIPT
========================================================= */

async function submitSupportToAppsScript() {

    if (!APPS_SCRIPT_URL) {

        throw new Error(
            "Google Apps Script URL has not been configured."
        );

    }


    const name =
        document.getElementById(
            "supportName"
        );


    const amount =
        document.getElementById(
            "supportAmount"
        );


    const note =
        document.getElementById(
            "supportNote"
        );


    const display =
        document.querySelector(
            'input[name="display"]:checked'
        );


    if (
        !name ||
        !amount ||
        !paymentMethod ||
        !currency ||
        !paymentProof
    ) {

        throw new Error(
            "Required form elements are missing."
        );

    }


    const file =
        paymentProof.files?.[0];


    if (!file) {

        throw new Error(
            "Payment proof is required."
        );

    }


    /* =========================
       FILE VALIDATION
    ========================= */

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        throw new Error(
            "Payment proof must be PNG, JPG, or WEBP."
        );

    }


    const maxFileSize =
        5 * 1024 * 1024;


    if (
        file.size > maxFileSize
    ) {

        throw new Error(
            "Payment proof must be 5 MB or smaller."
        );

    }


    /* =========================
       READ FILE
    ========================= */

    const base64 =
        await fileToBase64(
            file
        );


    const payload = {

        action:
            "submitFunding",

        name:
            cleanString(
                name.value
            ),

        paymentMethod:
            cleanString(
                paymentMethod.value
            ).toLowerCase(),

        currency:
            cleanString(
                currency.value
            ).toUpperCase(),

        amount:
            toNumber(
                amount.value
            ),

        proofName:
            file.name,

        proofType:
            file.type,

        proofData:
            base64,

        note:
            note
                ? cleanString(
                    note.value
                )
                : "",

        display:
            display
                ? display.value
                : "anonymous"

    };


    console.log(
        "Submitting funding:",
        {
            ...payload,
            proofData:
                "[base64 omitted]"
        }
    );


    /*
       IMPORTANT:

       Apps Script receives this JSON body.
    */

    const response =
        await fetch(
            APPS_SCRIPT_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


    if (!response.ok) {

        throw new Error(
            `Server returned HTTP ${response.status}.`
        );

    }


    const text =
        await response.text();


    let result;


    try {

        result =
            JSON.parse(
                text
            );

    } catch {

        console.error(
            "Invalid Apps Script response:",
            text
        );

        throw new Error(
            "Invalid response from the funding server."
        );

    }


    if (
        !result.success
    ) {

        throw new Error(
            result.message ||
            "The funding submission was rejected."
        );

    }


    return result;

}


/* =========================================================
   RESET FORM
========================================================= */

function resetSupportForm() {

    if (!supportForm) {
        return;
    }


    supportForm.reset();


    if (paymentMethod) {
        paymentMethod.value = "";
    }


    if (currency) {
        currency.value = "";
    }


    if (paymentMethodLabel) {

        paymentMethodLabel.textContent =
            "Select payment method";

    }


    if (currencyLabel) {

        currencyLabel.textContent =
            "Select currency";

    }


    if (paymentDestination) {

        paymentDestination.hidden =
            true;

    }


    if (paymentMethodLogo) {

        paymentMethodLogo.hidden =
            true;

        paymentMethodLogo.innerHTML =
            "";

    }


    if (destinationContent) {

        destinationContent.textContent =
            "";

    }


    if (uploadText) {

        uploadText.textContent =
            "Upload payment proof";

    }


    if (messageCount) {

        messageCount.textContent =
            "0 / 150";

    }


    document
        .querySelectorAll(
            "#paymentMethodMenu [data-value]"
        )
        .forEach(
            option => {

                option.classList.remove(
                    "active"
                );

            }
        );


    document
        .querySelectorAll(
            "#currencyMenu [data-value]"
        )
        .forEach(
            option => {

                option.classList.remove(
                    "active"
                );

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


            if (
                !validateSupportForm()
            ) {
                return;
            }


            const submitButton =
                document.getElementById(
                    "submitSupport"
                );


            const originalText =
                submitButton
                    ? submitButton.textContent
                    : "Submit Support";


            try {

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Submitting...";

                }


                const result =
                    await submitSupportToAppsScript();


                console.log(
                    "Funding submitted successfully:",
                    result
                );


                supportForm.hidden =
                    true;


                if (formSuccess) {

                    formSuccess.hidden =
                        false;

                    formSuccess.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }


                resetSupportForm();


            } catch (error) {

                console.error(
                    "Funding submission failed:",
                    error
                );


                alert(
                    error?.message ||
                    "Something went wrong while submitting your support."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalText;

                }

            }

        }
    );

}


/* =========================================================
   SUCCESS CLOSE
========================================================= */

if (
    successClose &&
    formSuccess
) {

    successClose.addEventListener(
        "click",
        () => {

            formSuccess.hidden =
                true;

            if (supportSection) {

                supportSection.hidden =
                    true;

            }

            if (supportForm) {

                supportForm.hidden =
                    false;

            }

        }
    );

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    calculateCampaignTarget();


    updateCampaign(
        "kofi"
    );

    updateCampaign(
        "ewallet"
    );


    renderFundingGoals(
        "kofi"
    );

    renderFundingGoals(
        "ewallet"
    );


    renderCurrencySummary(
        "kofi"
    );

    renderCurrencySummary(
        "ewallet"
    );


    renderTransactions(
        "kofi"
    );

    renderTransactions(
        "ewallet"
    );

}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {

    [
        "goalListKofi",
        "goalListEwallet",
        "transactionListKofi",
        "transactionListEwallet"
    ].forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {
                return;
            }


            element.innerHTML = `
                <div class="funding-loading">
                    Loading...
                </div>
            `;

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
                    document.getElementById(
                        id
                    );


                if (!element) {
                    return;
                }


                element.innerHTML = `
                    <div class="funding-error">
                        Failed to load funding goals.
                    </div>
                `;

            }
        );


        [
            "transactionListKofi",
            "transactionListEwallet"
        ].forEach(
            id => {

                const element =
                    document.getElementById(
                        id
                    );


                if (!element) {
                    return;
                }


                element.innerHTML = `
                    <div class="funding-error">
                        Failed to load funding data.
                    </div>
                `;

            }
        );

    }

}


/* =========================================================
   START
========================================================= */

function initFunding() {

    setupMethodTabs();


    setupSortDropdown(
        "kofi"
    );


    setupSortDropdown(
        "ewallet"
    );


    syncSortDropdowns();


    updatePaymentDestination();


    applyFundingState();


    loadFundingData();

}


initFunding();