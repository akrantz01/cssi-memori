// Periodic Table JSON source: https://github.com/Bowserinator/Periodic-Table-JSON
// Icons made by Freepik, Pixel perfect, and Vitaly Gorbachev from www.flaticon.com

/* global createCanvas, colorMode, HSB, width, height, random, background, fill, noFill, color, random,
          rect, ellipse, stroke, image, loadImage, frameRate, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, noLoop, loop, textFont,
          collideRectRect, round, createButton, createInput, floor, createSelect, loadFont, textAlign,
          CENTER, LEFT, tint, RGB, AUTO, PI, rotate, translate, textStyle, BOLD */

let elementList, score, tries, currentPage, memoriButton;
let correctImg, incorrectImg, periodicTableImg, elementGroupImg;
let startButton, nextButton, homeButton, inputButton, gameInput, correctList;
let randIndex, correctAns, userAns;
let titleFont, bodyFont, memoriFont;

function setup() {
  // Canvas & color settings
  let c = createCanvas(windowWidth, windowHeight);
  c.position(0, 0);
  colorMode(HSB, 360, 100, 100);

  titleFont = loadFont(
    "https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2FOpenSans-Regular.ttf?v=1596003672608"
  );
  bodyFont = loadFont(
    "https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2FRoboto-Regular.ttf?v=1596001816087"
  );
  memoriFont = loadFont(
    "https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2FOpenSans-SemiBold.ttf?v=1596063681833"
  );

  // json setup
  fetch("PeriodicTableJSON.json")
    .then(response => response.text())
    .then(text => parseJSON(text));

  // draw setup
  startButton = createButton("Start");
  nextButton = createButton("Next");
  homeButton = createButton("Home");
  memoriButton = createButton("Memori");

  elementList = [];
  gameInput = createInput("");
  inputButton = createButton("→");

  startButton.position(-width, -height);
  nextButton.position(-width, -height);
  homeButton.position(-width, -height);
  gameInput.position(-width, -height);
  inputButton.position(-width, -height);

  correctImg = loadImage(
    "https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Fcorrect.png?v=1595961729752"
  );
  incorrectImg = loadImage(
    "https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Fcriss-cross.png?v=1595961729872"
  );
  periodicTableImg = loadImage(
    "https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Fperiodic-table%20(1).png?v=1596006584045"
  );
  elementGroupImg = loadImage(
    "https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Felement.png?v=1596044591117"
  );

  correctList = [];
  currentPage = 0;
  randIndex = 0;
  correctAns = false;
  userAns = "";
}

function draw() {
  noStroke();

  // current page
  if (currentPage == 0) {
    titleScreen();
  } else if (currentPage == 1) {
    // startGame();
  } else if (currentPage == 2) {
    endScreen();
  }

  // button display
  // bool currentPage: 0 = home, 1 = game, 2 = end
  if (currentPage == 0) {
    nextButton.position(-width, -height);
    homeButton.position(-width, -height);
    gameInput.position(-width, -height);
    inputButton.position(-width, -height);
  } else if (currentPage == 1) {
    startButton.position(-width, -height);
    homeButton.position(-width, -height);
  } else if (currentPage == 2) {
    startButton.position(-width, -height);
    nextButton.position(-width, -height);
    gameInput.position(-width, -height);
    inputButton.position(-width, -height);
  }
}

function parseJSON(ptData) {
  // parse periodic table JSON
  let ptJSON = JSON.parse(ptData);
  // console.log(ptJSON["elements"]);
  for (const element of ptJSON["elements"]) {
    // console.log(element);
    // to retrieve element name, for example, just do element.name
    elementList.push(element);
  }
  // console.log(elementList);
}

function titleScreen() {
  currentPage = 0;
  score = 0;
  tries = 10;
  correctList = [];
  // console.log('title screen');
  background(260, 30, 83);

  colorMode(RGB, 100);
  tint(255, 20);
  image(periodicTableImg, width * 0.4, height * 0.1, 700, 700);

  // reset color scheme
  tint(255, 100);
  colorMode(HSB, 360, 100, 100);

  // memori logo
  fill("white");
  textSize(30);
  textFont(memoriFont);
  text("Memori", width * 0.05, width * 0.05);

  textSize(110);
  textFont(titleFont);
  textAlign(LEFT, CENTER);
  text("Periodic Table", width * 0.1, height * 0.4, width);

  textSize(35);
  textFont(bodyFont);
  text(
    "Test your memory with 10 randomly chosen elements!",
    width * 0.105,
    height * 0.6,
    width
  );

  startButton.position(width * 0.105, height * 0.75, width);
  startButton.style("background-color", "white");
  startButton.style("border", "none");
  startButton.style("border-radius", "5px");
  startButton.style("font-size", "20px");
  startButton.style("padding", "10px");
  startButton.mousePressed(startGame);
}

