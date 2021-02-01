import React, { useState } from 'react'
import Router from 'next/router'
import styles from '@styles/elements.module.css'

const Index = ({font}) => {
  const [error_msg, set_error_msg] = useState('')

  const handleDelete = async () => {
    const delRes = await fetch('/api/fonts/' + font.uuid, {
      method: 'DELETE'
    })

    if (delRes.status == 201) {
      console.log('delete successful')
      Router.push('/util/font')
    } else {
      console.error('error while deleting font')
      set_error_msg(await delRes.text())
    }
  }

  return(<>
    { error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null }
    <div className={`${styles.elementEntryRowsWrapper} ${styles.elementFontWrapper}`}>
      <p>{font.name}</p>
      <p>{font.category}</p>
      <p>{font.weight0}</p>
      <p>{font.weight1}</p>
      <span>
        <button className={styles.elementButton} onClick={handleDelete}>Delete</button>
      </span>
    </div>
  </>)
}

export default Index