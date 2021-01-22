import { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import randomIcon from '@components/modules/random/icon/randomIcon'
const readable = require('readable-url-names')
import { v4 as uuidv4 } from 'uuid'

import styles from '@styles/elements.module.css'

var generator = new readable()

const Index = () => {
  const router = useRouter()

  let fileReader

  const [uuid, set_uuid] = useState('')
  const [readable_name, set_readable_name] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [item_uuids, set_item_uuids] = useState([])
  const [image_base64, set_image_base64] = useState('')
  const [icon, set_icon] = useState([])
  const [error_msg, set_error_msg] = useState('')

  const iconRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      ReactDOM.render(<FontAwesomeIcon icon={icon}/>, node)
    }
  }, [icon])

  const handleCreate = async () => {
    const body = {
      uuid: uuid,
      readable_name: readable_name,
      name: name,
      description: description,
      item_uuids: null,
      image_uuid: null,
      icon: icon
    }
    
    const res = await fetch('http://localhost:3000/api/bin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status == 201) {
      console.log(`bin created successfully`)
    } else {
      set_error_msg(await res.text())
    }
  }

  function generateIdentifiers() {
    let icon = randomIcon()
    set_icon(icon)
    set_uuid(uuidv4())
    set_readable_name(generator.generate())
  }

  return(
    <>
      <h2 className={styles.elementHeader}>Add Bin</h2>
      <section className={styles.elementWrapper}>
        <div className={styles.elementEntryRowsWrapper}>
          {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
          <div className={styles.elementEntryRow}>
            <span className={styles.elementButtonsWrapper}>
              <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateIdentifiers}>Generate</button>
            </span>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Icon</label>
            <FontAwesomeIcon icon={icon}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>UUID</label>
            <input type='text'
                    value={uuid}
                    readOnly={true}
                    onChange={e => set_uuid(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Readable Name</label>
            <input type='text'
                    value={readable_name}
                    readOnly={true}
                    onChange={e => set_readable_name(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Name</label>
            <input type='text'
                    value={name}
                    onChange={e => set_name(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Description</label>
            <input type='text'
                    value={description}
                    onChange={e => set_description(e.target.value)}/>
          </div>
          <div className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create</button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Index