function startGame() {
  currentPage = 1;
  // console.log('start game');
  nextButton.position(-width, -height);
  background(260, 30, 83);
  fill("white");

  // answer ellipses
  for (let i = 0; i < 10; i++) {
    if (i < correctList.length) {
      if (correctList[i]) {
        fill("#4CB050");
      } else {
        fill("#F44236");
      }
    } else {
      fill("#dcdedc");
    }
    ellipse(width * 0.1, height * 0.1 + i * 50, 40, 40);
  }

  // element
  randIndex = floor(random(elementList.length));
  fill("white");
  rect(width * 0.2, height * 0.1, width * 0.25, height * 0.8);

  fill("black");
  textSize(35);

  textFont(titleFont);
  textAlign(CENTER);
  text(
    `${elementList[randIndex].number}`,
    width * 0.2,
    height * 0.25,
    width * 0.25
  );
  textSize(70);
  text(
    `${elementList[randIndex].symbol}`,
    width * 0.2,
    height * 0.5,
    width * 0.25
  );

  tries--;

  textFont(bodyFont);
  textSize(30);
  gameInput.size(width * 0.15, height * 0.05);
  gameInput.style('font-size', '20px');
  gameInput.position(width * 0.6, height * 0.45);
  gameInput.input(userGuess);
  inputButton.size(width * 0.03, gameInput.height);
  inputButton.position(width * 0.6 + gameInput.width, height * 0.45);
  inputButton.mousePressed(checkAnswer);
}

function userGuess() {
  // console.log(this.value());
  userAns = this.value();
}

function checkAnswer() {
  // console.log('check ans');
  if (userAns.toLowerCase() == elementList[randIndex].name.toLowerCase()) {
    // console.log("TRUE");
    image(
      correctImg,
      (2 * gameInput.x + gameInput.width) / 2 - 25,
      gameInput.y - height * 0.25,
      100,
      100
    );
    fill("#4CB050");
    correctList.push(true);
    score += 1;
  } else {
    // console.log("FALSE");
    image(
      incorrectImg,
      (2 * gameInput.x + gameInput.width) / 2 - 25,
      gameInput.y - height * 0.25,
      100,
      100
    );
    correctList.push(false);
    fill("#F44236");
  }

  // console.log(`score: ${score}`);
  textSize(40);
  text(
    `${elementList[randIndex].name}`,
    width * 0.2,
    height * 0.75,
    width * 0.25
  );

  textAlign(CENTER);
  nextButton.position(
    (2 * gameInput.x + gameInput.width) / 2,
    gameInput.y + height * 0.15
  );
  nextButton.style("background-color", `${inputButton.color}`);
  nextButton.style("border", "none");
  nextButton.style("border-radius", "5px");
  nextButton.style("font-size", "18px");
  nextButton.style("padding", "10px");

  if (tries > 0) {
    nextButton.mousePressed(startGame);
  } else {
    nextButton.mousePressed(endScreen);
  }
  // console.log(tries);
}

function endScreen() {
  currentPage = 2;
  // console.log('end screen');
  background(260, 30, 83);

  fill("white");
  textSize(55);
  textFont(titleFont);
  text(`Final Score: ${score}`, width / 2, height * 0.4);

  textFont(bodyFont);
  homeButton.style("background-color", `${inputButton.color}`);
  homeButton.style("border", "none");
  homeButton.style("border-radius", "5px");
  homeButton.style("font-size", "18px");
  homeButton.style("padding", "10px");
  homeButton.position((width - homeButton.width) / 2, height * 0.5);
  homeButton.mousePressed(titleScreen);

  // element group images
  colorMode(RGB, 100);
  tint(255, 20);
  image(elementGroupImg, width * 0.01, height - 250, 250, 250); // bottom left
  translate(width * 2 - 250, height / 2 - 40);
  rotate(PI);
  image(elementGroupImg, width * 0.8, 0, 250, 250); // top right

  // reset color scheme
  tint(255, 100);
  colorMode(HSB, 360, 100, 100);
}
