import kaboom from "kaboom"
import "kaboom/global"

// initialize context
kaboom({
  font: "sink",
  background: [210, 210, 155,]
})

// load sprites
loadSprite("bug", "sprites/bug.png")
loadSprite("coffee", "sprites/coffeeMug.png")
loadSprite("player", "sprites/player.png")

// load music
loadSound("score", "sounds/score.mp3")
loadSound("game over", "sounds/game over.mp3")
loadSound("background", "sounds/background.mp3")
loadSound("sip", "sounds/sip.mp3")

// define game variables
let SPEED = 620;
let BSPEED = 2; // bugs speed
let SCORE =0;
let scoreText;
let bg=false;
let backgroundMusic;

// display score
const displayScore=()=>{
  if(scoreText){
    destroy(scoreText) ;
  }
  // score counter
  scoreText = add([
    text("SCORE: "+ SCORE),
    scale(1),
    pos(width()-181,21),
    color(10,10,255)
    ]);
}

// function to play music
const playBg=()=>{
  if(!backgroundMusic){
    backgroundMusic = play("background",{
      volume:0.5,
      loop: true 
    });
  }
}
// Add player
const player = add([
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


// Add 4 Bugs and Coffee on loop
setInterval(() => {
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
  if(BSPEED <13){
    BSPEED +=1;
  }
}, 4000)

player.onCollide("bug", () => {
  if(backgroundMusic){
    backgroundMusic.stop()
  }
  // backgroundMusic.volume(0.2) // 
  play("game over")
  destroy(player)
  addKaboom(player.pos)
  scoreText = add([
      text("Game Over"),
      scale(3),
      pos(10, 21),
      color(10, 10, 255)
  ])
})
  
player.onCollide("coffee",(coffee)=>{

  play("sip",{
    volume:2
  })
  destroy(coffee);
  SCORE +=1

  displayScore()
  
  
});

 // Display Score
displayScore();