let charge1, charge2
let distanceSpan, distanceSlider
let font

const K = 8.987e9

class Charge {
  constructor(x, y, name) {
    this.x = x
    this.y = y
    this.name = name
    this.force = 0
    this.setupControls()
  }

  draw() {
    push()
    noStroke()
    ambientMaterial(this.color())
    translate(this.x, this.y)
    sphere(15)
    textSize(8)
    text(`${this.force.toPrecision(3)}N`, 0, 30)
    this.drawForceVector()
    pop()
  }

  color() {
    return this.slider.value() >= 0 ? "#f00" : "#00f"
  }

  setupControls() {
    const label = createSpan(this.name)
    const div = createDiv()
    div.child(label)
    this.slider = createSlider(-5, 5, 1, 0.01)

    div.child(this.slider)
    this.valueSpan = createSpan()

    div.child(this.valueSpan)
    div.parent("demo-controls")

    this.slider.changed(sliderChanged(this.slider, this.valueSpan, "µC"))
    sliderChanged(this.slider, this.valueSpan, "µC")()
  }

  updateForce(otherCharge) {
    const d = (this.x - otherCharge.x) * 1 / 100 //cm to meter conversion
    const q1 = this.slider.value()  *  10e-6 // micro-coulomb to coulomb 
    const q2 = otherCharge.slider.value() * 10e-6 
    const direction = d / Math.abs(d)

    this.force = direction * K * q1 * q2 / d**2
  }

  drawForceVector() {
    const direction = this.force / Math.abs(this.force)
    const length = this.force * (200-30) / 80 + direction * 30

    ambientMaterial("#0F0")
    translate(length / 2, 0)
    rotateZ(Math.PI / 2)
    cylinder(2, length)
    translate(0, -length / 2, 0)
    cone(4, -direction * 5)
    translate(0, 5)
  }
}

export function preload() {
  font = loadFont("assets/Inconsolata-Regular.ttf")
}

export function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  setupDistanceControl()
  textFont(font)
  charge1 = new Charge(distanceSlider.value() / 2, 0, "Charge 1")
  charge2 = new Charge(-(distanceSlider.value() / 2), 0, "Charge 2")
}

export function draw() {
  background("#777")
  noStroke()
  orbitControl()

  ambientLight(60, 60, 60)
  pointLight(255, 255, 255, 1000, 1, 1000)
  charge1.x = distanceSlider.value() / 2
  charge2.x = -(distanceSlider.value() / 2)

  // This is not very efficient but should be fine for this case
  charge1.updateForce(charge2)
  charge2.updateForce(charge1)

  charge1.draw()
  charge2.draw()
}

export function controls() {
  const newControls = document.createElement("div")
  newControls.id = "demo-controls"
  newControls.innerHTML = `
    <h2>Controls</h2>
    <p>This is a demonstration of Coulomb's law. The law states that the |F| = k * |q1| * |q2| / r^2. That is, the force caused by two charges is proportional to the product of the charges and is inversely proportional to the distance between them squared. You can change the charges and the distance and see what happens to the forces.</p>
  `
  return newControls
}

function setupDistanceControl() {
  const div = createDiv()

  const label = createSpan("Distance")
  div.child(label)

  distanceSlider = createSlider(50, 500, 50, 5)
  div.child(distanceSlider)

  distanceSpan = createSpan()
  div.child(distanceSpan)

  div.parent("demo-controls")
  distanceSlider.changed(sliderChanged(distanceSlider, distanceSpan, "cm"))
  sliderChanged(distanceSlider, distanceSpan, "cm")()
}

function sliderChanged(slider, span, unit) {
  return () => span.html(`${slider.value()}${unit}`)
}
