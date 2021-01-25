import palettesArr from './palettes.json'

export function initialize() {
  let palette
  palette = localStorage.getItem('palette')
  try {
    palette = palette.split(',')
    palette.forEach(item => console.log('palette item: ' + item))
    let root = document.documentElement
    root.style.setProperty('--background-color', palette[0]);
    root.style.setProperty('--foreground-color', palette[1]);
    console.log('updated css vars: ' + palette[0] + ', ' + palette[1])
  } catch {
    console.error('could not split palette array from localStorage')
    randomSet()
  }
}

export function randomSet() {
  let palettes = [...palettesArr.palettes]
  let palette = new Array(4);
  let bgIndex, fgIndex;
  let index = Math.floor(Math.random() * palettes.length)

  bgIndex = (Math.random() > 0.5) ? 0 : 1;
  fgIndex = 1 - bgIndex;

  palette[0] = palettes[index][fgIndex]
  palette[1] = palettes[index][bgIndex]
  palette[2] = palettes[index][fgIndex + 2]
  palette[3] = palettes[index][bgIndex + 2]
  localStorage.setItem('palette', palette)
  console.log('set new palette: ' + palette)
  
  let root = document.documentElement
  root.style.setProperty('--background-color', palette[0]);
  root.style.setProperty('--foreground-color', palette[1]);
}