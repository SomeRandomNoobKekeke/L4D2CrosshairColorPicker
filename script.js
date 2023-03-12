function init() {
  localStorage.setItem('Crosshair color picker', JSON.stringify({
    swatchesA: [
      'rgba(150,0,0,1)',
      'rgba(255,200,0,1)',
      'rgba(0,255,255,1)',
      'rgba(100,255,100,1)',
      'rgba(138,182,220,1)',
    ],
    swatchesB: [
      'rgba(255,0,0,0.5)',
      'rgba(255,200,0,0.25)',
      'rgba(0,255,255,0.5)',
      'rgba(100,255,100,0.5)',
      'rgba(138,182,220,1)',
    ],
  }))
}

// for testing xd
function resetSwathes() {
  window.addEventListener('beforeunload', () => {
    if (localStorage.getItem('Crosshair color picker')) {
      localStorage.removeItem('Crosshair color picker')
    }
  })
}

if (!localStorage.getItem('Crosshair color picker')) init()

let { swatchesA = [], swatchesB = [] } = JSON.parse(localStorage.getItem('Crosshair color picker'))

window.addEventListener('beforeunload', () => {
  if (swatchesA.length == 0 && swatchesB.length == 0) {
    if (localStorage.getItem('Crosshair color picker')) {
      localStorage.removeItem('Crosshair color picker')
    }
  } else {
    localStorage.setItem('Crosshair color picker', JSON.stringify({ swatchesA, swatchesB }))
  }
})



function redrawCrosshair(color) {
  crosshair.style.backgroundColor = color.rgb().toString()
}

const crBoxA = new Alwan('#crBoxA', {
  theme: 'dark',
  position: 'bottom-center',
  color: swatchesA[0] || 'rgba(138,182,220,1)',
  default: 'rgba(138,182,220,1)',
  swatches: swatchesA
});

const crBoxB = new Alwan('#crBoxB', {
  theme: 'dark',
  position: 'bottom-center',
  color: swatchesB[0] || 'rgba(138,182,220,1)',
  default: 'rgba(138,182,220,1)',
  swatches: swatchesB
});


crBoxA.on('color', redrawCrosshair)
crBoxA.trigger('color')



for (let s of screenshots) {
  let img = document.createElement('img')
  img.src = `${s}`
  document.getElementById('screenshotsContainer').append(img)
}



document.addEventListener('mousedown', () => { redrawCrosshair(crBoxB.getColor()) })
document.addEventListener('mouseup', () => { redrawCrosshair(crBoxA.getColor()) })

document.addEventListener('mousemove', (e) => {
  crosshair.style.left = e.clientX - 15 + 'px'
  crosshair.style.top = e.clientY - 15 + 'px'
})

toolbox.addEventListener('mouseover', () => { crosshair.style.display = 'none' })
screenshotsContainer.addEventListener('mouseover', () => { crosshair.style.display = 'block' })


function exportColor() {
  let { r, g, b, a } = this.getColor().rgb()

  navigator.clipboard.writeText(`cl_crosshair_red ${r}; cl_crosshair_green ${g}; cl_crosshair_blue ${b}; cl_crosshair_alpha ${Math.floor(a * 255)};`)
}

exportBtnA.addEventListener('click', exportColor.bind(crBoxA))
exportBtnB.addEventListener('click', exportColor.bind(crBoxB))

function toggleSwatch() {
  // this is crBoxA or crBoxB

  let { r, g, b, a } = this.getColor().rgb()
  let cl = `rgba(${r},${g},${b},${a})`

  let index = this.config.swatches.indexOf(cl)

  if (index == -1) {
    this.addSwatch(cl)
  } else {
    this.removeSwatch(index)
    this.setColor(this.config.swatches.slice(-1)[0] || this.config.default)
  }
}

SDBtnA.addEventListener('click', toggleSwatch.bind(crBoxA))
SDBtnB.addEventListener('click', toggleSwatch.bind(crBoxB))



document.addEventListener('keydown', (e) => {
  if (/^[1-9]$/.test(e.key) && !crBoxA.isOpen() && !crBoxB.isOpen()) {
    let i = Number(e.key) - 1
    if (swatchesA[i] && swatchesB[i]) {
      crBoxA.setColor(crBoxA.config.swatches[i])
      crBoxB.setColor(crBoxB.config.swatches[i])

      redrawCrosshair(crBoxA.getColor())
    }
  }
})




