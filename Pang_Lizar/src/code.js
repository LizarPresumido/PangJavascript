
var canvas;
var ctx;

var targetDeltaTime = 1 / 60;
var currentDeltaTime = 0;
var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0,
    maxTime = 30,
    lastSec = 0,
    puntuacion = 0,
    tiempo = 0;
var timeSinceBegining = 0;
var lvlNumber = 1;

const VIDAS_MAX = 3;


var balls = [];
var shoots = [];
var ballNumber;

var inGame = false;
var code;

var vidas;
var vidasImg;
var myImg;
var backSong;
var hitSound;
var tick;
var loseSound;

var myData;

window.requestAnimationFrame = (function (evt) {
    return window.requestAnimationFrame ||
    	window.mozRequestAnimationFrame    ||
    	window.webkitRequestAnimationFrame ||
    	window.msRequestAnimationFrame     ||
    	function (callback) {
        	window.setTimeout(callback, targetDeltaTime * 1000);
    	};
}) ();

window.onload = BodyLoaded;


function BodyLoaded()
{
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

   img = new Image(canvas.width,canvas.height - 70);
   img.src = "img/fondo1.png";
    img.Draw = function(ctx) {
        ctx.drawImage(img, 0, 70);
    };

    //InitializeBricks(canvas);


    SetupKeyboardEvents();
    SetupMouseEvents();

    Start();
    Loop();
}

function Start()
{
    myData = JSON.parse(data);
    backSong = new Audio("sound/Super_Pang_Arcade_OST_-_Stage_810__Himarayas.mp3");
    hitSound = new Audio("sound/hit.wav");
    tick = new Audio("sound/tick.wav");
    loseSound = new Audio("sound/lose.flac");
    time  = Date.now();
    tiempo = maxTime;
    vidas = VIDAS_MAX;
    vidasImg = new Image();
    vidasImg.src = "img/vidas.png";
    ballNumber = 0;
    player.Start();
    
}

function Loop ()
{
    // prepare the next loop
    requestAnimationFrame(Loop);

    //deltaTime
    const now = Date.now();
    let deltaTime = (now - time) / 1000;
    currentDeltaTime = deltaTime;
    
    time = now;

    // frames counter
    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1;
    }
    
    if (deltaTime > 100)
        deltaTime = 100;

    if(inGame){
        // Game logic -------------------
        Update(deltaTime);
    }
        // Draw the game ----------------
        Draw(ctx);
    if(lastSec == 0 && inGame)
        Deactivate(0);
    if(ballNumber == 0 && inGame)
        Deactivate(2);

    Input.PostUpdate();
}

function Update(deltaTime)
{
    console.log(ballNumber);
    timeSinceBegining += deltaTime;
    tiempo -= deltaTime;

    if(lastSec != Math.trunc(tiempo)+1){
        lastSec = Math.trunc(tiempo)+1;
        if(lastSec <= 20){
            tick.volume = 0.30;
            tick.play();
        }
        
    }

    player.Update(deltaTime);

    shoots.forEach(shoot => {
        if(shoot != null)
            shoot.Update(deltaTime);
    });
    balls.forEach(ball => {
        if(ball != null){
            ball.Update(deltaTime);
            ball.Collision();
        }
    });

    
}

function Draw(ctx)
{
    if(!inGame){
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0,70,798,480);
        ctx.globalAlpha = 1;
        if(code == 0){
            ctx.fillStyle = "orange";
            ctx.font = "55px pangTypo";
            ctx.fillText("Time's UP!!!", canvas.width / 4, 310);
        }else if(code == 1){
            ctx.fillStyle = "orange";
            ctx.font = "25px pangTypo";
            ctx.fillText("Sorry!!! You lost all your lifes", 100, 280);
        }else{
            ctx.fillStyle = "orange";
            ctx.font = "25px pangTypo";
            ctx.fillText("Congratulations!!! You beated the level", 10, 280);
        }
    }else{
    // background
    img.Draw(ctx);

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,800,70);
    
    player.Draw(ctx);
    shoots.forEach(shoot => {
        if(shoot != null)
            shoot.Draw(ctx);
    });
    balls.forEach(ball => {
        if(ball != null)
            ball.Draw(ctx);
    });
}
 
    
    if(lastSec <= 20)
        ctx.fillStyle = "red";
    else
        ctx.fillStyle = "yellow";
    ctx.font = "45px pangTypo";
    
    ctx.fillText("TIME: " + (Math.trunc(tiempo)+1), 440, 53);
    ctx.fillStyle = "yellow";
    ctx.font = "25px pangTypo";
    ctx.fillText("Lifes",20,25);
    ctx.fillText("Points", 250,25);
    ctx.fillText(puntuacion, 260, 60);
    for(let i = 0;i < vidas; i++){
        ctx.drawImage(vidasImg, 0,0,20,30,20 + 30 * i,35,25,35);
    }

}

function Restart(){
    
    vidas = VIDAS_MAX;
    puntuacion = 0;
    inGame = true;
    canvas.style.display = "block";
    tiempo = maxTime;
    balls = [];
    shoots = [];
    ballNumber = 0;
    myData.forEach(ball =>{
        balls[balls.length + 1] = new Ball(ball.position,ball.type,balls.length + 1, ball.direction);
        ballNumber++;
    });
    
    document.getElementById("startButton").style.display = "none";
}

function StartGame(){
    Restart();
    backSong.loop = true;
    backSong.volume = 0.3;
    backSong.play();
}

function Hit(){
    vidas--;
    hitSound.play();
}

 function Deactivate(codeNum){
        inGame = false;
        code = codeNum;
        if(code == 2)
        puntuacion += 150 * (Math.trunc(tiempo) + 1)
        backSong.pause();
        loseSound.volume = 0.5;
        loseSound.play();
        //canvas.style.display = "none";
        document.getElementById("startButton").style.display = "block";
 }


