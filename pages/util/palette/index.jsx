import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { v4 as uuidv4 } from 'uuid'
import Palette from '@components/elements/Palette'
import Head from 'next/head'
import styles from '@styles/elements.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Index = ({palettes}) => {
  const [hex0, set_hex0] = useState('')
  const [hex1, set_hex1] = useState('')
  const [color0, set_color0] = useState('')
  const [color1, set_color1] = useState('')
  const [error_msg, set_error_msg] = useState('')

  const handleCreate = async () => {
    const newPalette = {
      uuid: uuidv4(),
      hex0: hex0,
      hex1: hex1,
      color0: color0,
      color1: color1
    }

    const paletteRes = await fetch('/api/palettes', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(newPalette)
    })

    if (paletteRes.status == 201) {
      console.log(`palette created successfully`)
      set_hex0('')
      set_hex1('')
      set_color0('')
      set_color1('')
    } else {
      console.error(`error while creating palette`)
      set_error_msg(await paletteRes.text())
    }
  }

  return(<>
    <Head>
      <title>Palette | Inventory</title>
    </Head>
    <div className={`${styles.titleWrapper} ${styles.titleHeadingLink}`}>
      <h2>Palettes</h2>
    </div>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        <div className={styles.elementEntryRow}>
          <label>Hex 0</label>
          <input type='text'
                  value={hex0}
                  onChange={e => set_hex0(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Hex 1</label>
          <input type='text'
                  value={hex1}
                  onChange={e => set_hex1(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Color 0</label>
          <input type='text'
                  value={color0}
                  onChange={e => set_color0(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Color 1</label>
          <input type='text'
                  value={color1}
                  onChange={e => set_color1(e.target.value)}/>
        </div>
        <span className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create</button>
        </span>
      </div>
    </section>
    <section className={styles.elementWrapper}>
      {palettes.map((palette, key) => (
        <Palette palette={palette} key={key}/>
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  const palettes = await fetcher(`${process.env.URL}api/palettes`)

  return { props: { palettes } }
}

export default Index