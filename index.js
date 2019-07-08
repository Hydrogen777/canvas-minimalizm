var canvas;
var ctx;
var FPS = 60;
var startText = "Hello SLAVYANE!!!";
var victorytText = "!";

var cubeSpeedX = 3;
var cubeSpeedY = 5;

var scoreTextStyle = "white";
var showingWinScreen = false;
const WINNING_SCORE = 2;

const EARTH_ALTITUDE = 720 - 100;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var img = new Image();
var tamamoImage = new Image();
tamamoImage.src = 'F:/NodeJS/canvas-minimalizm/images/tamamoE.png';
var tamamoImageProperty = {
    width: 96,
    height: 96,
    frames: 3,
    currentFrame: 0
}

var gameTime = 0;
var start = Date.now();
var perfNow = performance.now();
var times = 0;

var gravity = false;

var cube = {
    X: 0,
    Y: 500,
    W: 60,
    H: 30
}


var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

function cubeMove() {
    var internalTimer = 0;
    cube.Y = cube.Y - 2;
    if(internalTimer++ < 200) {
        requestAnimationFrame(cubeMove);
    }
}

function drawSprite() {
    //setTimeout(function() {
        requestAnimationFrame(drawSprite);
        //ctx.clearRect(365, 40, 96, 96);
        ctx.drawImage(tamamoImage, 365, 40, tamamoImageProperty.width * tamamoImageProperty.currentFrame, tamamoImageProperty.height, 365, 40, 
        tamamoImageProperty.width, tamamoImageProperty.height);

        if (tamamoImageProperty.currentFrame == tamamoImageProperty.frames) {
            tamamoImageProperty.currentFrame = 0;
        } else {
            tamamoImageProperty.currentFrame++;
        }
    //}, 1000);
    console.log("");
}

function handleInput() {
    if(input.isDown("UP") || input.isDown("w")) {
        if(cube.Y != 0) {
            cube.Y -= 10;
        }
    }

    if(input.isDown("RIGHT") || input.isDown("d")) {
        if(cube.X != 1280 - cube.W) {
            cube.X += 3;
        }
    }

    if(input.isDown("LEFT") || input.isDown("a")) {
        if(cube.X != 0) {
            cube.X -= 3;
        }
        
    }
}

// ------------------- MAIN ---------------------
window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;
    
    setInterval(function() {
        moveEverything();
        drawEverything();
        handleInput();
    }, 1000/FPS);

    canvas.addEventListener("mousedown", mouseClickToContinue);
    drawSprite();
    // Обработка столкновений
}

function mouseClickToContinue(evt) {
    if(showingWinScreen) {
        leftPlayerScore = 0;
        rightPlayerScore = 0;
        showingWinScreen = false;
    }
}

function moveEverything() {
    //main cube condition
    if(cube.Y < canvas.height - 100 - cube.H) {
        cube.Y = cube.Y + cubeSpeedY;
        gravity = true;
        console.log(gravity);
    }

    // пробное столкновение
    if(cube.X > 85 - cube.W) {
        // cube.Y = cubeY + cubeSpeedY;
        cube.X = cube.X - cubeSpeedX;
        if(cube.Y == (EARTH_ALTITUDE - 35 - cube.H)) {
            cube.Y = EARTH_ALTITUDE - 35 - cube.H - 25;
            cube.X = cube.X + cubeSpeedX;
        }
    }
}

function drawEverything() {
    //!!!black field
    colorRect(0, 0, canvas.width, canvas.height, "black");

    // images
    img.src = 'F:/NodeJS/canvas-minimalizm/images/aliceGH_st01.png';
    //ctx.drawImage(img, 365, 40, 500, 350);

    //tamamoImage.src = 'F:/NodeJS/canvas-minimalizm/images/tamamoE.png';
    //ctx.drawImage(tamamoImage, 365, 40, 386, 96);

    //win screen to continue
    if(showingWinScreen) {
        ctx.fillStyle = "red";
        ctx.font = "28px consolas";
        if(rightPlayerScore >= WINNING_SCORE) {
            ctx.fillText("Right player win!", 480, 600);
        } else if(leftPlayerScore >= WINNING_SCORE) {
            ctx.fillText("Left player win!", 480, 600);
        }

        ctx.fillStyle = "white";
        ctx.font = "48px consolas";
        ctx.fillText("Click to continue", 150, 150);
        return;
    }

    //!!!earth
    colorRect(0, EARTH_ALTITUDE, canvas.width, 25, "gray");

    //!!!obstacles
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.fillRect(85, EARTH_ALTITUDE - 35, 15, 35);
    ctx.strokeRect(85, EARTH_ALTITUDE - 35, 15, 35);

    //!!!cube
    ctx.setLineDash([2]);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.fillRect(cube.X, cube.Y, cube.W, cube.H);
    ctx.strokeRect(cube.X, cube.Y, cube.W, cube.H);
    ctx.strokeStyle = scoreTextStyle;

    if(gravity) {
        ctx.font = "22px consolas";
        startText = "Gravity is now TRUE";
        ctx.fillText(startText, (canvas.width / 2) - 150, 20);
    } else {
        ctx.font = "22px consolas";
        startText = "Gravity is now FALSE";
        ctx.fillText(startText, (canvas.width / 2) - 150, 20);
    }

}

// круг с центром в точке (x,y) радиусом r начиная с угла startAngle в направлении по часовой(или против) antiClockWise
function colorCircle(centerX, centerY, radius, startAngle, endAngle, antiClockWise, drawColor) {
    ctx.beginPath();
    ctx.fillStyle = drawColor;
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, antiClockWise);
    ctx.fill();
    ctx.closePath();
}

function colorRect(leftX, topY, width, height, drawColor) {
    ctx.fillStyle = drawColor;
    ctx.fillRect(leftX, topY, width, height);
}
