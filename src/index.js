document.getElementById('controls').addEventListener("mousedown", e => e.stopPropagation())
const demos = [
  { name: "charges", label: "Simple charges" }
]
const chooser = document.getElementById("chooser")

demos.forEach(({ name, label }) => {
  const link = document.createElement("a")
  link.href = "#"
  link.text = label

  link.addEventListener("click", (e) => {
    e.preventDefault()

    import(`./${name}.js?${Math.floor(Math.random()*10000)}`).then(demo => {
      const oldControls = document.querySelector("#controls .demo-controls")
      if (oldControls) oldControls.className = "fadeout demo-controls"

      setTimeout(() => {
        const controls = document.getElementById("controls")
        const newControls = demo.controls()
        newControls.className = "fadein demo-controls"

        if (Object.hasOwn(window, "remove")) {
          remove()
        }

        Object.keys(demo).forEach(func => window[func] = demo[func])
        window.windowResized = () => resizeCanvas(windowWidth, windowHeight)
        if(oldControls) oldControls.remove()
        controls.append(newControls)

        new p5()
        setTimeout(() => newControls.className = "demo-controls", 100)
      }, 500)
    })
  })

  chooser.append(link)
})
