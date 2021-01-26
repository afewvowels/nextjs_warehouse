export function initialize() {
  let palette
  palette = localStorage.getItem('palette')
  try {
    palette = palette.split(',')
    // palette.forEach(item => console.log('palette item: ' + item))
    let root = document.documentElement
    root.style.setProperty('--background-color', palette[0]);
    root.style.setProperty('--foreground-color', palette[1]);
    // console.log('updated css vars: ' + palette[0] + ', ' + palette[1])
  } catch {
    // console.error('could not split palette array from localStorage')
    randomSet()
  }
}

export async function randomSet() {
  let palettesArr = []
  try {
    palettesArr = localStorage.getItem('palettes')
    palettesArr = palettesArr.split(',')
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
        console.log('pushed', tempPal)
        tempPal = new Array(4)
      }
    })
    palettesArr = tempPalettesArr
  } catch {
    console.error(`palettes not found in localStorage`)
    let palettesRes
    await fetch('/api/palettes')
      .then(res => res.json())
      .then(data => palettesRes = data)
  
    palettesRes.map(palette => {
      let pArr = new Array(4)
      for (let i = 0; i < 4; i++) {
        pArr[i] = Object.values(palette)[i + 2]
      }
      palettesArr.push(pArr)
    })
    localStorage.setItem('palettes', palettesArr)  
  }

  let palette = new Array(4);
  let bgIndex, fgIndex;
  let index = Math.floor(Math.random() * palettesArr.length)

  bgIndex = (Math.random() > 0.5) ? 0 : 1;
  fgIndex = 1 - bgIndex;

  palette[0] = '#' + palettesArr[index][fgIndex]
  palette[1] = '#' + palettesArr[index][bgIndex]
  palette[2] = palettesArr[index][fgIndex + 2]
  palette[3] = palettesArr[index][bgIndex + 2]
  localStorage.setItem('palette', palette)
  
  let root = document.documentElement
  root.style.setProperty('--background-color', palette[0]);
  root.style.setProperty('--foreground-color', palette[1]);
}