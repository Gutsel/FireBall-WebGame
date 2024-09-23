const startMenu = document.getElementById("start-menu");
const controlsMenu = document.getElementById("controls-menu");
const gameArea = document.querySelector(".game-area");
const startButton = document.getElementById("start-button");
const controlsButton = document.getElementById("controls-button");
const backButton1 = document.getElementById("back-button1");
const backButton2 = document.getElementById("back-button2");
const restartButton = document.getElementById("restart-button");
const pauseMenu = document.getElementById("pause-menu");
const resumeButton = document.getElementById("resume-button");
const mainMenuButton = document.getElementById("main-menu-button");
const mainMenuButtonrestart = document.getElementById(
  "restart-menu-main-menu-button"
);
const countdownDisplay = document.getElementById("countdownDisplay");

const playerNameMenu = document.getElementById("player-name-menu");
const HighscoreScreen = document.getElementById("highscoremenu");
const startButtonName = document.getElementById("start-button-name");
const nameTextInput = document.getElementById("fname");
const highscoreButton = document.getElementById("highscore-button");
const highscoreList = document.getElementById("highscore-list");

const character1 = document.getElementById("character1");
const bot = document.getElementById("bot");
const life1 = document.getElementById("life1");
const life2 = document.getElementById("life2");
const gameOverScreen = document.getElementById("game-over");

const fireballHitSound = document.getElementById("fireball-hit-sound");
fireballHitSound.volume = 1;
const ambientMusic = document.getElementById("ambient-music");
ambientMusic.volume = 0.1;

let gameLoop = null;
let isPaused = false;

let isCountdownActive = false;

let countdownInterval;
let countdownValue = 3;

let playerName;
let playerNamefield = [];

let botMaxHealth = 5;

let character1Pos = {
  left: 50,
  bottom: 0,
  isJumping: false,
  velocityY: 0,
  health: 5,
  jumpCount: 0,
  isBlocking: false,
  lastBlockTime: 0,
};

let botPos = {
  left: 700,
  bottom: 0,
  isJumping: false,
  velocityY: 0,
  health: botMaxHealth,
  jumpCount: 0,
  isBlocking: false,
  lastBlockTime: 0,
};


const gravity = 0.8;
const moveSpeed = 10;
const jumpHeight = 15;
const fireballSpeed = 8;
const fireballs = [];

let keysPressed = {
  a: false,
  d: false,
  w: false,
  q: false,
  r: false,

  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  "-": false,
};

let lastShotTimeCharacter1 = 0;
let shotsFiredCharacter1 = 0;

let lastShotTimeBot = 0;
let shotsFiredBot = 0;

const cooldownDuration = 2000;
const maxShots = 3;
let botMaxShots = 3;

let shield1, shield2;

let largeFireball = null;

let lastShotTimeCharacter1Big = 0;
let lastShotTimeBotBig = 0;
const bigFireballCooldown = 10000;

let largeFireballs = [];

let currentLevel = 1;
let playerWinsAllLevels = false;

var images = [
  'Assets/backgrounds/background1.webp', 
  'Assets/backgrounds/background2.webp', 
  'Assets/backgrounds/background3.webp', 
  'Assets/backgrounds/background4.webp', 
  'Assets/backgrounds/background5.webp', 
  'Assets/backgrounds/background6.webp', 
  'Assets/backgrounds/background7.webp', 
  'Assets/backgrounds/background8.webp', 
  'Assets/backgrounds/background9.webp', 
  'Assets/backgrounds/background10.webp' 
];

loadHighscores();



