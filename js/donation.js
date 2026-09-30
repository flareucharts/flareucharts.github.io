/* =========================================================
   FLARE U GLOBAL
   COMEBACK FUNDING
========================================================= */

const FUNDING_ENABLED = true;


/* =========================================================
   CONFIG
========================================================= */

const API_URL =
    "YOUR_APPS_SCRIPT_WEB_APP_URL";


/* =========================================================
   ESTIMATED EXCHANGE RATES
   1 unit currency → USD
========================================================= */

const estimatedRates = {

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


const fundingMethodFilters =
    document.querySelectorAll(
        ".funding-method-filter"
    );


const fundingContents =
    document.querySelectorAll(
        ".funding-content"
    );


/* =========================================================
   SUPPORT FORM
========================================================= */

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

const supportName =
    document.getElementById("supportName");

const supportAmount =
    document.getElementById("supportAmount");

const supportNote =
    document.getElementById("supportNote");

const supportProof =
    document.getElementById("supportProof");

const uploadText =
    document.getElementById("uploadText");

const characterCount =
    document.getElementById("characterCount");


/* =========================================================
   PAYMENT METHOD
========================================================= */

const supportPaymentMethod =
    document.getElementById(
        "supportPaymentMethod"
    );

const paymentMethodDropdown =
    document.getElementById(
        "paymentMethodDropdown"
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

const paymentMethodOptions =
    document.querySelectorAll(
        ".payment-method-option"
    );


/* =========================================================
   PAYMENT DESTINATION
========================================================= */

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
   CURRENCY
========================================================= */

const supportCurrency =
    document.getElementById(
        "supportCurrency"
    );

const currencyDropdown =
    document.getElementById(
        "currencyDropdown"
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

const currencyOptions =
    document.querySelectorAll(
        ".currency-option"
    );


/* =========================================================
   FUNDING DISPLAY
========================================================= */

const raisedAmountKofi =
    document.getElementById(
        "raisedAmountKofi"
    );

const fundingTargetKofi =
    document.getElementById(
        "fundingTargetKofi"
    );

const progressPercentKofi =
    document.getElementById(
        "progressPercentKofi"
    );

const progressFillKofi =
    document.getElementById(
        "progressFillKofi"
    );


const raisedAmountEwallet =
    document.getElementById(
        "raisedAmountEwallet"
    );

const fundingTargetEwallet =
    document.getElementById(
        "fundingTargetEwallet"
    );

const progressPercentEwallet =
    document.getElementById(
        "progressPercentEwallet"
    );

const progressFillEwallet =
    document.getElementById(
        "progressFillEwallet"
    );


/* =========================================================
   FUNDING DATA
========================================================= */

const goalListKofi =
    document.getElementById(
        "goalListKofi"
    );

const goalListEwallet =
    document.getElementById(
        "goalListEwallet"
    );


const currencySummaryKofi =
    document.getElementById(
        "currencySummaryKofi"
    );

const currencySummaryEwallet =
    document.getElementById(
        "currencySummaryEwallet"
    );


const transactionListKofi =
    document.getElementById(
        "transactionListKofi"
    );

const transactionListEwallet =
    document.getElementById(
        "transactionListEwallet"
    );


/* =========================================================
   SORT
========================================================= */

const sortTriggerKofi =
    document.getElementById(
        "sortTriggerKofi"
    );

const sortDropdownKofi =
    document.getElementById(
        "sortDropdownKofi"
    );

const sortLabelKofi =
    document.getElementById(
        "sortLabelKofi"
    );

const sortSelectKofi =
    document.getElementById(
        "sortSelectKofi"
    );


const sortTriggerEwallet =
    document.getElementById(
        "sortTriggerEwallet"
    );

const sortDropdownEwallet =
    document.getElementById(
        "sortDropdownEwallet"
    );

const sortLabelEwallet =
    document.getElementById(
        "sortLabelEwallet"
    );

const sortSelectEwallet =
    document.getElementById(
        "sortSelectEwallet"
    );


/* =========================================================
   STATE
========================================================= */

let transactions = [];

let fundingGoals = [];

let campaignTargetUSD = 0;


/* =========================================================
   FUNDING CLOSED
========================================================= */

function updateFundingState() {

    if (!fundingClosed) {
        return;
    }

    if (FUNDING_ENABLED) {

        fundingClosed.hidden = true;

        fundingMethodFilters.forEach(
            tab => {
                tab.hidden = false;
            }
        );

        fundingContents.forEach(
            content => {
                content.hidden =
                    !content.classList.contains(
                        "active"
                    );
            }
        );

    } else {

        fundingClosed.hidden = false;

        fundingMethodFilters.forEach(
            tab => {
                tab.hidden = true;
            }
        );

        fundingContents.forEach(
            content => {
                content.hidden = true;
                content.classList.remove(
                    "active"
                );
            }
        );

    }

}


/* =========================================================
   FUNDING METHOD TABS
========================================================= */

function switchFundingMethod(
    method
) {

    if (!FUNDING_ENABLED) {
        return;
    }


    fundingMethodFilters.forEach(
        tab => {

            const active =
                tab.dataset.method === method;

            tab.classList.toggle(
                "active",
                active
            );

            tab.setAttribute(
                "aria-selected",
                active
                    ? "true"
                    : "false"
            );

        }
    );


    fundingContents.forEach(
        content => {

            const active =
                content.dataset.method === method;


            content.classList.toggle(
                "active",
                active
            );


            content.hidden =
                !active;

        }
    );

}


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


/* =========================================================
   PAYMENT INFORMATION
========================================================= */

const paymentInfo = {

    qris: {

        logo:
            "../images/pay/qris.png",

        alt:
            "QRIS",

        value:
            "Scan the QR code above to send your support."

    },


    gcash: {

        logo:
            "../images/pay/gcash.png",

        alt:
            "G-Cash",

        value:
            "Scan the QR code above to send your support."

    },


    other: {

        logo:
            "../images/pay/other.png",

        alt:
            "Other payment method",

        value:
            "Payment information will appear here."

    }

};


/* =========================================================
   CUSTOM DROPDOWN HELPERS
========================================================= */

function closeAllDropdowns(
    except = null
) {

    document
        .querySelectorAll(
            ".payment-method-dropdown, " +
            ".currency-dropdown, " +
            ".sort-filter"
        )
        .forEach(
            dropdown => {

                if (
                    dropdown === except
                ) {
                    return;
                }


                dropdown.classList.remove(
                    "active"
                );


                const menu =
                    dropdown.querySelector(
                        ".payment-method-menu, " +
                        ".currency-menu, " +
                        ".sort-dropdown"
                    );


                if (menu) {

                    menu.classList.remove(
                        "active"
                    );

                }

            }
        );

}


function toggleDropdown(
    container,
    menu
) {

    if (
        !container ||
        !menu
    ) {
        return;
    }


    const isOpen =
        container.classList.contains(
            "active"
        );


    closeAllDropdowns(
        isOpen
            ? null
            : container
    );


    container.classList.toggle(
        "active",
        !isOpen
    );


    menu.classList.toggle(
        "active",
        !isOpen
    );

}


/* =========================================================
   PAYMENT METHOD DROPDOWN
========================================================= */

if (
    paymentMethodTrigger &&
    paymentMethodDropdown &&
    paymentMethodMenu
) {

    paymentMethodTrigger.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleDropdown(
                paymentMethodDropdown,
                paymentMethodMenu
            );

        }
    );

}


paymentMethodOptions.forEach(
    option => {

        option.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const value =
                    option.dataset.value;


                const text =
                    option.textContent.trim();


                if (supportPaymentMethod) {

                    supportPaymentMethod.value =
                        value;

                }


                if (paymentMethodLabel) {

                    paymentMethodLabel.textContent =
                        text;

                }


                paymentMethodOptions.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                option.classList.add(
                    "active"
                );


                closeAllDropdowns();


                updatePaymentDestination(
                    value
                );

            }
        );

    }
);


