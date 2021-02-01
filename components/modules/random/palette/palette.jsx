export function initialize() {
  let palette
  palette = localStorage.getItem('palette')
  try {
    palette = palette.split(',')
    if (palette.length != 4) throw new Error('localStorage palette not correct size...regenerating')
    let root = document.documentElement
    root.style.setProperty('--background-color', palette[0])
    root.style.setProperty('--foreground-color', palette[1])
  } catch {
    randomSet()
  }
}

export async function randomSet() {
  let palettesArr = []
  try {
    palettesArr = localStorage.getItem('palettes')
    palettesArr = palettesArr.split(',')
    if (palettesArr.length < 4) {
      palettesArr = []
      throw new Error('palettes array susiciously short')
    }
    let tempPalettesArr = []
    let tempPal = new Array(4)
    palettesArr.forEach((item, index) => {
      if (index % 4 == 0) {
        tempPal[0] = item
      } else if (index % 4 == 1) {
        tempPal[1] = item
      } else if (index % 4 == 2) {
        tempPal[2] = item
      } else if (index % 4 == 3) {
        tempPal[3] = item
        tempPalettesArr.push(tempPal)
        tempPal = new Array(4)
      }
    })
    palettesArr = tempPalettesArr
  } catch {
    localStorage.setItem('palettes', undefined)
    let palettesRes
    await fetch('/api/palettes')
      .then(res => res.json())
      .then(data => palettesRes = data)

    palettesArr = new Array(0)
    palettesRes.map(palette => {
      let pArr = new Array(4)
      pArr[0] = palette.hex0
      pArr[1] = palette.hex1
      pArr[2] = palette.color0
      pArr[3] = palette.color1
      palettesArr.push(pArr)
    })
    localStorage.setItem('palettes', palettesArr)
  }

  let palette = new Array(4)
  let bgIndex, fgIndex
  let index = Math.floor(Math.random() * palettesArr.length)

  bgIndex = (Math.random() > 0.5) ? 0 : 1
  fgIndex = 1 - bgIndex

  palette[0] = '#' + palettesArr[index][fgIndex]
  palette[1] = '#' + palettesArr[index][bgIndex]
  palette[2] = palettesArr[index][fgIndex + 2]
  palette[3] = palettesArr[index][bgIndex + 2]
  localStorage.setItem('palette', palette)

  let root = document.documentElement
  root.style.setProperty('--background-color', palette[0])
  root.style.setProperty('--foreground-color', palette[1])
}