function startGame() {
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }

  botConfig(currentLevel);
  character1Pos = {
    left: 50,
    bottom: 0,
    isJumping: false,
    velocityY: 0,
    health: 5,
    jumpCount: 0,
    isBlocking: false,
    lastBlockTime: 0,
  };

  botPos = {
    left: 700,
    bottom: 0,
    isJumping: false,
    velocityY: 0,
    health: botMaxHealth,
    jumpCount: 0,
    isBlocking: false,
    lastBlockTime: 0,
  };

  fireballs.length = 0;
  largeFireballs.length = 0;
  lastShotTimeCharacter1Big = 0;
  lastShotTimeBotBig = 0;

  const fireballElements = document.querySelectorAll(
    ".fireball-char1, .fireball-char1-left, .fireball-bot, .fireball-bot-left"
  );
  fireballElements.forEach((element) => element.remove());

  const largeFireballElements = document.querySelectorAll(
    ".fireball2-char1, .fireball2-char1-left, .fireball2-bot, .fireball2-bot-left"
  );
  largeFireballElements.forEach((element) => element.remove());

  updateLifeBars();

  gameOverScreen.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  countdownDisplay.classList.add("hidden");
  playerNameMenu.classList.add("hidden");
  HighscoreScreen.classList.add("hidden");
  controlsMenu.classList.add("hidden");
  gameArea.classList.remove("hidden");
  startLevel(currentLevel);
}

function startLevel(level) {
  if (currentLevel > 10){
    incrementWin(playerName);
    currentLevel = 1;
  }
  if (currentLevel === 10){
    document.getElementById("info").innerHTML = "WIN AGAINST THE BOSS";
  }
  else {
    document.getElementById("info").innerHTML = "Reach Level 10";
  }

  document.getElementById("level").innerHTML = "Level " + currentLevel;
  changeImage();
  startCountdown();
}

function botConfig(level){
  switch (level){
    case 1:
    botMaxHealth = 5;
    botMaxShots = 3;
    break;
    case 2:
    botMaxHealth = 6;
    botMaxShots = 3;
    break;
    case 3:
    botMaxHealth = 8;
    botMaxShots = 3;
    break;
    case 4:
    botMaxHealth = 9;
    botMaxShots = 3;
    break;
    case 5:
    botMaxHealth = 10;
    botMaxShots = 3;
    break;
    case 6:
    botMaxHealth = 12;
    botMaxShots = 4;
    break;
    case 7:
    botMaxHealth = 13;
    botMaxShots = 5;
    break;
    case 8:
    botMaxHealth = 14;
    botMaxShots = 5;
    break;
    case 9:
    botMaxHealth = 15;
    botMaxShots = 5;
    break;
    case 10:
    botMaxHealth = 20;
    botMaxShots = 8;
    break;
  }
}

function changeImage() {
  document.body.style.backgroundImage = 'url(' + images[currentLevel - 1] + ')';
}

function startCountdown() {
  startMenu.classList.add("hidden");
  controlsMenu.classList.add("hidden");
  gameArea.classList.remove("hidden");
  HighscoreScreen.classList.add("hidden");
  pauseMenu.classList.add("hidden");

  countdownValue = 3;
  countdownDisplay.classList.remove("hidden");
  countdownDisplay.textContent = countdownValue;

  clearInterval(gameLoop);
  gameLoop = null;

  if (countdownInterval) clearInterval(countdownInterval);

  isCountdownActive = true;

  countdownInterval = setInterval(function () {
    countdownValue--;
    if (countdownValue <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = "FIGHT"; 
      ambientMusic.play();

      setTimeout(function () {
        countdownDisplay.classList.add("hidden");
        if (!gameLoop) {
          gameLoop = setInterval(update, 30);
        }
        isCountdownActive = false;
      }, 1000); 
    } else {
      countdownDisplay.textContent = countdownValue;
    }
    
  }, 1000);
}

function showControls() {
  startMenu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  gameArea.classList.add("hidden");
  HighscoreScreen.classList.add("hidden");
  playerNameMenu.classList.add("hidden");

  controlsMenu.classList.remove("hidden");
}

function showStartMenu() {
  controlsMenu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  gameArea.classList.add("hidden");
  HighscoreScreen.classList.add("hidden");
  playerNameMenu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  startMenu.classList.remove("hidden");
}