/* =========================================================
   CURRENCY DROPDOWN
========================================================= */

if (
    currencyTrigger &&
    currencyDropdown &&
    currencyMenu
) {

    currencyTrigger.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleDropdown(
                currencyDropdown,
                currencyMenu
            );

        }
    );

}


currencyOptions.forEach(
    option => {

        option.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const value =
                    option.dataset.value;


                const text =
                    option.textContent.trim();


                if (supportCurrency) {

                    supportCurrency.value =
                        value;

                }


                if (currencyLabel) {

                    currencyLabel.textContent =
                        text;

                }


                currencyOptions.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                option.classList.add(
                    "active"
                );


                closeAllDropdowns();

            }
        );

    }
);


/* =========================================================
   SORT DROPDOWNS
========================================================= */

function setupSortDropdown(
    trigger,
    dropdown,
    label,
    select
) {

    if (
        !trigger ||
        !dropdown ||
        !label ||
        !select
    ) {
        return;
    }


    trigger.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const filter =
                trigger.closest(
                    ".sort-filter"
                );


            toggleDropdown(
                filter,
                dropdown
            );

        }
    );


    dropdown
        .querySelectorAll(
            ".sort-option"
        )
        .forEach(
            option => {

                option.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        /*
                         * HTML memakai data-sort,
                         * bukan data-value.
                         */

                        const value =
                            option.dataset.sort;


                        const text =
                            option.textContent.trim();


                        select.value =
                            value;


                        label.textContent =
                            text;


                        dropdown
                            .querySelectorAll(
                                ".sort-option"
                            )
                            .forEach(
                                item => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        option.classList.add(
                            "active"
                        );


                        closeAllDropdowns();


                        sortTransactions();

                    }
                );

            }
        );

}


