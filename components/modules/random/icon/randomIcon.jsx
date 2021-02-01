import icons from './icons.json'

function randomIcon() {
  let iconArr = [...icons.icons]
  let returnableIcon = iconArr[Math.floor(Math.random() * iconArr.length)]
  let returnableIconArr = []

  returnableIconArr = returnableIcon.split(' ')

  return returnableIconArr
}

export default randomIcon