function pauseGame() {
  if (gameOverScreen.classList.contains("hidden") && !isPaused) {
    isPaused = true;
    controlsMenu.classList.add("hidden");
    startMenu.classList.add("hidden");
    HighscoreScreen.classList.add("hidden");
    HighscoreScreen.classList.add("hidden");
    playerNameMenu.classList.add("hidden");
    pauseMenu.classList.remove("hidden");
    clearInterval(gameLoop);
    gameLoop = null;
    ambientMusic.pause();
  }
}

function resumeGame() {
  if (isPaused) {
    isPaused = false;
    pauseMenu.classList.add("hidden");
    controlsMenu.classList.add("hidden");
    startMenu.classList.add("hidden");
    HighscoreScreen.classList.add("hidden");
    HighscoreScreen.classList.add("hidden");
    playerNameMenu.classList.add("hidden");
    gameArea.classList.remove("hidden");

    if (!gameLoop) {
      gameLoop = setInterval(update, 30);
    }
  }
}

function handleKeyDown(e) {
  if (e.key === "Escape") {
    if (
      !gameOverScreen.classList.contains("hidden") ||
      isCountdownActive === true
    ) {
      return;
    }

    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
    return;
  }

  if (["a", "d", "q", "r"].includes(e.key)) keysPressed[e.key] = true;

  if (e.key === "w" && character1Pos.jumpCount < 2) {
    character1Pos.isJumping = true;
    character1Pos.velocityY = jumpHeight;
    character1Pos.jumpCount++;
  }

  if (e.key === "q") {
    if (isCountdownActive === false)
      shootFireball(character1Pos, botPos, "character1");
  }

  if (e.key === "e" && character1) {
    if (isCountdownActive === false) activateBlock(character1Pos);
  }

  if (e.key === "r") {
    if (isCountdownActive === false)
      shootSingleFireball(character1Pos, botPos, "character1");
  }
}

function handleKeyUp(e) {
  if (["a", "d", "q", "r"].includes(e.key)) keysPressed[e.key] = false;
  if (["ArrowLeft", "ArrowRight", "-"].includes(e.key))
    keysPressed[e.key] = false;
}

function shootFireball(characterPos, targetPos, characterType) {
  const currentTime = Date.now();
  let lastShotTime, shotsFired, maxShotsAllowed;

  if (characterType === "character1") {
    lastShotTime = lastShotTimeCharacter1;
    shotsFired = shotsFiredCharacter1;
    maxShotsAllowed = maxShots;
  } else if (characterType === "bot") {
    lastShotTime = lastShotTimeBot;
    shotsFired = shotsFiredBot;
    maxShotsAllowed = botMaxShots;
  }

  if (gameOverScreen.classList.contains("hidden")) {
    if (currentTime - lastShotTime > cooldownDuration) {
      if (characterType === "character1") {
        lastShotTimeCharacter1 = currentTime;
        shotsFiredCharacter1 = 0;
      } else if (characterType === "bot") {
        lastShotTimeBot = currentTime;
        shotsFiredBot = 0;
      }
    }

    if (shotsFired < maxShotsAllowed) { 
      const targetDirection =
        targetPos.left > characterPos.left ? "right" : "left";

      const fireball = document.createElement("div");
      fireball.style.left =
        characterPos.left + (targetDirection === "right" ? 50 : -10) + "px";
      fireball.style.bottom = characterPos.bottom + 50 + "px";
      fireball.classList.add(
        characterType === "character1"
          ? targetDirection === "right"
            ? "fireball-char1"
            : "fireball-char1-left"
          : targetDirection === "right"
          ? "fireball-bot"
          : "fireball-bot-left"
      );

      gameArea.appendChild(fireball);

      fireballs.push({
        element: fireball,
        direction: targetDirection,
        owner: characterPos,
      });

      if (characterType === "character1") {
        shotsFiredCharacter1++;
      } else if (characterType === "bot") {
        shotsFiredBot++;
      }
    }
  }
}

function playFireballHitSound() {
  fireballHitSound.currentTime = 0;
  fireballHitSound.play();
}