setupSortDropdown(
    sortTriggerKofi,
    sortDropdownKofi,
    sortLabelKofi,
    sortSelectKofi
);


setupSortDropdown(
    sortTriggerEwallet,
    sortDropdownEwallet,
    sortLabelEwallet,
    sortSelectEwallet
);


/* =========================================================
   CLOSE DROPDOWNS OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    () => {

        closeAllDropdowns();

    }
);


/* =========================================================
   PAYMENT DESTINATION
========================================================= */

function updatePaymentDestination(
    method
) {

    if (
        !paymentDestination ||
        !destinationContent
    ) {
        return;
    }


    const info =
        paymentInfo[method];


    if (!info) {

        paymentDestination.hidden =
            true;

        return;

    }


    paymentDestination.hidden =
        false;


    /*
     * HTML kamu menggunakan div
     * #paymentMethodLogo.
     *
     * Jadi kita tidak mencari
     * #paymentLogo lagi.
     */

    if (
        paymentMethodLogo
    ) {

        paymentMethodLogo.innerHTML = `
            <img
                src="${escapeHTML(info.logo)}"
                alt="${escapeHTML(info.alt || "")}"
            >
        `;

    }


    destinationContent.textContent =
        info.value;


    if (copyPaymentBtn) {

        copyPaymentBtn.dataset.value =
            info.value;

    }

}


/* =========================================================
   COPY PAYMENT DESTINATION
========================================================= */

