let font;
let typing = "";
let n;
let letters = [];
let questions = [
  "Hi, what's your name?",
  "Which planet would you like to visit?",
  "What type of vacation do you prefer?",
  "What's your budget?",
  "Do you have any additional preferences?"
];
let cursorVisible = true;
let lastBlinkTime = 0;
const blinkInterval = 530; // מילישניות
let currentQuestion = 0;
let fadeInAlpha = 0;
let fadeInSpeed = 5;

let customColors;
let questionPos;

function preload() {
  // טוען את הגופן
  font = loadFont('ploni-light-aaa.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  n = 16;
  textSize(18);
  textFont(font);

  // הגדרת צבעים מותאמים אישית מהתמונה
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

  // אפקט זוהר לשאלה
  push();
  fill(255, fadeInAlpha); // טקסט לבן עם אפקט Fade In
  textAlign(CENTER, CENTER);
  translate(questionPos.x, questionPos.y);
  text(questions[currentQuestion], 0, 0);
  pop();

  if (fadeInAlpha < 255) {
    fadeInAlpha += fadeInSpeed; // אפקט Fade In לשאלה
  }

  // אפקט זוהר לטקסט המוקלד
  push();
 fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text(typing, width / 2, height / 2);
  pop();
  
    // הצגת סמן הכתיבה
  if (millis() - lastBlinkTime > blinkInterval) {
    cursorVisible = !cursorVisible;
    lastBlinkTime = millis();
  }
  
  if (cursorVisible && typing.length < n) {
    push();  // שומר את ההגדרות הנוכחיות
    let cursorX = width / 2 + textWidth(typing) / 2;
    noStroke();
    strokeWeight(0.001);  // סמן דק יותר
    line(cursorX, height / 2 - 10, cursorX, height / 2 + 10);
    pop();  // משחזר את ההגדרות הקודמות
  }
  

  for (let l of letters) {
    l.update();
    l.display();
  }

  // עדכון מיקום השאלה בהתבסס על תנועת העכבר
  let mouseDistToQuestion = dist(mouseX, mouseY, questionPos.x, questionPos.y);
  if (mouseDistToQuestion < 100) {
    let repel = p5.Vector.sub(questionPos, createVector(mouseX, mouseY));
    repel.setMag(0.02);
    questionPos.add(repel);
  }
  
  
    if (millis() - lastBlinkTime > blinkInterval) {
    cursorVisible = !cursorVisible;
    lastBlinkTime = millis();
  }
  
  if (cursorVisible && typing.length < n) {
    let cursorX = width / 2 + textWidth(typing) / 2;
    stroke(255);
    strokeWeight(2);  // שמירה על עובי הקו המקורי
    line(cursorX, height / 2 - 10, cursorX, height / 2 + 10);
    noStroke();  // איפוס הגדרות הקו כדי לא להשפיע על שאר הציור
  }
  
}


function keyPressed() {
   cursorVisible = true; // איפוס הסמן בכל לחיצה על מקש
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
  } else if (keyCode === BACKSPACE) {
    if (typing.length > 0) {
      typing = typing.substring(0, typing.length - 1);
    }
  } else if (key.length === 1 && typing.length <= n) {
    typing += key;
  }
  
  // הצגת סמן הכתיבה
  if (millis() - lastBlinkTime > blinkInterval) {
    cursorVisible = !cursorVisible;
    lastBlinkTime = millis();
  }
  
  if (cursorVisible && typing.length < n) {
    let cursorX = width / 2 + textWidth(typing) / 2;
noStroke();
    line(cursorX, height / 2 - 10, cursorX, height / 2 + 10);
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
