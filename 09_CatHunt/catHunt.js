const startBtn = document.querySelector("button");
const log = document.querySelector(".log");
const cat = document.querySelector(".walking-cat");
const info = document.querySelector(".info");

const catHeight = cat.height;
const catWidth = cat.width;

const maxX = window.innerWidth;
const maxY = window.innerHeight - catHeight;

let speed = 50;
let direction = cat.dataset.dir;
let livesLeft = 9;

let msgs = [];

let xPos = -catWidth;
let yPos = randomYpos();

cat.style.left = xPos + "px";
cat.style.top = yPos + "px";

// Timeouts
let keepMoving;
let speeding;

function logMessage(msg) {
  const paragraph = document.createElement("p");
  paragraph.textContent = msg;

  // don't show more than 4 messages
  if (log.childNodes.length >= 4) {
    log.childNodes[0].remove();
  }

  log.appendChild(paragraph);
}

function randomYpos() {
  // must not be larger than the window height OR smaller than the hight of the cat
  // https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/

  return Math.floor(Math.random() * (maxY - catHeight) + catHeight);
}

function changeDirection() {
  if (direction === "left") {
    direction = "right";
  } else {
    direction = "left";
  }
  cat.dataset.dir = direction;
}

function move() {
  if (direction === "right") {
    xPos += 5;
  } else {
    xPos -= 5;
  }
  cat.style.left = xPos + "px";
  clearTimeout(keepMoving);

  // if we are within the viewport, keep moving
  if (xPos < maxX && xPos > -catWidth) {
    keepMoving = setTimeout(move, speed);
  } else {
    // otherwise start over
    if (direction === "right") {
      xPos = -catWidth;
    } else {
      xPos = maxX;
    }
    yPos = randomYpos();
    cat.style.top = yPos + "px";
    move();
  }
}

function flee() {
  speed = 10;
  move();

  // randomly change direction
  if (Math.round(Math.random())) {
    changeDirection();
  }

  // run for 1s
  speeding = setTimeout(function () {
    speed = 50;
    move();
  }, 1000);
}

function death() {
  cat.classList.add("dead");
  livesLeft -= 1;

  logMessage(`Meow 💀 ${livesLeft} lives left`);

  clearTimeout(keepMoving);
  clearTimeout(speeding);

  if (livesLeft > 0) {
    setTimeout(function () {
      xPos = -catWidth;
      yPos = randomYpos();
      cat.style.top = yPos + "px";
      cat.classList.remove("dead");
      speed = 50;
      move();
    }, 2000);
  } else {
    gameOver();
  }
}

function shoot() {
  logMessage(`Pew`);
}

function gameOver() {
  log.innerHTML = "";
  logMessage(`You killed the cat 😢`);

  clearTimeout(keepMoving);
  clearTimeout(speeding);

  info.querySelector("h1").innerHTML =
    "The po po's have been called<br/>RSPCA are on their way";
  startBtn.innerText = "Quick - revive Mr Black!";
  info.classList.remove("hide");

  document.body.classList.remove("playing");
  window.removeEventListener("mousedown", shoot);
}

function startGame() {
  msgs = [
    "Starting in 3...",
    "Starting in 2...",
    "Starting in 1...",
    "The cat is on the move",
  ];

  let delay = 0;
  msgs.forEach(function (msg) {
    // wait a second before logging the next message
    setTimeout(function () {
      logMessage(msg);
    }, delay);
    delay += 1000;
  });
  info.classList.add("hide");

  xPos = -catWidth;
  direction = "right";
  cat.dataset.dir = direction;

  // start game after all messages have been logged
  setTimeout(function () {
    cat.classList.remove("dead");
    window.addEventListener("mousedown", shoot);
    document.body.classList.add("playing");
    move();
  }, msgs.length * 1000);
}

startBtn.addEventListener("click", startGame);
cat.addEventListener("click", death);
cat.addEventListener("mouseenter", flee);