if (copyPaymentBtn) {

    copyPaymentBtn.addEventListener(
        "click",
        async () => {

            const value =
                copyPaymentBtn.dataset.value;


            if (!value) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    value
                );


                const originalText =
                    copyPaymentBtn.textContent;


                copyPaymentBtn.textContent =
                    "Copied!";


                setTimeout(
                    () => {

                        copyPaymentBtn.textContent =
                            originalText;

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
   SUPPORT FORM OPEN
========================================================= */

if (
    supportBtn &&
    supportSection
) {

    supportBtn.addEventListener(
        "click",
        () => {

            supportSection.hidden =
                false;


            if (formSuccess) {

                formSuccess.hidden =
                    true;

            }


            if (supportForm) {

                supportForm.hidden =
                    false;

            }


            supportSection.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"

            });

        }
    );

}


/* =========================================================
   CANCEL SUPPORT
========================================================= */

if (cancelSupport) {

    cancelSupport.addEventListener(
        "click",
        () => {

            supportSection.hidden =
                true;

            closeAllDropdowns();

        }
    );

}


/* =========================================================
   FILE UPLOAD
========================================================= */

if (supportProof) {

    supportProof.addEventListener(
        "change",
        () => {

            const file =
                supportProof.files[0];


            if (!file) {

                uploadText.textContent =
                    "Upload payment proof";

                return;

            }


            uploadText.textContent =
                file.name;

        }
    );

}


/* =========================================================
   NOTE CHARACTER COUNT
========================================================= */

if (
    supportNote &&
    characterCount
) {

    supportNote.addEventListener(
        "input",
        () => {

            characterCount.textContent =
                `${supportNote.value.length} / 150`;

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
                !supportForm.checkValidity()
            ) {

                supportForm.reportValidity();

                return;

            }


            const selectedMethod =
                supportPaymentMethod?.value ||
                "";


            const selectedCurrency =
                supportCurrency?.value ||
                "";


            const amount =
                supportAmount?.value ||
                "";


            if (!selectedMethod) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            if (!selectedCurrency) {

                alert(
                    "Please select a currency."
                );

                return;

            }


            if (
                !amount ||
                Number(amount) <= 0
            ) {

                alert(
                    "Please enter a valid amount."
                );

                return;

            }


            const file =
                supportProof?.files?.[0];


            if (!file) {

                alert(
                    "Please upload your payment proof."
                );

                return;

            }


            const displayName =
                supportForm.querySelector(
                    'input[name="display"]:checked'
                );


            const formData = {

                action:
                    "submitFunding",

                name:
                    supportName?.value.trim() ||
                    "",

                method:
                    selectedMethod,

                currency:
                    selectedCurrency,

                submittedAmount:
                    Number(amount),

                message:
                    supportNote?.value.trim() ||
                    "",

                displayName:
                    displayName
                        ? displayName.value
                        : "public",

                proof:
                    await fileToBase64(
                        file
                    )

            };


            try {

                const submitButton =
                    document.getElementById(
                        "submitSupport"
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Submitting...";

                }


                if (
                    !API_URL ||
                    API_URL ===
                    "YOUR_APPS_SCRIPT_WEB_APP_URL"
                ) {

                    throw new Error(
                        "Funding API URL has not been configured."
                    );

                }


                const response =
                    await fetch(
                        API_URL,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify(
                                    formData
                                )

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Submission failed."
                    );

                }


                /*
                 * SUCCESS
                 */

                supportForm.hidden =
                    true;


                if (formSuccess) {

                    formSuccess.hidden =
                        false;

                }


                supportForm.reset();


                resetFundingForm();


            } catch (error) {

                console.error(
                    "Funding submission error:",
                    error
                );


                alert(
                    error.message ||
                    "Something went wrong. Please try again."
                );


            } finally {

                const submitButton =
                    document.getElementById(
                        "submitSupport"
                    );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Support";

                }

            }

        }
    );

}


/* =========================================================
   RESET FORM UI
========================================================= */

function resetFundingForm() {

    if (supportPaymentMethod) {

        supportPaymentMethod.value =
            "";

    }


    if (paymentMethodLabel) {

        paymentMethodLabel.textContent =
            "Select payment method";

    }


    paymentMethodOptions.forEach(
        option => {

            option.classList.remove(
                "active"
            );

        }
    );


    if (supportCurrency) {

        supportCurrency.value =
            "";

    }


    if (currencyLabel) {

        currencyLabel.textContent =
            "Select currency";

    }


    currencyOptions.forEach(
        option => {

            option.classList.remove(
                "active"
            );

        }
    );


    if (uploadText) {

        uploadText.textContent =
            "Upload payment proof";

    }


    if (characterCount) {

        characterCount.textContent =
            "0 / 150";

    }


    if (paymentDestination) {

        paymentDestination.hidden =
            true;

    }


    closeAllDropdowns();

}


/* =========================================================
   SUCCESS CLOSE
========================================================= */

if (successClose) {

    successClose.addEventListener(
        "click",
        () => {

            if (formSuccess) {

                formSuccess.hidden =
                    true;

            }


            if (supportForm) {

                supportForm.hidden =
                    false;

            }


            if (supportSection) {

                supportSection.hidden =
                    true;

            }

        }
    );

}


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(
    amount,
    currencyCode
) {

    const number =
        Number(amount) || 0;


    try {

        return new Intl.NumberFormat(
            "en-US",
            {

                style:
                    "currency",

                currency:
                    currencyCode,

                maximumFractionDigits:
                    currencyCode === "IDR"
                        ? 0
                        : 2

            }
        ).format(number);


    } catch (error) {

        return `${currencyCode} ${number.toLocaleString()}`;

    }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value
) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        "en-US",
        {

            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"

        }
    );

}


/* =========================================================
   GET TRANSACTION DATE
========================================================= */

function getTransactionDate(
    transaction
) {

    return (
        transaction.submittedAt ||
        transaction.date ||
        transaction.createdAt ||
        ""
    );

}


/* =========================================================
   CONVERT TO ESTIMATED USD
========================================================= */

