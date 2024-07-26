let font;
let typing = "";
let n;
let letters = [];
let questions = [
  "Hi, what's your name?",
  "Which planet would you like to visit?",
  "What type of vacation do you prefer?",
  "What's your budget?",
  "Do you have any additional preferences?",
  "What is your favorite color?",
  "Do you enjoy outdoor activities?",
  "What's your favorite movie genre?",
  "What's your dream job?",
  "If you could have a superpower, what would it be?"
];
let currentQuestion = 0;
let fadeInAlpha = 0;
let fadeInSpeed = 5;

let customColors;
let questionPos;
let voiceOvers = [];

function preload() {
  font = loadFont('ploni-light-aaa.otf');
  for (let i = 0; i < questions.length; i++) {
    voiceOvers[i] = loadSound(`question${i + 1}.mp3`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  n = 16;
  textSize(18);
  textFont(font);

  customColors = [
    color(66, 72, 88),    // כהה
    color(255, 255, 255), // לבן
    color(240, 200, 170), // חום בהיר
    color(180, 144, 216), // סגול כהה
    color(144, 180, 216)  // כחול כהה
  ];

  questionPos = createVector(width / 2, height / 3); // מיקום התחלתי של השאלה
}

function draw() {
  background(0); // רקע שחור

  push();
  fill(255, fadeInAlpha); // טקסט לבן עם אפקט Fade In
  textAlign(CENTER, CENTER);
  translate(questionPos.x, questionPos.y);
  text(questions[currentQuestion], 0, 0);
  pop();

  if (fadeInAlpha < 255) {
    fadeInAlpha += fadeInSpeed; // אפקט Fade In לשאלה
  }

  fill(255);
  textAlign(CENTER, CENTER);
  text(typing, width / 2, height / 2); // הצגת הטקסט המוקלד בפונט ploni

  for (let l of letters) {
    l.update();
    l.display();
  }

  let mouseDistToQuestion = dist(mouseX, mouseY, questionPos.x, questionPos.y);
  if (mouseDistToQuestion < 100) {
    let repel = p5.Vector.sub(questionPos, createVector(mouseX, mouseY));
    repel.setMag(0.02);
    questionPos.add(repel);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    let x = width / 2 - textWidth(typing) / 2;
    for (let i = 0; i < typing.length; i++) {
      letters.push(new Letter(x, height / 2, typing.charAt(i)));
      x += textWidth(typing.charAt(i));
    }
    typing = "";
    currentQuestion++;
    if (currentQuestion >= questions.length) {
      currentQuestion = 0; // Reset the questionnaire or handle it differently
    }
    fadeInAlpha = 0; // Reset Fade In לשאלה החדשה
    questionPos.set(width / 2, height / 3); // איפוס מיקום השאלה

    // הפעלת קובץ הקול לשאלה הנוכחית
    voiceOvers[currentQuestion].play();
  } else if (keyCode === BACKSPACE) {
    if (typing.length > 0) {
      typing = typing.substring(0, typing.length - 1);
    }
  } else if (key.length === 1 && typing.length <= n) {
    typing += key;
  }
}

class Letter {
  constructor(x, y, letter) {
    this.letter = letter;
    this.location = createVector(x, y);
    this.velocity = createVector(random(-0.5, 0.5), random(-0.7, 0.05)); // מהירות אקראית לכל כיוון
    this.gravity = createVector(0, 0.001); // גרביטציה קלה מאוד
    this.angle = random(TWO_PI); // זווית התחלתית אקראית
    this.rotationSpeed = random(-0.05, 0.05); // מהירות סיבוב אקראית
    this.brightness = random(200, 255); // בהירות התחלתית אקראית
    this.brightnessDirection = random(0.5, 1.5); // שינוי בהירות אקראי

    // שימוש בצבעים מותאמים אישית מהתמונה
    this.color = random(customColors);
  }

  display() {
    push();
    translate(this.location.x, this.location.y);
    rotate(this.angle); // סיבוב האות
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.brightness); // טקסט בצבע עם בהירות משתנה
    text(this.letter, 0, 0);
    pop();
  }

  update() {
    this.location.add(this.velocity);
    this.velocity.add(this.gravity);
    this.angle += this.rotationSpeed; // עדכון הזווית

    // שינוי כיוון אם האותיות יוצאות מחוץ לקנבס
    if (this.location.x > width || this.location.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.location.y > height || this.location.y < 0) {
      this.velocity.y *= -1;
    }

    // שינוי בהירות
    this.brightness += this.brightnessDirection;
    if (this.brightness > 255 || this.brightness < 200) {
      this.brightnessDirection *= -1;
    }

    // אינטראקציה עם העכבר
    let mouseDist = dist(mouseX, mouseY, this.location.x, this.location.y);
    if (mouseDist < 200) {
      let repel = p5.Vector.sub(this.location, createVector(mouseX, mouseY));
      repel.setMag(0.2);
      this.location.add(repel);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
