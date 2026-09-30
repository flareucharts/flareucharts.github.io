/* =========================================================
   FLARE U GLOBAL
   COMEBACK FUNDING
========================================================= */

const FUNDING_ENABLED = true;


/* =========================
   CONFIG
========================= */

const API_URL =
    "YOUR_APPS_SCRIPT_WEB_APP_URL";


/* =========================
   ESTIMATED EXCHANGE RATES
   1 unit currency → USD
========================= */

const estimatedRates = {

    USD: 1,

    IDR:
        1 / 17000,

    THB:
        1 / 32,

    TWD:
        1 / 31,

    PHP:
        1 / 58

};


/* =========================================================
   FUNDING METHOD TABS
========================================================= */

const fundingMethodFilters =
    document.querySelectorAll(
        ".funding-method-filter"
    );

const fundingContents =
    document.querySelectorAll(
        ".funding-content"
    );


fundingMethodFilters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const target =
                button.dataset.method;


            fundingMethodFilters.forEach(
                tab => {

                    tab.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            fundingContents.forEach(
                content => {

                    const isActive =
                        content.id ===
                        `funding-${target}`;


                    content.hidden =
                        !isActive;

                    content.classList.toggle(
                        "active",
                        isActive
                    );

                }
            );

        }
    );

});


/* =========================================================
   DOM ELEMENTS
========================================================= */

/* =========================
   SUPPORT FORM
========================= */

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

const formSuccess =
    document.getElementById(
        "formSuccess"
    );

const successClose =
    document.getElementById(
        "successClose"
    );


/* =========================
   PAYMENT METHOD
========================= */

