import randomPalette from './randomPalette'

const setPalette = () => {
  try {
    let palette = localStorage.getItem('palette')
  } catch {
    randomPalette()
    let palette = localStorage.getItem('palette')
  }

  let bgIndex, fgIndex;
  let root = document.documentElement
  bgIndex = (Math.random() > 0.5) ? 0 : 1;
  fgIndex = 1 - bgIndex;
  console.log('foreground: ' + palette[fgIndex]);
  console.log('background: ' + palette[bgIndex]);
  root.style.setProperty('--background-color', palette[bgIndex]);
  root.style.setProperty('--foreground-color', palette[fgIndex]);
}

export default setPalette