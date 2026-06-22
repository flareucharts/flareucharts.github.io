<script>

/* ================= ELEMENT ================= */

const chatBtn = document.getElementById("chatButton");
const chatPopup = document.getElementById("liveChat");
const closeChat = document.getElementById("closeChat");

const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const chatBody = document.getElementById("chatBody");

const joinBtn = document.getElementById("joinBtn");
const joinModal = document.getElementById("joinModal");
const confirmJoin = document.getElementById("confirmJoin");
const nicknameInput = document.getElementById("nicknameInput");

const guestBox = document.getElementById("guestBox");
const chatInputArea = document.getElementById("chatInputArea");

/* ================= USER ================= */

let username = localStorage.getItem("flareUsername");

const emojiList = [
  "🐰","🦊","🐱","🐻","🐶",
  "✨","🌸","💚","⭐","🎀"
];

let emoji =
emojiList[Math.floor(Math.random() * emojiList.length)];

/* ================= AUTO LOGIN ================= */

if(username){

  guestBox.style.display = "none";

  chatInputArea.classList.remove("hidden");

}

/* ================= OPEN CHAT ================= */

chatBtn.addEventListener("click", () => {

  chatPopup.classList.add("show");

  chatBtn.style.display = "none";

});

/* ================= CLOSE CHAT ================= */

closeChat.addEventListener("click", () => {
  chatPopup.classList.remove("show");
  chatBtn.style.display = "flex";
});

/* ================= OPEN JOIN ================= */

joinBtn.addEventListener("click", () => {

  joinModal.classList.add("show");

});

/* ================= JOIN CHAT ================= */

confirmJoin.addEventListener("click", () => {

  const nickname =
  nicknameInput.value.trim();

  if(nickname === ""){

    alert("Enter nickname first");
    return;

  }

  username = nickname;

  localStorage.setItem(
    "flareUsername",
    username
  );

  joinModal.classList.remove("show");

  guestBox.style.display = "none";

  chatInputArea.classList.remove("hidden");

});

/* ================= SEND ================= */

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", function(e){

  if(e.key === "Enter"){
    sendMessage();
  }

});

/* ================= TRANSLATE ================= */

async function translateKorean(text){

  const isKorean =
  /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

  if(!isKorean){
    return "";
  }

  try{

    const response = await fetch(
      "https://libretranslate.de/translate",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          q:text,
          source:"ko",
          target:"en",
          format:"text"
        })
      }
    );

    const data = await response.json();

    return data.translatedText;

  }catch(err){

    return "";

  }

}

/* ================= MESSAGE ================= */

async function sendMessage(){

  const text =
  chatInput.value.trim();

  if(text === "") return;

  const now = "now";

  const translated =
  await translateKorean(text);

  /* CHECK LAST MESSAGE */

  const lastMessage =
  chatBody.lastElementChild;

  let sameUser = false;

  if(lastMessage){

    const lastUser =
    lastMessage.getAttribute("data-user");

    if(lastUser === username){

      sameUser = true;

    }

  }

  /* CREATE */

  const msg =
  document.createElement("div");

  msg.className = "message right";

  msg.setAttribute(
    "data-user",
    username
  );

  /* SAME USER */

  if(sameUser){

    msg.innerHTML = `
      <div class="bubble">

        ${text}

        ${
          translated
          ?
          `<div class="translated">
            ${translated}
          </div>`
          :
          ""
        }

      </div>
    `;

  }

  /* NEW USER */

  else{
    msg.innerHTML = `
      <div class="username">
        ${emoji} ${username}
        <span class="time">
          ${now}
        </span>
      </div>
      <div class="bubble">
        ${text}
        ${
          translated
          ?
          `<div class="translated">
            ${translated}
          </div>`
          :
          ""
        }
      </div>
    `;

  }
  chatBody.appendChild(msg);
  chatInput.value = "";
  chatBody.scrollTop =
  chatBody.scrollHeight;
}

</script>