function convertToEstimatedUSD(
    amount,
    currencyCode
) {

    const number =
        Number(amount) || 0;


    const rate =
        estimatedRates[
            currencyCode
        ] || 0;


    return number * rate;

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateProgress() {

    const totalUSD =
        transactions.reduce(
            (
                total,
                transaction
            ) => {

                return total +
                    convertToEstimatedUSD(
                        transaction.actualReceived,
                        transaction.currency
                    );

            },
            0
        );


    const raisedText =
        `~$${Math.round(
            totalUSD
        ).toLocaleString(
            "en-US"
        )}`;


    const targetText =
        campaignTargetUSD > 0
            ? `Goal: ~$${Math.round(
                campaignTargetUSD
            ).toLocaleString(
                "en-US"
            )}`
            : "Goal: ~$0";


    [
        raisedAmountKofi,
        raisedAmountEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.textContent =
                        raisedText;

                }

            }
        );


    [
        fundingTargetKofi,
        fundingTargetEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.textContent =
                        targetText;

                }

            }
        );


    let percentage =
        0;


    if (
        campaignTargetUSD > 0
    ) {

        percentage =
            Math.min(
                (
                    totalUSD /
                    campaignTargetUSD
                ) * 100,
                100
            );

    }


    const percentageText =
        `${Math.round(
            percentage
        )}%`;


    [
        progressPercentKofi,
        progressPercentEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.textContent =
                        percentageText;

                }

            }
        );


    [
        progressFillKofi,
        progressFillEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.style.width =
                        `${percentage}%`;

                }

            }
        );

}


/* =========================================================
   RENDER CURRENCY SUMMARY
========================================================= */

