let font;
let typing = "";
let n;
let letters = [];

function preload() {
  // טוען את הגופן
  font = loadFont('ploni-light-aaa.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  n = 16;
  textSize(18);
  textFont(font);
}

function draw() {
  background(0); // רקע שחור
  fill(255); // טקסט לבן
  textAlign(CENTER, CENTER);

  text(typing, width / 2, height / 2);

  for (let l of letters) {
    l.update();
    l.display();
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
  } else if (keyCode === BACKSPACE) {
    if (typing.length > 0) {
      typing = typing.substring(0, typing.length - 1);
    }
  } else if (key.length === 1 && typing.length <= n) {
    // בדיקה אם התו הוא תו תקני להדפסה
    typing += key;
  }
}

class Letter {
  constructor(x, y, letter) {
    this.letter = letter;
    this.location = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1)); // מהירות אקראית לכל כיוון
    this.gravity = createVector(0, 0.01); // גרביטציה קלה מאוד
  }

  display() {
    fill(255); // טקסט לבן
    text(this.letter, this.location.x, this.location.y);
  }

  update() {
    this.location.add(this.velocity);
    this.velocity.add(this.gravity);

    // שינוי כיוון אם האותיות יוצאות מחוץ לקנבס
    if (this.location.x > width || this.location.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.location.y > height || this.location.y < 0) {
      this.velocity.y *= -1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
