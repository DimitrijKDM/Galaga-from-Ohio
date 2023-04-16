let KEY_SPACE = false; // 32
let KEY_LEFT = false; // 37
let KEY_RIGHT = false; // 39
let MAX_SPEED = 3;
let ACCELERATION = 0.25;

let canvas;
let ctx;
let gameOverImg = new Image();
let worldWidth;
let worldHeight;
let xSpeed = 0;
let collisionHappened = false;
let delayBetweenShots = 50;
let currentDelayBetweenShots = 0;
let soundStart = new Audio("../assets/audio/lets get this party started.wav")
let soundShoot = new Audio("../assets/audio/pew.wav")
let soundExplosionInvader = new Audio("../assets/audio/explosion1.wav")
let soundExplosionShip = new Audio("../assets/audio/boom.m4a")

let rocket = {
    x: 325,
    y: 350,
    width: 55,
    height: 55,
    src: "../assets/img/rocket2.png"
}

let invaders = [];
let shots = [];

document.addEventListener('DOMContentLoaded', function() {
  let canvas = document.getElementById('canvas');
  worldWidth = canvas.width;
  worldHeight = canvas.height;
});

function prepareGame() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    backgroundImage = new Image();
    backgroundImage.onload = function() {
        // Calculate the aspect ratios of the image and the canvas
        var imageAspectRatio = backgroundImage.width / backgroundImage.height;
        var canvasAspectRatio = canvas.width / canvas.height;

        // Determine which dimension to use for scaling and scale the other dimension accordingly
        var scaleFactor;
        if (imageAspectRatio >= canvasAspectRatio) {
            // Image is wider than the canvas
            scaleFactor = canvas.width / backgroundImage.width;
        } else {
            // Image is taller than the canvas
            scaleFactor = canvas.height / backgroundImage.height;
        }
        var scaledWidth = backgroundImage.width * scaleFactor;
        var scaledHeight = backgroundImage.height * scaleFactor;

        // Determine the coordinates to center the image on the canvas
        var x = canvas.width / 2 - scaledWidth / 2;
        var y = canvas.height / 2 - scaledHeight / 2;

        // Draw the scaled image onto the canvas with any excess image area cropped off
        ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, x, y, scaledWidth, scaledHeight);
    };
    backgroundImage.src = "../assets/img/start_game.png";
}

document.addEventListener('click', playGame);
function playGame() {
    startGame();

    soundStart.volume = 0.2;
    soundStart.play();

    var bgMusic = new Audio('../assets/audio/ducktales moon theme.mp3');
    bgMusic.play();
    bgMusic.loop = true;
    bgMusic.volume = 0.2;
    document.removeEventListener('click', playGame);
}


document.onkeydown = function(e) {
    if (e.keyCode == 32) { // Leertaste gedrückt
        KEY_SPACE = true;
    }

    if (e.keyCode == 37) { // Nach oben gedrückt
        KEY_LEFT = true;
    }

    if (e.keyCode == 39) { // Nach unten gedrückt
        KEY_RIGHT = true;
    }
}


document.onkeyup = function(e) {
    if (e.keyCode == 32) { // Leertaste losgelassen
        KEY_SPACE = false;
    }

    if (e.keyCode == 37) { // Nach oben losgelassen
        KEY_LEFT = false;
    }

    if (e.keyCode == 39) { // Nach unten losgelassen
        KEY_RIGHT = false;
    }
}


function startGame(){
    loadImages();
    setInterval(update, 1000 / 144);
    setInterval(createInvaders, 3000);
    setInterval(checkCollision, 1000 / 144);
    setInterval(CollisionHappened, 1000 / 144);
    setInterval(checkForShot, 1000 / 144);
    draw();
}

function CollisionHappened(){
    if (!collisionHappened) {
        ctx.drawImage(gameOverImg, 0, 0);
    }
}

// todo: Display Game Over Image when Collision happened

