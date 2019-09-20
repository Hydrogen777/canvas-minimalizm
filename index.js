var canvas;
var ctx;
var FPS = 60;
var startText = "PLAY";
var victorytText = "Completed";
var loseText = "You died D:";

var cubeSpeedX = 3;
var cubeSpeedY = 5;

var scoreTextStyle = "white";
var showingWinScreen = false;
const WINNING_SCORE = 2;

const EARTH_ALTITUDE = 720 - 100;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var img = new Image();
var coinImage = new Image();
//tamamoImage.src = 'F:/NodeJS/canvas-minimalizm/images/tamamoE.png';
coinImage.src = 'http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/downloads/sprite-animation-demo/images/coin-sprite-animation.png';
var coinWidth = 0;
var tick_count = 0;

var gameTime = 0;
var start = Date.now();
// возвращает временную метку в мс
var perfNow = performance.now();
var times = 0;

var inter;
var gravity = false;
var isGameOver;

var cube = {
    X: 0,
    Y: 500,
    W: 60,
    H: 30
}

var mouseX,
    mouseY;

var timer = 0;
var intermediateTimer = 0;
var lastTime;
//-------------------------------------------------- LOOP START -----------------------------------------------------//
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

function clickCoin() {
    canvas.addEventListener("click", function(e) {
        if((mouseX > 0 && mouseX < 100) && (mouseY > 0 && mouseY < 100)) {
            coinImage.src = "";
            isGameOver = true;
        }
    });
}



function mouseListen() {
    canvas.addEventListener('mouseup', function (e) {
        mouseX = e.pageX - e.target.offsetLeft,
        mouseY = e.pageY - e.target.offsetTop;
    });
}

// отрисовка спрайта
function tick() {
    if(tick_count > 24){
        drawSprite();
        tick_count = 0;
    }
    tick_count++;
    //tick();
    requestAnimationFrame(tick);
}

function drawSprite() {
    //ctx.clearRect(0, 0, 100, 100);
    //ctx.colorRect(0, 0, 100, 100, "black");
    if(coinWidth === 900){
        coinWidth = 0;
    } else {
        coinWidth = coinWidth + 100;
    }

    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    // монета
    ctx.drawImage(coinImage, coinWidth, 0, 100, 100, 0, 0, 100, 100);
    // kitsune
    //ctx.drawImage(tamamoImage, widthTamamo, 0, 96, 96, 0, 0, 96, 96);
}

//------------------------------------------------ GAME LOGIC -----------------------------------------------------//

window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;
    
    // setInterval(function() {
    //     moveEverything();
    //     drawEverything();
    //     handleInput();
    //     //intermediateTimer = Math.round(timer / 100);
    //     timer++;
    //     //console.log(timer / 100);
    //     //console.log(intermediateTimer);
    //     drawSprite();
    //     mouseListen();
    //     clickCoin();
    // }, 1000/FPS);


    // Более совершенный подход в отображении сцены игры.
    function main() {
        // получаем дату в виде миллисекунд
        var now = Date.now();
        // разница между текущим временем и временем последнего обновления(изначально lasttime = 0, делим на 1000 чтобы получить секунды)
        var dt = (now - lastTime) / 1000.0;
        
        // обновляем и отображаем сцены
        update(dt);
        moveEverything();
        drawEverything();
        handleInput();
        drawSprite();
        clickCoin();
        mouseListen();
        gg();
        lastTime = now;
        // постановка в очередь следующего цикла
        requestAnimationFrame(main);
    };

    main();
    
}

function init() {

    document.getElementById("replay").addEventListener("click", function() {
        reset();
    });

    reset();
    lastTime = Date.now();
    //main();
}

function gg() {
    if(isGameOver == true){
        gameOver();
    }
}

// Обновление состояния объектов игры
function update(dt) {
    gameTime += dt;
    handleInput(dt);
}

function moveEverything() {
    //main cube condition
    if(cube.Y < canvas.height - 100 - cube.H) {
        cube.Y = cube.Y + cubeSpeedY;
        gravity = true;
    }

    // пробное столкновение
    if(cube.X > 85 - cube.W) {
        // cube.Y = cubeY + cubeSpeedY;
        cube.X = cube.X - cubeSpeedX;
    }

    document.getElementById("replay").onclick = function() {
        reset();
    }
    // if(document.getElementById("replay").clicked = true) {
    //     reset();
    // }
}

function gameOver() {
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-over").style.zIndex = "10";
    canvas.width = 0;
    isGameOver = true;
}

function reset() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-over").style.zIndex = "1";
    canvas.width = 1280;
    isGameOver = false;
    gameTime = 0;
    inter = false;
}

function drawEverything() {
    let drawCount = 0;
    //!!!black field
    colorRect(0, 0, canvas.width, canvas.height, "black");

    //img.src = 'F:/NodeJS/canvas-minimalizm/images/aliceGH_st01.png';
    //ctx.drawImage(img, 365, 40, 500, 350);

    //tamamoImage.src = 'F:/NodeJS/canvas-minimalizm/images/tamamoE.png';
    //ctx.drawImage(tamamoImage, 365, 40, 386, 96);
    //tick();

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