function updateFireballs() {
  fireballs.forEach((fireballObj, index) => {
    const fireball = fireballObj.element;
    const direction = fireballObj.direction;

    if (direction === "right") {
      fireball.style.left =
        parseInt(fireball.style.left) + fireballSpeed + "px";
    } else {
      fireball.style.left =
        parseInt(fireball.style.left) - fireballSpeed + "px";
    }

    if (
      parseInt(fireball.style.left) < 0 ||
      parseInt(fireball.style.left) > gameArea.offsetWidth
    ) {
      fireball.remove();
      fireballs.splice(index, 1);
    } else {
      detectCollision(fireballObj);
    }
  });
}

function fireballHitsTarget(fireballRect, targetRect) {
  return (
    fireballRect.left < targetRect.right &&
    fireballRect.right > targetRect.left &&
    fireballRect.top < targetRect.bottom &&
    fireballRect.bottom > targetRect.top
  );
}

function shootSingleFireball(characterPos, targetPos, characterType) {
  const currentTime = Date.now();
  const fireballCooldown = 10000;

  if (characterType === "character1") {
    if (currentTime - lastShotTimeCharacter1Big < fireballCooldown) {
      return;
    }
    lastShotTimeCharacter1Big = currentTime;
  } else if (characterType === "bot") {
    if (currentTime - lastShotTimeBotBig < fireballCooldown) {
      return;
    }
    lastShotTimeBotBig = currentTime;
  }

  const targetDirection = targetPos.left > characterPos.left ? "right" : "left";

  const fireball = {
    left: characterPos.left + (targetDirection === "right" ? 60 : -30),
    bottom: characterPos.bottom + 70,
    direction: targetDirection,
    color: characterType === "character1" ? "red" : "blue",
    element: document.createElement("div"),
    owner: characterType,
    hasExploded: false,
  };

  fireball.element.classList.add(
    characterType === "character1"
      ? targetDirection === "right"
        ? "fireball2-char1"
        : "fireball2-char1-left"
      : targetDirection === "right"
      ? "fireball2-bot"
      : "fireball2-bot-left"
  );

  fireball.element.style.left = fireball.left + "px";
  fireball.element.style.bottom = fireball.bottom + "px";

  gameArea.appendChild(fireball.element);

  largeFireballs.push(fireball);
}

function updateLargeFireballs() {
  for (let i = largeFireballs.length - 1; i >= 0; i--) {
    const fireball = largeFireballs[i];

    fireball.left +=
      fireball.direction === "right" ? fireballSpeed : -fireballSpeed;

    fireball.element.style.left = fireball.left + "px";
    fireball.element.style.bottom = fireball.bottom + "px";

    if (fireball.left < 0 || fireball.left > gameArea.offsetWidth) {
      removeLargeFireball(fireball, i);
    } else {
      detectLargeFireballCollision(fireball);
    }
  }
}

function removeLargeFireball(fireball, index) {
  gameArea.removeChild(fireball.element);
  largeFireballs.splice(index, 1);
}

function detectLargeFireballCollision(fireball) {
  const fireballRect = {
    left: fireball.left,
    right: fireball.left + 80,
    top: fireball.bottom,
    bottom: fireball.bottom + 80,
  };

  const character1Rect = {
    left: character1Pos.left,
    right: character1Pos.left + 50,
    top: character1Pos.bottom,
    bottom: character1Pos.bottom + 100,
  };

  const botRect = {
    left: botPos.left,
    right: botPos.left + 50,
    top: botPos.bottom,
    bottom: botPos.bottom + 100,
  };

  if (
    fireball.owner !== "character1" &&
    !fireball.hasExploded &&
    fireballHitsTarget(fireballRect, character1Rect)
  ) {
    if (!character1Pos.isBlocking) {
      character1Pos.health -= 3;
      updateLifeBars();
    }
    createLargeExplosion(fireball, "bot");
    playFireballHitSound();
    fireball.hasExploded = true;
    removeLargeFireball(fireball, largeFireballs.indexOf(fireball));
    checkGameOver();
  }

  if (
    fireball.owner !== "bot" &&
    !fireball.hasExploded &&
    fireballHitsTarget(fireballRect, botRect)
  ) {
    if (!botPos.isBlocking) {
      botPos.health -= 3;
      updateLifeBars();
    }
    createLargeExplosion(fireball, "character1");
    playFireballHitSound();
    fireball.hasExploded = true;
    removeLargeFireball(fireball, largeFireballs.indexOf(fireball));
    checkGameOver();
  }
}