function checkCollision() {
    invaders.forEach(function(invader) {
        if (hitTest(rocket, invader)) {
            collisionHappened = true;
            rocket.img.src = "../assets/img/boom.PNG";
            setTimeout(function() {
                rocket.img.src = "../assets/img/boom2.PNG";
                setTimeout(function() {
                     rocket.img.src = "../assets/img/boom3.PNG";
                     setTimeout(function(){
                        rocket.img.src = "../assets/img/boom4.PNG";
                    }, 250);
                }, 250);
            }, 250);
            console.log("Collision!!!");
            invaders = invaders.filter(u => u != invader);
            setTimeout(function(){
                collisionHappened = false;
                location.reload();
            }, 1000);

            soundExplosionShip.pause();
            soundExplosionShip.currentTime = 0.25;
            soundExplosionShip.play();
        }
        shots.forEach(function(shot){
            if (!invader.hit && hitTest(shot, invader)) {
                invader.hit = true;
                invader.img.src = 'img/boom.png';
                console.log('Collison!!!');

                setTimeout(() => {
                    invaders = invader.filter(u => u != invader);
                }, 2000);

                soundExplosionInvader.pause();
                soundExplosionInvader.currentTime = 0;
                soundExplosionInvader.play();
            }
        });
    });
}

function createInvaders(){
    let invader = {
        x: Math.random() * 500,
        y: -50,
        width: 60,
        height: 60,
        src: "../assets/img/invader.png",
        img: new Image()
    }
    invader.img.src = invader.src;
    invaders.push(invader);
}

function checkForShot(){
    if (!collisionHappened && currentDelayBetweenShots <= 0) {
        if (KEY_SPACE) {
            let shot = {
                x: rocket.x + rocket.width / 2,
                y: rocket.y - 20,
                width: 10,
                height: 100,
                src: "../assets/img/shot.png",
                img: new Image()
            };
            shot.img.src = shot.src;
            shots.push(shot);

            soundShoot.volume = 0.2;
            soundShoot.pause();
            soundShoot.currentTime = 0;
            soundShoot.play();

            currentDelayBetweenShots = delayBetweenShots;
        }
    }
}

function hitTest(object1, object2) {
  // Calculate the coordinates of the edges of each object
  const obj1Left = object1.x;
  const obj1Right = object1.x + object1.width;
  const obj1Top = object1.y;
  const obj1Bottom = object1.y + object1.height;
  const obj2Left = object2.x;
  const obj2Right = object2.x + object2.width;
  const obj2Top = object2.y;
  const obj2Bottom = object2.y + object2.height;

  // Check if the objects overlap on both axes
  return obj1Left < obj2Right && obj1Right > obj2Left && obj1Top < obj2Bottom && obj1Bottom > obj2Top;
}


function update() {
    if (!collisionHappened) {
        if (KEY_LEFT || KEY_RIGHT) {
            xSpeed = Math.min(xSpeed + ACCELERATION, MAX_SPEED);
        } else {
            xSpeed = Math.max(xSpeed - ACCELERATION, 0);
        }

        if (KEY_LEFT) {
            rocket.x -= xSpeed;
            if (rocket.x < 0) {
                rocket.x = 0;
            }
        }

        if (KEY_RIGHT) {
            rocket.x += xSpeed;
            if (rocket.x > worldWidth - rocket.width) {
                rocket.x = worldWidth - rocket.width;
            }
        }
    }

    invaders.forEach(function(invader){
        if (!invader.hit) {
            invader.y += 2;
        }
    });

    shots.forEach(function(shot){
        shot.y -= 15;
    });

    if (currentDelayBetweenShots > 0) {
        currentDelayBetweenShots--;
    }
}

function loadImages(){
    backgroundImage.src = "../assets/img/space.png"
    rocket.img = new Image();
    rocket.img.src = rocket.src;
    gameOverImg.src = "../assets/img/game over.png"
}

function draw() {
    ctx.drawImage(backgroundImage, 0, 0);
    ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);
    invaders.forEach(function(invader) {
        ctx.drawImage(invader.img, invader.x, invader.y, invader.width, invader.height);
    });
    requestAnimationFrame(draw)
    shots.forEach(function(shot){
        ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
    });
}