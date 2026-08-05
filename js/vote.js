const voteData = [
{
    status: "ongoing",
    countdown: "23h : 40m : 59s",
    app: "LINE MUSIC",
    logo: "linemusic",
    title: "LINE MUSIC Daily Vote",
    period: "2026.08.04 - 2026.08.05",
    theme: "pink",
    link: "#"
}
];

renderVote();

function renderVote(){

    const container = document.querySelector(".vote-list");

    container.innerHTML = voteData.map(vote => `

        <div class="vote-card ${vote.theme}">

            <div class="vote-header">

                <div class="vote-status">

                    <span class="status ${vote.status}">
                        ${vote.status === "ongoing" ? "Ongoing" : "Ended"}
                    </span>

                    <span class="countdown">
                        ${vote.countdown}
                    </span>

                </div>

            </div>

            <div class="vote-body">

                <div class="vote-app">
                    ${vote.app}
                </div>

                <h3>
                    ${vote.title}
                </h3>

            </div>

            <div class="vote-footer">

                <div>

                    <small>Period</small>

                    <p>${vote.period}</p>

                </div>

                <a href="${vote.link}" class="vote-now">
                    Vote now
                </a>

            </div>

        </div>

    `).join("");

}