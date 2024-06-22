import kaboom from "kaboom"
import "kaboom/global"

document.title='Coder, Coffee and Bugs'

// initialize context
kaboom({
  font: "sink",
  background: [210, 210, 155,]
})

// load sprites
loadSprite("bug", "sprites/bug.png")
loadSprite("coffee", "sprites/coffeeMug.png")
loadSprite("player", "sprites/player.png")
loadSprite("background","sprites/backgroundImage.jpg")

// load music
loadSound("score", "sounds/score.mp3")
loadSound("game over", "sounds/game over.mp3")
loadSound("background", "sounds/background.mp3")
loadSound("sip", "sounds/sip.mp3")

// define game variables
let SPEED = 620;
let BSPEED = 2; // bugs speed
let SCORE = 0;
let HIGH_SCORE = 0;
let backgroundMusic;
let scoreText;
let highScoreText;
let player;
let gameOverText;


// load high score from local storage
  if (localStorage.getItem("highScore")) {
    HIGH_SCORE = parseInt(localStorage.getItem("highScoreText") || "0", 10);
  }


// display score
const displayScore = () => {
  if (scoreText) {
    destroy(scoreText);
  }
  // score counter
  scoreText = add([
    text("SCORE: " + SCORE,{
      font:"sans"
    }),
    scale(1),
    pos(width() - 181, 48),
    color(10, 10, 255)
  ]);
}

// display high score
const displayHighScore = () => {
  if (highScoreText) {
    destroy(highScoreText);
  }
  highScoreText = add([
    text("HIGH SCORE: " + HIGH_SCORE,{
      font:"serif"
    }),
    scale(1),
    pos(width() - 270, 21),
    color(10, 10, 255)
  ]);
}
// function to play background music
const playBg = () => {
  if (!backgroundMusic) {
    backgroundMusic = play("background", {
      volume: 0.5,
      loop: true
    });
  }
}

// Reset function
const resetGame=()=>{
  // update high score if current score is higher
  if(SCORE > HIGH_SCORE){
    HIGH_SCORE=SCORE;
    localStorage.setItem("highscore", HIGH_SCORE.toString());
  }
  // reset game variables
  SCORE = 0;
  BSPEED=2;

  // destroy all existing game elements
  destroyAll("bug");
  destroyAll("coffee");
  
  // recreate player
  if(player){
    destroy(player);
  }
  
  player = add([
    sprite("player"),  // renders as a sprite
    pos(120, 80),    // position in world
    area(),          // has a collider
    scale(0.13)
  ]);

  if(gameOverText){
    destroy(gameOverText);
  }
  // Display initial score and high score
  displayScore();
  displayHighScore();  

  // re register collision handlers after reset
  registerCollisionHandlers();
};

// add backgound image
add([
  sprite("background", {width:width(),height:height()}),
  pos(0,0),
  z(-1)
])

// Add player
player = add([
  sprite("player"),  // renders as a sprite
  pos(120, 80),    // position in world
  area(),          // has a collider
  scale(0.13),
])

// Add events to player
onKeyDown("left", () => {
  playBg()
  player.move(-SPEED, 0)
})

onKeyDown("right", () => {
  playBg()
  player.move(SPEED, 0)
})

onKeyDown("up", () => {
  playBg()
  player.move(0, -SPEED)
})

onKeyDown("down", () => {
  playBg()
  player.move(0, SPEED)
})


// function to continuously spawn bugs and coffee
const spawnObejcts=() => {
  for (let i = 0; i < 4; i++) {
    let x = rand(0, width());
    let y = height()

    let bug = add([
      sprite("bug"),  // renders as a sprite
      pos(x, y),    // position in world
      area(),          // has a collider
      scale(0.13),          // responds to physics and gravity
      "bug" // tag for rendering collision
    ])
    bug.onUpdate(() => {
      bug.moveTo(bug.pos.x, bug.pos.y - BSPEED)
    })
  }

  // coffee
  let x = rand(0, width());
  let y = height()

  let coffee = add([
    sprite("coffee"),  // renders as a sprite
    pos(x, y),    // position in world
    area(),          // has a collider
    scale(0.30),          // responds to physics and gravity
    "coffee" // tag for rendering collision
  ])
  coffee.onUpdate(() => {
    coffee.moveTo(coffee.pos.x, coffee.pos.y - BSPEED)
  })
  if (BSPEED < 13) {
    BSPEED += 1;
  }
  
};


// player collision with bug
const registerCollisionHandlers = ()=>{
  player.onCollide("bug", () => {
    if (backgroundMusic) {
      backgroundMusic.stop()
    }
    play("game over")
    addKaboom(player.pos);
    // diplay game over text
    gameOverText=add([
      text("Game Over",{
        font:"serif"
      }),
      scale(3),
      pos(10,21),
      color(10,10,255)
    ]);
    // reset game after short delay
    wait(2,()=>{
      resetGame();
      if(backgroundMusic){  // change
        backgroundMusic.play()
      }
    });
  });
  player.onCollide("coffee", (coffee) => {
  
    play("sip", {
      volume: 3
    })
    destroy(coffee);
    SCORE += 1
  
    displayScore();
  
  
  });
}

// continuosuly spawn objects
const spawnLoop=()=>{
  loop(4,()=>{
    spawnObejcts();
  });
};


// initialise function to set up game
displayScore();
displayHighScore();
spawnLoop();
registerCollisionHandlers();