const paymentMethod =
    document.getElementById(
        "paymentMethod"
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


/* =========================
   PAYMENT DESTINATION
========================= */

const paymentDestination =
    document.getElementById(
        "paymentDestination"
    );

const paymentMethodLogo =
    document.getElementById(
        "paymentMethodLogo"
    );

const paymentLogo =
    document.getElementById(
        "paymentLogo"
    );

const destinationContent =
    document.getElementById(
        "destinationContent"
    );

const copyPaymentBtn =
    document.getElementById(
        "copyPaymentBtn"
    );


/* =========================
   CURRENCY
========================= */

const currency =
    document.getElementById(
        "currency"
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


/* =========================
   FORM
========================= */

const paymentProof =
    document.getElementById(
        "paymentProof"
    );

const uploadText =
    document.getElementById(
        "uploadText"
    );

const supportMessage =
    document.getElementById(
        "supportMessage"
    );

const messageCount =
    document.getElementById(
        "messageCount"
    );


/* =========================
   FUNDING DISPLAY
========================= */

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


/* =========================
   FUNDING DATA
========================= */

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


/* =========================
   SORT
========================= */

const sortFilterKofi =
    document.getElementById(
        "sortFilterKofi"
    );

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


const sortFilterEwallet =
    document.getElementById(
        "sortFilterEwallet"
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


/* =========================
   STATE
========================= */

let transactions = [];

let fundingGoals = [];

let campaignTargetUSD = 0;


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
   CUSTOM DROPDOWN
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
        .forEach(dropdown => {

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

        });

}


function toggleDropdown(
    container,
    menu
) {

    const isOpen =
        container.classList.contains(
            "active"
        );


    closeAllDropdowns(
        isOpen
            ? null
            : container
    );


    if (isOpen) {

        container.classList.remove(
            "active"
        );

        menu.classList.remove(
            "active"
        );

    } else {

        container.classList.add(
            "active"
        );

        menu.classList.add(
            "active"
        );

    }

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


                paymentMethod.value =
                    value;


                paymentMethodLabel.textContent =
                    text;


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


                currency.value =
                    value;


                currencyLabel.textContent =
                    text;


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
   SORT DROPDOWN SETUP
========================================================= */

function setupSortDropdown(
    filter,
    trigger,
    dropdown,
    label,
    select
) {

    if (
        !filter ||
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
        .forEach(option => {

            option.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const value =
                        option.dataset.value;


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

        });

}


setupSortDropdown(
    sortFilterKofi,
    sortTriggerKofi,
    sortDropdownKofi,
    sortLabelKofi,
    sortSelectKofi
);


setupSortDropdown(
    sortFilterEwallet,
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

    const info =
        paymentInfo[method];


    if (!info) {

        paymentDestination.hidden =
            true;

        return;

    }


    paymentDestination.hidden =
        false;


    if (info.logo) {

        paymentMethodLogo.hidden =
            false;


        paymentLogo.src =
            info.logo;


        paymentLogo.alt =
            info.alt || "";

    } else {

        paymentMethodLogo.hidden =
            true;


        paymentLogo.src =
            "";


        paymentLogo.alt =
            "";

    }


    destinationContent.textContent =
        info.value;


    copyPaymentBtn.dataset.value =
        info.value;

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

if (supportBtn) {

    supportBtn.addEventListener(
        "click",
        () => {

            supportSection.hidden =
                false;


            formSuccess.hidden =
                true;


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


/* =========================================================
   MESSAGE CHARACTER COUNT
========================================================= */

if (supportMessage) {

    supportMessage.addEventListener(
        "input",
        () => {

            messageCount.textContent =
                supportMessage.value.length;

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
                paymentMethod.value;


            const selectedCurrency =
                currency.value;


            const amount =
                document.getElementById(
                    "supportAmount"
                ).value;


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
                paymentProof.files[0];


            if (!file) {

                alert(
                    "Please upload your payment proof."
                );

                return;

            }


            const displayName =
                supportForm.querySelector(
                    'input[name="displayName"]:checked'
                );


            const formData = {

                action:
                    "submitFunding",

                name:
                    document
                        .getElementById(
                            "supporterName"
                        )
                        .value
                        .trim(),

                method:
                    selectedMethod,

                currency:
                    selectedCurrency,

                submittedAmount:
                    Number(amount),

                message:
                    supportMessage.value.trim(),

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
                    supportForm.querySelector(
                        ".submit-btn"
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;


                    submitButton.textContent =
                        "Submitting...";

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


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Submission failed."
                    );

                }


                supportForm.hidden =
                    true;


                formSuccess.hidden =
                    false;


                supportForm.reset();


                paymentMethod.value =
                    "";


                paymentMethodLabel.textContent =
                    "Select payment method";


                paymentMethodOptions.forEach(
                    option => {

                        option.classList.remove(
                            "active"
                        );

                    }
                );


                currency.value =
                    "";


                currencyLabel.textContent =
                    "Select currency";


                currencyOptions.forEach(
                    option => {

                        option.classList.remove(
                            "active"
                        );

                    }
                );


                uploadText.textContent =
                    "Upload payment screenshot";


                messageCount.textContent =
                    "0";


                paymentDestination.hidden =
                    true;


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
                    supportForm.querySelector(
                        ".submit-btn"
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
   SUCCESS CLOSE
========================================================= */

if (successClose) {

    successClose.addEventListener(
        "click",
        () => {

            formSuccess.hidden =
                true;


            supportForm.hidden =
                false;


            supportSection.hidden =
                true;

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
            ? `$${Math.round(
                campaignTargetUSD
            ).toLocaleString(
                "en-US"
            )}`
            : "~$0";


    if (raisedAmountKofi) {

        raisedAmountKofi.textContent =
            raisedText;

    }


    if (raisedAmountEwallet) {

        raisedAmountEwallet.textContent =
            raisedText;

    }


    if (fundingTargetKofi) {

        fundingTargetKofi.textContent =
            targetText;

    }


    if (fundingTargetEwallet) {

        fundingTargetEwallet.textContent =
            targetText;

    }


    let percentage = 0;


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


    if (progressPercentKofi) {

        progressPercentKofi.textContent =
            percentageText;

    }


    if (progressPercentEwallet) {

        progressPercentEwallet.textContent =
            percentageText;

    }


    if (progressFillKofi) {

        progressFillKofi.style.width =
            `${percentage}%`;

    }


    if (progressFillEwallet) {

        progressFillEwallet.style.width =
            `${percentage}%`;

    }

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


            if (!totals[code]) {
                totals[code] = 0;
            }


            totals[code] += amount;

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
                                ${escapeHTML(
                                    code
                                )}
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


    if (!fundingGoals.length) {

        container.innerHTML = `
            <div class="empty-state">
                No funding goals available.
            </div>
        `;

        return;

    }


    container.innerHTML =
        fundingGoals
            .filter(
                goal =>
                    isActive(goal)
            )
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
                                ${escapeHTML(
                                    icon
                                )}
                            </div>

                            <div class="goal-content">

                                <strong>
                                    ${escapeHTML(
                                        goalName
                                    )}
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


    /* =========================
       CAMPAIGN TARGET
    ========================= */

    const targetGoal =
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

                    const amount =
                        Number(
                            goal.amount
                        ) || 0;


                    const code =
                        goal.currency ||
                        "USD";


                    return total +
                        convertToEstimatedUSD(
                            amount,
                            code
                        );

                },
                0
            );


    if (
        targetGoal > 0
    ) {

        campaignTargetUSD =
            targetGoal;

    }


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
                                    ${escapeHTML(
                                        name
                                    )}
                                </div>

                                ${
                                    message
                                        ? `
                                            <div class="transaction-message">
                                                ${escapeHTML(
                                                    message
                                                )}
                                            </div>
                                        `
                                        : ""
                                }

                                <div class="transaction-date">
                                    ${escapeHTML(
                                        date
                                    )}
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

    const mode =
        sortSelectEwallet?.value ||
        sortSelectKofi?.value ||
        "latest";


    transactions.sort(
        (
            a,
            b
        ) => {

            if (
                mode === "latest"
            ) {

                return (
                    new Date(
                        getTransactionDate(
                            b
                        )
                    ) -
                    new Date(
                        getTransactionDate(
                            a
                        )
                    )
                );

            }


            if (
                mode === "oldest"
            ) {

                return (
                    new Date(
                        getTransactionDate(
                            a
                        )
                    ) -
                    new Date(
                        getTransactionDate(
                            b
                        )
                    )
                );

            }


            if (
                mode === "highest"
            ) {

                const amountA =
                    convertToEstimatedUSD(
                        a.actualReceived,
                        a.currency
                    );


                const amountB =
                    convertToEstimatedUSD(
                        b.actualReceived,
                        b.currency
                    );


                return (
                    amountB -
                    amountA
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


    renderTransactions(
        transactionListKofi
    );


    renderTransactions(
        transactionListEwallet
    );

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


        /* =========================
           TRANSACTIONS
        ========================= */

        transactions =
            Array.isArray(
                data.transactions
            )

                ? data.transactions
                    .map(
                        normalizeTransaction
                    )
                    .filter(
                        transaction =>
                            isReceived(
                                transaction
                            )
                    )

                : [];


        /* =========================
           GOALS
        ========================= */

        fundingGoals =
            Array.isArray(
                data.goals
            )

                ? data.goals
                    .map(
                        normalizeGoal
                    )
                    .filter(
                        goal =>
                            isActive(
                                goal
                            )
                    )

                : [];


        renderFundingGoals(
            goalListKofi
        );


        renderFundingGoals(
            goalListEwallet
        );


        sortTransactions();


        renderCurrencySummary(
            currencySummaryKofi
        );


        renderCurrencySummary(
            currencySummaryEwallet
        );


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
            value
                .trim()
                .toLowerCase()
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
            value
                .trim()
                .toLowerCase()
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
                        reader.result;


                    const base64 =
                        String(
                            result
                        ).split(",")[1];


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
                        "~$0";

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