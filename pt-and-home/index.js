// Icons made by Freepik from www.flaticon.com

/* global createCanvas, colorMode, HSB, width, height, random, background, fill, noFill, color, random,
          rect, ellipse, stroke, image, loadImage, frameRate, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, createA,
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, noLoop, loop, textFont,
          collideRectRect, round, createButton, createInput, floor, createSelect, loadFont, textAlign,
          CENTER, LEFT, tint, RGB, AUTO, frameCount, PI, rotate, translate, textStyle, BOLD */

let titleFont, bodyFont, memoriFont, clubImg, heartImg, spadeImg, diamondImg;
let mathButton, ptButton, statsButton, buttonList;
let framesAtLoaded, floatSuits, suitTypes;

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
  
  clubImg = loadImage('https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Fclub.png?v=1596093295247');
  heartImg = loadImage('https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Fheart.png?v=1596093295413');
  spadeImg = loadImage('https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Fspade.png?v=1596093295438');
  diamondImg = loadImage('https://cdn.glitch.com/c5f5b5e1-9d90-4c59-a260-e2495c66c02c%2Fdiamond.png?v=1596093295377');
  
  mathButton = createButton('Flash Numbers');
  statsButton = createButton('Activity');
  ptButton = createButton('Periodic Table');
  
  buttonList = [mathButton, statsButton, ptButton];
  
  framesAtLoaded = frameCount;
  floatSuits = [];
  suitTypes = [clubImg, heartImg, spadeImg, diamondImg];
  
  // set up floating suites
  for (let i = 0; i < 40; i++) {
    floatSuits.push(new cardSuit());
  }
}

function draw() {
  background(0, 0, 0);
  noStroke();
  
  // floating suits
  for (let i = 0; i < floatSuits.length; i++) {
    floatSuits[i].move();
    floatSuits[i].show();
  }
  
  // logo fade-in
  if (frameCount - framesAtLoaded < 100) {
    fill(0, 0, frameCount);
  } else {
    fill(0, 0, 100);
  }
  textSize(150);
  textFont(memoriFont);
  textAlign(CENTER, CENTER);
  text('Memori', 0, 0, width, height / 2);

  fill('white');
  textSize(20);
  text('Made by Stephanie, Alex, and Sashrika', 0, height * .9, width);
  
  // links to pages  
  for (let i = 0; i < buttonList.length; i++) {
    let buffer = width / 13;
    let topLeftRectX = buffer * (1 + i * 4);
    let topLeftRectY = height * .6;
    
    textAlign(CENTER);
    buttonList[i].position(topLeftRectX, topLeftRectY, buffer * 3, height * .25);    
    buttonList[i].size(`${buffer * 3}`);
    buttonList[i].style('background-color', 'white');
    buttonList[i].style('border-style', 'none');
    buttonList[i].style('border-radius', '10px');
    buttonList[i].style('font-family', `${titleFont}`);
    buttonList[i].style('font-size', '30px');
    buttonList[i].style('padding', '20px');
    buttonList[i].style('color', 'black');
    
    // fill(0, 0, 0);
    // textAlign(CENTER);
    // textFont(bodyFont);
    // textSize(30);
    // text(pageInfo[i][0], topLeftRectX, topLeftRectY, 3 * buffer, height * .25);
    // fill(0, 0, (frameCount / 2));
  }
  
  ptButton.mousePressed(window.open('periodicTable.html'));
  mathButton.mousePressed(window.open('#'));
  statsButton.mousePressed(window.open('#'));
}

class cardSuit {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = 50;
    this.size = 50;
    this.staticXVelocity = random(0.5, 2);
    this.staticYVelocity = random(0.5, 2);
    this.xVelocity = this.staticXVelocity;
    this.yVelocity = this.staticYVelocity;
    this.image = suitTypes[floor(random(0, 4))];
  }
  
  move() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    
    if (this.x + this.size > width) {
      this.xVelocity = -this.staticXVelocity;
    } 
    if (this.x - this.size < 0) {
      this.xVelocity = this.staticXVelocity;
    } 
    if (this.y + this.size > height) {
      this.yVelocity = -this.staticYVelocity;
    } 
    if (this.y - this.size < 0) {
      this.yVelocity = this.staticYVelocity;
    }
  }
  
  show(imageLink) {
    image(this.image, this.x, this.y, this.size, this.size);
  }
}