function createLargeExplosion(fireball, characterType) {
  if (!fireball.hasExploded) {
    const explosion = document.createElement("div");
    if (characterType === "bot") {
      explosion.classList.add("explosion2bot");
    } else {
      explosion.classList.add("explosion2char");
    }
    explosion.style.left = fireball.left + "px";
    explosion.style.bottom = fireball.bottom + "px";
    gameArea.appendChild(explosion);

    setTimeout(() => explosion.remove(), 500);
  }
}

function activateBlock(character) {
  if (gameOverScreen.classList.contains("hidden")) {
    const now = Date.now();
    const cooldown = 1500;

    if (now - character.lastBlockTime < cooldown) {
      return;
    }

    if (character === character1Pos && shield1) {
      shield1.remove();
    }
    if (character === botPos && shield2) {
      shield2.remove();
    }

    const shield = document.createElement("div");
    shield.classList.add("shield");

    if (character === character1Pos) {
      shield.classList.add("shield-character1");
      shield1 = shield;
    } else {
      shield.classList.add("shield-character2");
      shield2 = shield;
    }

    shield.style.left = character.left + "px";
    shield.style.bottom = character.bottom + "px";

    shield.style.display = "block";
    gameArea.appendChild(shield);

    character.isBlocking = true;
    character.lastBlockTime = now;

    setTimeout(() => {
      character.isBlocking = false;
      shield.remove();
      if (character === character1Pos) shield1 = null;
      if (character === botPos) shield2 = null;
    }, 500);
  }
}
function detectCollision(fireballObj) {
  const fireballRect = {
    left: fireballObj.element.style.left
      ? parseInt(fireballObj.element.style.left)
      : 0,
    right:
      (fireballObj.element.style.left
        ? parseInt(fireballObj.element.style.left)
        : 0) + 20,
    top: fireballObj.element.style.bottom
      ? parseInt(fireballObj.element.style.bottom)
      : 0,
    bottom:
      (fireballObj.element.style.bottom
        ? parseInt(fireballObj.element.style.bottom)
        : 0) + 20,
  };

  const characterRects = [
    {
      character: character1Pos,
      rect: {
        left: character1Pos.left,
        right: character1Pos.left + 50,
        top: character1Pos.bottom,
        bottom: character1Pos.bottom + 100,
      },
      type: "character1",
    },
    {
      character: botPos,
      rect: {
        left: botPos.left,
        right: botPos.left + 50,
        top: botPos.bottom,
        bottom: botPos.bottom + 100,
      },
      type: "bot",
    },
  ];

  characterRects.forEach(({ character, rect, type }) => {
    if (
      fireballObj.owner !== character &&
      fireballHitsTarget(fireballRect, rect)
    ) {
      if (!character.isBlocking) {
        character.health--;
        updateLifeBars();
      }
      fireballObj.element.remove();
      fireballs.splice(fireballs.indexOf(fireballObj), 1);
      createExplosion(
        fireballRect,
        type === "character1" ? "bot" : "character1"
      );
      playFireballHitSound();
      checkGameOver();
    }
  });
}

function createExplosion(fireballRect, characterType) {
  const explosion = document.createElement("div");

  if (characterType === "bot") {
    explosion.classList.add("explosionbot");
  } else {
    explosion.classList.add("explosionchar");
  }

  explosion.style.left = fireballRect.left + "px";
  explosion.style.bottom = fireballRect.bottom + "px";

  gameArea.appendChild(explosion);

  setTimeout(() => explosion.remove(), 500);
}

function checkGameOver() {
  if (character1Pos.health <= 0 || botPos.health <= 0) {
    gameOverScreen.classList.remove("hidden");
    clearInterval(gameLoop);

    let winnerText;
    if (character1Pos.health > 0) {
      winnerText = `${playerName} WINS`;
      currentLevel++;
    } else {
      winnerText = "Bot WINS";
      currentLevel = 1;
    }

    document.getElementById("game-over-text").textContent = winnerText;
  }
}