function renderCurrencySummary(
    container
) {

    if (!container) {
        return;
    }


    const totals = {};


    transactions.forEach(
        transaction => {

            const code =
                transaction.currency;


            const amount =
                Number(
                    transaction.actualReceived
                ) || 0;


            if (!code) {
                return;
            }


            totals[code] =
                (
                    totals[code] || 0
                ) + amount;

        }
    );


    const currencies =
        Object.keys(
            totals
        );


    if (!currencies.length) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML =
        currencies
            .sort()
            .map(
                code => {

                    return `
                        <div class="currency-total">

                            <span>
                                ${escapeHTML(code)}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    formatCurrency(
                                        totals[code],
                                        code
                                    )
                                )}
                            </strong>

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   RENDER FUNDING GOALS
========================================================= */

function renderFundingGoals(
    container
) {

    if (!container) {
        return;
    }


    const activeGoals =
        fundingGoals.filter(
            goal =>
                isActive(goal)
        );


    if (!activeGoals.length) {

        container.innerHTML = `
            <div class="empty-state">
                No funding goals available.
            </div>
        `;

        updateCampaignTarget();

        return;

    }


    container.innerHTML =
        activeGoals
            .map(
                goal => {

                    const icon =
                        goal.icon ||
                        "💚";


                    const goalName =
                        goal.goal ||
                        "";


                    const description =
                        goal.description ||
                        "";


                    const amount =
                        Number(
                            goal.amount
                        ) || 0;


                    const code =
                        goal.currency ||
                        "USD";


                    return `
                        <div class="funding-goal">

                            <div class="goal-icon">
                                ${escapeHTML(icon)}
                            </div>

                            <div class="goal-content">

                                <strong>
                                    ${escapeHTML(goalName)}
                                </strong>

                                ${
                                    description
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    description
                                                )}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>

                            <div class="goal-amount">

                                ${escapeHTML(
                                    formatCurrency(
                                        amount,
                                        code
                                    )
                                )}

                            </div>

                        </div>
                    `;

                }
            )
            .join("");


    updateCampaignTarget();

}


/* =========================================================
   UPDATE CAMPAIGN TARGET
========================================================= */

function updateCampaignTarget() {

    campaignTargetUSD =
        fundingGoals
            .filter(
                goal =>
                    isActive(goal)
            )
            .reduce(
                (
                    total,
                    goal
                ) => {

                    return total +
                        convertToEstimatedUSD(
                            goal.amount,
                            goal.currency
                        );

                },
                0
            );


    updateProgress();

}


/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions(
    container
) {

    if (!container) {
        return;
    }


    if (!transactions.length) {

        container.innerHTML = `
            <div class="empty-state">
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
                        transaction.displayName ===
                        "anonymous"

                            ? "Anonymous"

                            : (
                                transaction.name ||
                                "Supporter"
                            );


                    const currencyCode =
                        transaction.currency ||
                        "USD";


                    const amount =
                        Number(
                            transaction.actualReceived
                        ) || 0;


                    const message =
                        transaction.message ||
                        transaction.note ||
                        "";


                    const date =
                        formatDate(
                            getTransactionDate(
                                transaction
                            )
                        );


                    return `
                        <div class="transaction-item">

                            <div class="transaction-main">

                                <div class="transaction-name">
                                    ${escapeHTML(name)}
                                </div>

                                ${
                                    message
                                        ? `
                                            <div class="transaction-message">
                                                ${escapeHTML(message)}
                                            </div>
                                        `
                                        : ""
                                }

                                <div class="transaction-date">
                                    ${escapeHTML(date)}
                                </div>

                            </div>

                            <div class="transaction-amount">

                                ${escapeHTML(
                                    formatCurrency(
                                        amount,
                                        currencyCode
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

function sortTransactions() {

    /*
     * Use the currently visible tab's sort.
     */

    const activeContent =
        document.querySelector(
            ".funding-content.active"
        );


    let mode =
        "latest";


    if (
        activeContent?.dataset.method ===
        "ewallet"
    ) {

        mode =
            sortSelectEwallet?.value ||
            "latest";

    } else {

        mode =
            sortSelectKofi?.value ||
            "latest";

    }


    const sortedTransactions =
        [...transactions];


    sortedTransactions.sort(
        (
            a,
            b
        ) => {

            if (
                mode === "latest"
            ) {

                return (
                    new Date(
                        getTransactionDate(b)
                    ) -
                    new Date(
                        getTransactionDate(a)
                    )
                );

            }


            if (
                mode === "oldest"
            ) {

                return (
                    new Date(
                        getTransactionDate(a)
                    ) -
                    new Date(
                        getTransactionDate(b)
                    )
                );

            }


            if (
                mode === "highest"
            ) {

                return (
                    convertToEstimatedUSD(
                        b.actualReceived,
                        b.currency
                    ) -
                    convertToEstimatedUSD(
                        a.actualReceived,
                        a.currency
                    )
                );

            }


            if (
                mode === "currency"
            ) {

                return (
                    (
                        a.currency ||
                        ""
                    ).localeCompare(
                        b.currency ||
                        ""
                    )
                );

            }


            return 0;

        }
    );


    /*
     * Temporarily use sorted data for rendering.
     */

    const original =
        transactions;


    transactions =
        sortedTransactions;


    renderTransactions(
        transactionListKofi
    );

    renderTransactions(
        transactionListEwallet
    );


    transactions =
        original;

}


/* =========================================================
   LOAD FUNDING DATA
========================================================= */

async function loadFundingData() {

    if (
        !API_URL ||
        API_URL ===
        "YOUR_APPS_SCRIPT_WEB_APP_URL"
    ) {

        console.warn(
            "Funding API URL has not been configured."
        );


        renderFundingGoals(
            goalListKofi
        );


        renderFundingGoals(
            goalListEwallet
        );


        renderTransactions(
            transactionListKofi
        );


        renderTransactions(
            transactionListEwallet
        );


        updateProgress();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}?action=getFunding`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to load funding data."
            );

        }


        transactions =
            Array.isArray(
                data.transactions
            )

                ? data.transactions
                    .map(
                        normalizeTransaction
                    )
                    .filter(
                        isReceived
                    )

                : [];


        fundingGoals =
            Array.isArray(
                data.goals
            )

                ? data.goals
                    .map(
                        normalizeGoal
                    )
                    .filter(
                        isActive
                    )

                : [];


        renderFundingGoals(
            goalListKofi
        );


        renderFundingGoals(
            goalListEwallet
        );


        renderCurrencySummary(
            currencySummaryKofi
        );


        renderCurrencySummary(
            currencySummaryEwallet
        );


        sortTransactions();


        updateProgress();


    } catch (error) {

        console.error(
            "Failed to load funding data:",
            error
        );


        if (goalListKofi) {

            goalListKofi.innerHTML = `
                <div class="empty-state">
                    Unable to load funding goals.
                </div>
            `;

        }


        if (goalListEwallet) {

            goalListEwallet.innerHTML = `
                <div class="empty-state">
                    Unable to load funding goals.
                </div>
            `;

        }


        if (transactionListKofi) {

            transactionListKofi.innerHTML = `
                <div class="empty-state">
                    Unable to load verified contributions.
                </div>
            `;

        }


        if (transactionListEwallet) {

            transactionListEwallet.innerHTML = `
                <div class="empty-state">
                    Unable to load verified contributions.
                </div>
            `;

        }

    }

}


