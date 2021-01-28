import wordsList from './words.json'

export default async function randomWords(wordcount) {
  let wordsArr = new Array(wordcount)
  let combined = ''

  for (let i = 0; i < wordcount; i++) {
    let found = false
    while (!found) {
      let index = Math.floor(Math.random() * wordsList.words.length)
      let newword = wordsList.words[index]
      if (!wordsArr.includes(newword)) {
        wordsArr.push(newword)
        combined += newword.charAt(0).toUpperCase() + newword.substr(1, newword.length)
        found = true
      }
    }
  }

  return combined
}