function updateLifeBars() {
  const maxHealth = 5;
  const barWidth = 120;

  const life1Width = (character1Pos.health / maxHealth) * barWidth;
  const life2Width = (botPos.health / botMaxHealth) * barWidth;

  document.getElementById("life1").style.width = life1Width + "px";
  document.getElementById("life2").style.width = life2Width + "px";

  document.getElementById("life-text1").textContent =
    character1Pos.health + "/ 5 HP";
  document.getElementById("life-text2").textContent = botPos.health + "/ "  + botMaxHealth + " HP";

}

function update() {
  if (!gameOverScreen.classList.contains("hidden")) return;

  if (keysPressed["a"]) {
    character1Pos.left = Math.max(0, character1Pos.left - moveSpeed);
  }
  if (keysPressed["d"]) {
    character1Pos.left = Math.min(750, character1Pos.left + moveSpeed);
  }

  updateBotMovement();
  updateBotBehavior();

  applyGravity(character1Pos);
  applyGravity(botPos);

  updateFireballs();
  updateLargeFireballs();

  render();
  updatePositions();
  updateCharacterDirections();
}

function updateCharacterDirections() {
  if (character1Pos.left < botPos.left) {
    character1.classList.add("right");
    character1.classList.remove("left");
  } else {
    character1.classList.add("left");
    character1.classList.remove("right");
  }

  if (botPos.left < character1Pos.left) {
    bot.classList.add("right");
    bot.classList.remove("left");
  } else {
    bot.classList.add("left");
    bot.classList.remove("right");
  }
}

function updatePositions() {
  character1.style.left = character1Pos.left + "px";
  character1.style.bottom = character1Pos.bottom + "px";

  bot.style.left = botPos.left + "px";
  bot.style.bottom = botPos.bottom + "px";

  if (shield1) {
    shield1.style.left = character1Pos.left - 20 + "px";
    shield1.style.bottom = character1Pos.bottom + 20 + "px";
  }

  if (shield2) {
    shield2.style.left = botPos.left - 20 + "px";
    shield2.style.bottom = botPos.bottom + 20 + "px";
  }
}

function applyGravity(characterPos) {
  if (characterPos.isJumping) {
    characterPos.velocityY -= gravity;
    characterPos.bottom += characterPos.velocityY;
    if (characterPos.bottom <= 0) {
      characterPos.bottom = 0;
      characterPos.isJumping = false;
      characterPos.velocityY = 0;
      characterPos.jumpCount = 0;
    }
  }
}

function render() {
  document
    .querySelectorAll(".fireball")
    .forEach((fireball) => fireball.remove());

  fireballs.forEach((fireball) => {
    const fireballElement = document.createElement("div");
    fireballElement.classList.add("fireball");
    fireballElement.style.left = fireball.left + "px";
    fireballElement.style.bottom = fireball.bottom + "px";
    fireballElement.style.backgroundColor = fireball.color;
    gameArea.appendChild(fireballElement);
  });
}

function updateBotMovement() {
  if (Math.random() < 0.5) {
    botPos.left += moveSpeed;
  } else {
    botPos.left -= moveSpeed;
  }

  botPos.left = Math.max(0, Math.min(750, botPos.left));
}

function healBot() {
  botPos.health = Math.min(5, botPos.health + 1);
  updateLifeBars();
}

