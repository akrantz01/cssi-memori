// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, AUTO, collideCircleCircle, collideRectCircle, text,
          mouseX, mouseY, textWidth, createSelect, strokeWeight, line, mouseIsPressed, noLoop, loop, redraw, windowWidth, windowHeight, noStroke,
          keyCode, soundFormats, textFont, loadSound, noFill,loadFont, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, frameRate, displayNum, createInput, createButton */

let backgroundColor, digitSize, speed, numberDisplay, numSize, testOne, num, sum, input, button, start, home;
let selDigits, selSpeed, selNumbers;
let problem, answer;
let gameIsStarted, endButton, displayIsTrue;
let currentPage, end, lastRandom;
let myValue, digitText, homeImage, homeImage2, abacus, mySound, title;
let openSans, roboto, buttonColor;

// Remove console.logs
console.log = () => {};

// Ensure the user is logged in before continuing
checkUserLoggedIn();

function preload() {
    //soundFormats('mp3', 'ogg');
    openSans = loadFont("/assets/fonts/OpenSans-SemiBold.ttf");
    roboto = loadFont("/assets/fonts/Roboto-Regular.ttf");
    mySound = loadSound('/assets/audio/drum-roll.mp3');

    homeImage = loadImage("/assets/img/numbers-side.png");
    homeImage2 = loadImage("/assets/img/numbers-side.png");
    abacus = loadImage("/assets/img/abacus.png");
}
function setup() {
    // Canvas & color settings
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    backgroundColor = color(343, 85, 48);
    buttonColor = color(340, 6, 100);
    numberDisplay = 0;
    start = createButton('Start Game');
    start.position(width * 0.5 - start.width/2, height * 0.7);
    start.style('font-family', `${roboto}`);
    start.style('font-size','18px');
    start.style('background-color', buttonColor);
    home = createButton("Home");
    home.position(width * 0.5 - home.width/2, height * 0.8);
    home.style('font-family', `${roboto}`);
    home.style('font-size','18px');
    home.style('background-color', buttonColor);
    home.mousePressed(() => window.location.href = "/");
    end = createButton('Retry');
    end.position(-width, -height);
    end.style('font-family', `${roboto}`);
    end.style('font-size','18px');
    end.style('background-color', buttonColor);
    gameIsStarted = false;
    displayIsTrue = false;
    currentPage = 0;
    myValue = "";
    selDigits = createSelect();
    selDigits.style('font-size','18px');
    selNumbers = createSelect();
    selNumbers.style('font-size','18px');
    selSpeed = createSelect();
    selSpeed.style('font-size','18px');
    answer = text('test', -width, -height);
    input = createInput('');
    input.size(AUTO, 30);
    button = createButton('Check Answer');
    button.size(AUTO, 32);
    button.style('font-family', `${roboto}`);
    button.style('font-size','18px');
    button.style('background-color', buttonColor);
    input.style('font-size','25px');
    for(let i = 1; i <= 6; i++){
        selDigits.option(i);
    }
    for(let j = 5; j <= 30; j+= 5){
        selNumbers.option(j);
    }
    for(let k = 0.2; k <= 0.8; k += 0.3){
        selSpeed.option(k);
    }
    for(let kTwo = 1.0; kTwo <= 3.0; kTwo += 0.5){
        selSpeed.option(kTwo);
    }
}

function draw() {
    background(backgroundColor);
    //console.log(`Current Page: ${currentPage}`);
    fill(33, 23, 100);
    rect(70, 70, width-130, height - 130);
    image(homeImage, width * 0.83, 0, homeImage.width, height);
    //image(homeImage, 0, 0, homeImage.width, height);
    for(let i = 0; i < width - 30; i += 90){
        image(abacus, i, 5, 100, 70);
    }

    textSize(60);
    stroke(0);
    strokeWeight(2);
    fill(340, 6, 100);
    textAlign(CENTER);
    textFont(openSans);
    title = text("Flash Numbers", width * 0.515, height * 0.2);
    fill(0);
    noStroke();
    if(currentPage == 0){
        homeScreen();
    }else if(currentPage == 1){
        start.position(-width, -height);
        home.position(-width, -height);
        selDigits.position(-width, -height);
        selNumbers.position(-width, -height);
        selSpeed.position(-width, -height);
    }else if(currentPage == 2){
        selDigits.position(-width, -height);
        selNumbers.position(-width, -height);
        selSpeed.position(-width, -height);
        endGame();
    }
    start.mousePressed(startCountdown);
    if(gameIsStarted && numberDisplay < numSize){
        while (num === lastRandom) {
            problem.generateNum();
        }
        problem.displayNum();
        lastRandom = num;
        console.log(`Num displayed ${numberDisplay}`);
        console.log(`Num size ${numSize}`);
    }else if(numberDisplay >= numSize){
        checkDisplay();
    }

    let score = (input.value() == sum) ? 1 : 0;
    button.mousePressed(() => Numbers.playedGame(score * 100, score * (1 + (parseInt(digitSize) / 10) + (parseInt(numSize) / 5 / 10))).then(endGame));
    if(displayIsTrue){
        input.hide();
        button.hide();
    }
    if(!gameIsStarted){
        answer = text(`Answer: ${sum}`, width * 0.52, height/2);
        if(input.value() == sum){
            fill(120, 100, 50);
            text("Correct!", width * 0.52, height * 0.57);
        }else{
            fill(348, 91, 86);
            textFont(roboto);
            text(`Your answer: ${input.value()}` , width * 0.49, height * 0.57);
        }
    }
    //console.log(`Num displayed ${numberDisplay}`);
    //console.log(`Num size ${numSize}`);
    end.mousePressed(homeScreen);
}

