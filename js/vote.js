const appLogos = {
    "Upick": "images/apps/upick.webp",
    "Mnet Plus": "images/apps/mnetplus.webp",
    "Mubeat": "images/apps/mubeat.png",
    "Kooky": "images/apps/kooky.png",
    "Idol Champ": "images/apps/idol-champ.png",
    "Coogoong": "images/apps/coogoong.jpg",
    "Higher": "images/apps/higher.png",
    "LiNC": "images/apps/linc.png",
    "Muniverse": "images/apps/muniverse.png",
    "BigC": "images/apps/bigc.jpg",
    "Podoal": "images/apps/podoal.png",
    "Fandora": "images/apps/fandora.png",
    "DuckAd": "images/apps/duckad.png"
};

function getDominantColor(imageSrc) {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = function () {

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 50;
      canvas.height = 50;

      ctx.drawImage(img, 0, 0, 50, 50);

      const data = ctx.getImageData(
        0,
        0,
        50,
        50
      ).data;

      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {

        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];

        // Abaikan transparan
        if (alpha < 100) continue;

        // Abaikan putih
        if (
          red > 235 &&
          green > 235 &&
          blue > 235
        ) continue;

        r += red;
        g += green;
        b += blue;

        count++;
      }

      if (!count) {
        resolve("#ffffff");
        return;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = function () {
      resolve("#ffffff");
    };

    img.src = imageSrc;
  });
}

const voteData = [
    {
        status: "ongoing",
        countdown: "1d 23:30:20",
        app: "Upick",
        title: "LINE MUSIC Daily Vote",
        period: "2026.08.04 - 2026.08.05",
        theme: "pink",
        link: "#"
    }
];

async function renderVote() {

    const container = document.querySelector(".vote-list");

    const cards = await Promise.all(
        voteData.map(async vote => {

            const logo = appLogos[vote.app];

            // Baca warna dominan dari logo
            const color = await getDominantColor(logo);

            return `

                <div
                    class="vote-card ${vote.theme}"
                    style="--app-color: ${color};"
                >

                    <div class="vote-header">

                        <div class="vote-status">

                            <span class="status ${vote.status}">
                                Ongoing
                            </span>

                            <span class="countdown">
                                ${vote.countdown}
                            </span>

                        </div>

                        <img
                            src="${logo}"
                            class="vote-logo"
                            alt="${vote.app}"
                        >

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

                        <a
                            href="${vote.link}"
                            class="vote-now"
                        >
                            Vote now
                        </a>

                    </div>

                </div>

            `;
        })
    );

    container.innerHTML = cards.join("");
}

const sortBtn = document.querySelector(".sort-btn");
const dropdown = document.querySelector(".sort-dropdown");
const sortOptions = document.querySelectorAll(".sort-option");

if (sortBtn && dropdown) {

    const sortBtnText = sortBtn.childNodes[0];

    sortBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        dropdown.classList.remove("active");
    });

    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    sortOptions.forEach(option => {

        option.addEventListener("click", () => {

            sortOptions.forEach(item =>
                item.classList.remove("active")
            );

            option.classList.add("active");

            sortBtnText.textContent =
                option.textContent.trim() + " ";

            dropdown.classList.remove("active");

            // nanti sorting data di sini

        });

    });

}