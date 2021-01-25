import { randomSet } from '@components/modules/random/palette/palette'
import styles from '@styles/templates.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Footer = () => {
  const router = useRouter()

  const [palette, set_palette] = useState([])

  useEffect(() => {
    getPalette()
  }, [router.isReady])

  const getPalette = () => {
    let palette
    palette = localStorage.getItem('palette')
    console.log('palette', palette)
    try {
      palette = palette.split(',')
      set_palette([])
      palette.forEach(item =>(
        console.log('palette item: ' + item),
        set_palette(palette => [...palette, item])
      ))
    } catch {
      console.log('error getting palette')
    }
  }

  const updatePalette = () => {
    randomSet()
    getPalette()
  }

  return(
    <footer className={styles.footerMain}>
      {/* <h6>Footer content</h6> */}
      <button onClick={updatePalette}>Palette swap</button>
      {(palette[3] == '' || palette[2] == '') ? <p>{palette[2] == '' ? palette[3] : palette[2]}</p> : <p>{palette[2]} & {palette[3]}</p>}
    </footer>
    )
}

export default Footer