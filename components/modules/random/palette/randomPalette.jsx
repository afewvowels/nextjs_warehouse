import palettes from './palettes.json';

const randomPalette = () => {
  let palettesArr = [...palettes.palettes]
  let index = Math.floor(Math.random() * palettesArr.length)
  localStorage.setItem('palette', palettesArr[index])
}

export default randomPalette;