function startCountdown(){
    noLoop();
    textSize(15);
    mySound.play();
    setTimeout(() =>{
        redraw();
        fill(348, 91, 86);
        text("Start Countdown", width * 0.3, height * 0.3);
    }, 1000);
    setTimeout(() =>{
        redraw();
        text("3", width * 0.3, height * 0.3);
    }, 2000);
    setTimeout(() =>{
        redraw();
        text("2", width * 0.3, height * 0.3);
    }, 3000);
    setTimeout(() =>{
        redraw();
        text("1", width * 0.3, height * 0.3);
    }, 4000);
    setTimeout(() =>{
        loop();
        startGame();
    }, 5000);

}

class GeneratedNumbers{
    constructor(digitSize, numSize){
        this.digitSize = digitSize;
        this.numSize = numSize;
    }
    generateNum(){
        if(this.digitSize == 1){
            num = Math.floor(Math.random()*9)+1;
        }else if(this,digitSize == 2){
            num = Math.floor(Math.random()*90)+10;
        }else if(this.digitSize == 3){
            num = Math.floor(Math.random()*900)+100;
        }else if(this.digitSize == 4){
            num = Math.floor(Math.random()*9000)+1000;
        }else if(this.digitSize == 5){
            num = Math.floor(Math.random()*90000)+10000;
        }else if(this.digitSize == 6){
            num = Math.floor(Math.random()*900000)+100000;
        }else if(this.digitSize == 7){
            num = Math.floor(Math.random()*9000000)+1000000;
        }
    }
    displayNum(){
        console.log(num);
        if(numberDisplay < numSize){
            textSize(50);
            text(num, width * 0.5, height/2);
            sum += num;
            numberDisplay++;

        }else{
            gameIsStarted = false;
            currentPage = 2;
        }
    }
}
function checkDisplay(){
    input.show();
    button.show();
}


function homeScreen(){
    currentPage = 0;
    gameIsStarted = true;
    displayIsTrue = true;
    //answer.position(-width, -height);
    input.position(width * 0.4, height/2);
    button.position(input.x + input.width, input.y);
    home.position(width * 0.5 - home.width/2, height * 0.8);
    hideInput();
    homeFormat();
    end.position(-width, -height);
    start.position(width * 0.5 - start.width/2, height * 0.7);
    input.value(myValue);
}
function hideInput(){
    input.hide();
    button.hide();
}


function endGame(){
    currentPage = 2;
    displayIsTrue = true;
    gameIsStarted = false;
    end.position(width * 0.5, height * 0.7);
    home.position(-width, -height);
}

function homeFormat(){
    //fill(0);
    textFont(roboto);
    textAlign(CENTER, CENTER);
    selDigits.position(width * 0.6,height * 0.333);
    textSize(30);
    text("Digits per Number:", width * 0.47, height * 0.33);
    selNumbers.position(width * 0.6, height * 0.41);
    text("Numbers to Display:", width * 0.465, height * 0.41);
    selSpeed.position(width * 0.6,height * 0.48);
    text("Speed (seconds):", width * 0.475, height * 0.48);
}


function startGame(){
    currentPage = 1;
    numberDisplay = 0;
    gameIsStarted = true;
    digitSize = selDigits.value();
    speed = 1 / selSpeed.value();
    numSize = selNumbers.value();
    frameRate(speed);
    sum = 0;
    problem = new GeneratedNumbers(digitSize, numSize);
    displayIsTrue = false;
    //selDigits.position(-width, -height);

}
