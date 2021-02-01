import { randomSet } from '@components/modules/random/palette/palette'
import styles from '@styles/templates.module.css'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => {
  const router = useRouter()

  const [palette, set_palette] = useState([])
  const [fonts, set_fonts] = useState([])

  useEffect(() => {
    getPalette()
    fetch('/api/fonts')
      .then(res => res.json())
      .then(data => set_fonts(data))
  }, [router.isReady])

  const selectRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend','<option value="null">Select a font</option>')
      fonts.forEach(font => {
        node.insertAdjacentHTML('beforeend',`<option value='${font.uuid}'>${font.name}</option>`)
      })
    }
  }, [fonts])

  const fontRef = useCallback(node => {
    if (node != null) {
      if (palette[3] == palette[2]) {
        node.innerHTML = palette[2]
      } else {
        node.innerHTML = `${palette[2]} & ${palette[3]}`
      }
    }
  }, [palette])

  const setFont = (uuid) => {
    fonts.map(font => {
      if (font.uuid == uuid) {
        let root = document.documentElement
        root.style.setProperty('--font-family', font.css)
        root.style.setProperty('--font-weight-light', font.weight0)
        root.style.setProperty('--font-weight-heavy', font.weight1)
        console.log('set font to', font.name)
        return
      }
    })
  }

  const getPalette = () => {
    let palette
    palette = localStorage.getItem('palette')
    try {
      palette = palette.split(',')
      if (palette.length != 4) throw new Error
      set_palette(palette)
    } catch {
      console.log('error getting palette')
    }
  }

  const updatePalette = async () => {
    await randomSet()
    getPalette()
  }

  return(
    <footer className={styles.footerMain}>
      <span onClick={updatePalette}>
        <FontAwesomeIcon icon={['fas', 'palette']}/>
        <p ref={fontRef}></p>
      </span>
      <span className={styles.footerFontSelectWrapper}>
        <select className={styles.footerFontSelect} ref={selectRef}
          onChange={e => setFont(e.target.value)}>
        </select>
        <p>Aa</p>
      </span>
    </footer>)
}

export default Footer