function updateBotBehavior() {
  const distanceToPlayer = Math.abs(botPos.left - character1Pos.left);
  const isCloseToPlayer = distanceToPlayer < 100;
  const isFarFromPlayer = distanceToPlayer > 300;

  if (Math.random() < 0.05 && !botPos.isJumping) {
    if (botPos.jumpCount < 2) {
      botPos.isJumping = true;
      botPos.velocityY = jumpHeight;
      botPos.jumpCount++;
    }
  }

  if (isCloseToPlayer) {
    if (Math.random() < 0.5) {
      shootFireball(botPos, character1Pos, "bot");
      shootSingleFireball(botPos, character1Pos, "bot");
    }

    if (Math.random() < 0.1) {
      activateBlock(botPos);
    }
  }

  if (Math.random() < 0.2) {
    shootFireball(botPos, character1Pos, "bot");
    shootSingleFireball(botPos, character1Pos, "bot");
  }

  if (isFarFromPlayer) {
    if (Math.random() < 0.1) {
      if (character1Pos.left > botPos.left) {
        botPos.left += moveSpeed;
      } else {
        botPos.left -= moveSpeed;
      }
    }
  }

  if (botPos.left <= 0 || botPos.left >= gameArea.offsetWidth) {
    botPos.left = Math.max(0, Math.min(gameArea.offsetWidth, botPos.left));
    if (Math.random() < 0.5) {
      botPos.left += Math.random() < 0.5 ? moveSpeed : -moveSpeed;
    }
  }

  if (Math.random() < 0.1 || isCloseToPlayer) {
    if (!botPos.isBlocking) {
      activateBlock(botPos);
    }
  }

  if (botPos.health < 2) {
    if (Math.random() < 0.1) {
      healBot();
    }
  }

  if (isCloseToPlayer && Math.random() < 0.05) {
    botPos.left += (Math.random() < 0.5 ? -1 : 1) * moveSpeed;
  }
}

function clearNameList() {
  playerNamefield = [];
  alert("The list of names has been cleared.");
}

function saveName() {
  playerName = nameTextInput.value.trim();

  if (playerName) {
    let existingPlayer = playerNamefield.find(
      (player) => player.name === playerName
    );

    if (!existingPlayer) {
      playerNamefield.push({ name: playerName, wins: 0 });
      nameTextInput.value = "";
      playerNameMenu.classList.add("hidden");
      startMenu.classList.remove("hidden");
    }
  } else {
    alert("Please enter a name before starting!");
  }
}

function findPlayer(name) {
  return playerNamefield.find((player) => player.name === name);
}

function incrementWin(playerName) {
  let player = findPlayer(playerName);
  if (player) {
    player.wins += 1;
  } else {
    playerNamefield.push({ name: playerName, wins: 1 });
  }
  saveHighscores();
}

function showHighscore() {
  HighscoreScreen.classList.remove("hidden");
  startMenu.classList.add("hidden");
  updateHighscore();
}

function saveHighscores() {
  localStorage.setItem("highscores", JSON.stringify(playerNamefield));
}

function updateHighscore() {

  highscoreList.innerHTML = "";

  playerNamefield.sort((a, b) => b.wins - a.wins);

  if (playerNamefield.length) {
    playerNamefield.forEach((player, index) => {
      let listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${player.name} - ${
        player.wins
      } wins`;
      highscoreList.appendChild(listItem);
    });
  } else {
    let listItem = document.createElement("li");
    listItem.textContent = "No high scores yet.";
    highscoreList.appendChild(listItem);
  }
  saveHighscores();
}

function loadHighscores() {
  const savedHighscores = localStorage.getItem("highscores");
  if (savedHighscores) {
    playerNamefield = JSON.parse(savedHighscores);
  }
}

startButtonName.addEventListener("click", function () {
  saveName();
  showStartMenu();
});

startButton.addEventListener("click", function () {
  startGame();
});

highscoreButton.addEventListener("click", showHighscore);

controlsButton.addEventListener("click", showControls);

backButton1.addEventListener("click", function () {
  console.log("Back button clicked");
  showStartMenu();
});

backButton2.addEventListener("click", function () {
  console.log("Back button clicked");
  showStartMenu();
});

resumeButton.addEventListener("click", resumeGame);

mainMenuButton.addEventListener("click", function () {
  showStartMenu();
});

mainMenuButtonrestart.addEventListener("click", function () {
  showStartMenu();
});

restartButton.addEventListener("click", startGame);

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

document.addEventListener("DOMContentLoaded", function () {
  initializeGame();
});