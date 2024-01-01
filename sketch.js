let spheres = [];
const sphereRadius = 2150;
const minSize = 5;
const maxSize = 20;
const numSpheres = 3500;
let camZ = 0;
let camY = 0;
const colors = ['#618C20', '#F2C029', '#F2CA7E', '#F28627', '#D94B18'];
let zoomAmount;
let rotationAmount;

// Creepy motion variables
let angleOffset;
let offsetChange;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noiseDetail(4, 0.4);
  zoomAmount = 20;
  rotationAmount = PI / 36;
  angleOffset = 0;
  offsetChange = PI / 180;
  for (let i = 0; i < numSpheres; i++) {
    addSphere();
  }
  noStroke();
}

function draw() {
  background(200);
  translate(0, 0, camZ);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.005 + camY);

  // Smooth rotation and zooming
  if (keyIsDown(UP_ARROW)) {
    camZ -= zoomAmount;
  }
  if (keyIsDown(DOWN_ARROW)) {
    camZ += zoomAmount;
  }
  if (keyIsDown(LEFT_ARROW)) {
    camY -= rotationAmount;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camY += rotationAmount;
  }

  // Create a creepy motion for the bulge
  let bulgeX = cos(angleOffset) * 200;
  let bulgeY = sin(angleOffset) * 200;
  let bulgeVec = createVector(bulgeX, bulgeY, 0);
  angleOffset += offsetChange;

  // Draw spheres and connect near-opposite spheres with lines
  for (const [index, sphere] of spheres.entries()) {
    let dX = bulgeVec.x - sphere.x;
    let dY = bulgeVec.y - sphere.y;
    let distance = sqrt(dX * dX + dY * dY);
    let bulgeSize = map(distance, 0, 100, maxSize * 3, sphere.size);
    bulgeSize = constrain(bulgeSize, sphere.size, maxSize * 2);
    push();
    translate(sphere.x, sphere.y, sphere.z);
    fill(sphere.sphereColor);
    sphere.sphereShape(bulgeSize);
    pop();

    // Connect lines to create a web inside the planet
    if (random(1) < 0.2) { // Control density of lines
      let oppositeIndex = (index + numSpheres / 2) % numSpheres;
      let oppositeSphere = spheres[oppositeIndex];
      strokeWeight(1);
      stroke(sphere.sphereColor);
      line(sphere.x, sphere.y, sphere.z, oppositeSphere.x, oppositeSphere.y, oppositeSphere.z);
    }
  }
}

function addSphere() {
  const size = random(minSize, maxSize);
  const theta = random(TWO_PI);
  const phi = random(PI);

  const x = sphereRadius * sin(phi) * cos(theta);
  const y = sphereRadius * sin(phi) * sin(theta);
  const z = sphereRadius * cos(phi);

  const sphereColor = color(random(colors));

  spheres.push({ x, y, z, size, sphereColor, sphereShape: (size) => sphere(size) });
}