/* =========================================================
   NORMALIZE TRANSACTION
========================================================= */

function normalizeTransaction(
    item
) {

    return {

        id:
            item.ID ??
            item.id ??
            "",


        submittedAt:
            item["Submitted At"] ??
            item.submittedAt ??
            item.date ??
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
            String(
                item.Currency ??
                item.currency ??
                "USD"
            ).toUpperCase(),


        submittedAmount:
            Number(
                item["Submitted Amount"] ??
                item.submittedAmount ??
                item.amount ??
                0
            ),


        actualReceived:
            Number(
                item["Actual Received"] ??
                item.actualReceived ??
                0
            ),


        proof:
            item.Proof ??
            item.proof ??
            "",


        note:
            item.Note ??
            item.note ??
            item.Message ??
            item.message ??
            "",


        message:
            item.Note ??
            item.note ??
            item.Message ??
            item.message ??
            "",


        displayName:
            String(
                item.Display ??
                item.displayName ??
                "public"
            ).toLowerCase(),


        received:
            item.Received ??
            item.received ??
            false

    };

}


/* =========================================================
   NORMALIZE GOAL
========================================================= */

function normalizeGoal(
    item
) {

    return {

        id:
            item.ID ??
            item.id ??
            "",


        icon:
            item.Icon ??
            item.icon ??
            "💚",


        goal:
            item.Goal ??
            item.goal ??
            "",


        description:
            item.Description ??
            item.description ??
            "",


        amount:
            Number(
                item.Amount ??
                item.amount ??
                0
            ),


        currency:
            String(
                item.Currency ??
                item.currency ??
                "USD"
            ).toUpperCase(),


        active:
            item.Active ??
            item.active ??
            true

    };

}


/* =========================================================
   RECEIVED CHECK
========================================================= */

function isReceived(
    transaction
) {

    const value =
        transaction.received;


    if (
        value === true ||
        value === 1
    ) {

        return true;

    }


    if (
        typeof value === "string"
    ) {

        return [
            "true",
            "yes",
            "y",
            "1",
            "received"
        ].includes(
            value.trim().toLowerCase()
        );

    }


    return false;

}


/* =========================================================
   ACTIVE CHECK
========================================================= */

function isActive(
    item
) {

    const value =
        item.active;


    if (
        value === true ||
        value === 1
    ) {

        return true;

    }


    if (
        typeof value === "string"
    ) {

        return [
            "true",
            "yes",
            "y",
            "1",
            "active"
        ].includes(
            value.trim().toLowerCase()
        );

    }


    return false;

}


/* =========================================================
   FILE → BASE64
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


            reader.onload =
                () => {

                    const result =
                        String(
                            reader.result
                        );


                    const base64 =
                        result.split(",")[1];


                    resolve(
                        base64
                    );

                };


            reader.onerror =
                error => {

                    reject(
                        error
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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


/* =========================================================
   INITIALIZE
========================================================= */

function initializeFunding() {

    console.log(
        "[FLARE U Funding] Initialized"
    );


    /* =========================
       FUNDING STATE
    ========================= */

    updateFundingState();


    if (FUNDING_ENABLED) {

        switchFundingMethod(
            "kofi"
        );

    }


    /* =========================
       DEFAULT SORT
    ========================= */

    if (sortSelectKofi) {

        sortSelectKofi.value =
            "latest";

    }


    if (sortSelectEwallet) {

        sortSelectEwallet.value =
            "latest";

    }


    /* =========================
       INITIAL DISPLAY
    ========================= */

    [
        raisedAmountKofi,
        raisedAmountEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.textContent =
                        "~$0";

                }

            }
        );


    [
        fundingTargetKofi,
        fundingTargetEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.textContent =
                        "Goal: ~$0";

                }

            }
        );


    [
        progressPercentKofi,
        progressPercentEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.textContent =
                        "0%";

                }

            }
        );


    [
        progressFillKofi,
        progressFillEwallet
    ]
        .forEach(
            element => {

                if (element) {

                    element.style.width =
                        "0%";

                }

            }
        );


    /* =========================
       LOAD DATA
    ========================= */

    loadFundingData();

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeFunding
    );

} else {

    initializeFunding();

}