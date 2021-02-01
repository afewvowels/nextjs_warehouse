import React, { useState } from 'react'
import Router from 'next/router'
import styles from '@styles/elements.module.css'

const Index = ({palette}) => {
  const [error_msg, set_error_msg] = useState('')

  const handleDelete = async () => {
    const delRes = await fetch('/api/palettes/' + palette.uuid, {
      method: 'DELETE'
    })

    if (delRes.status == 201) {
      console.log('delete successful')
      Router.push('/util/palette')
    } else {
      console.error('error while deleting palette')
      set_error_msg(await delRes.text())
    }
  }

  return(<>
    { error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null }
    <div className={`${styles.elementEntryRowsWrapper} ${styles.elementPaletteWrapper}`}>
      <span className={styles.elementPaletteSwatch}>
        <div style={{backgroundColor: `#${palette.hex0}`}}></div>
        <p>#{palette.hex0}</p>
        <p>{palette.color0}</p>
      </span>
      <span className={styles.elementPaletteSwatch}>
        <div style={{backgroundColor: `#${palette.hex1}`}}></div>
        <p>#{palette.hex1}</p>
        <p>{palette.color1}</p>
      </span>
      <span>
        <button className={styles.elementButton} onClick={handleDelete}>Delete</button>
      </span>
    </div>
  </>)
}

export default Index