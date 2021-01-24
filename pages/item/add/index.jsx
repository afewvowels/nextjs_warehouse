import { useState, useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuidv4 } from 'uuid'
import randomIcon from '@components/modules/random/icon/randomIcon'
import urls from '@public/urls.json'

import styles from '@styles/elements.module.css'

const Index = ({prototypes, bins, categories}) => {
  const [uuid, set_uuid] = useState('')
  const [prototype_uuid, set_prototype_uuid] = useState('')
  const [bin_uuid, set_bin_uuid] = useState('')
  const [in_bin, set_in_bin] = useState(false)
  const [error, set_error] = useState('')
  const [category, set_category] = useState('')

  const generateUuid = () => {
    set_uuid(uuidv4())
  }

  const categoriesRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.insertAdjacentHTML(`beforeend`, `<option value='-1
      '>Select a category</option>`)
      categories.forEach(category => {
        node.insertAdjacentHTML(`beforeend`, `<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  const prototypesRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.insertAdjacentHTML(`beforeend`,`<option value='-1'>Select a prototype</option>`)
      prototypes.forEach(prototype => {
        node.insertAdjacentHTML(`beforeend`,`<option value=${prototype.uuid}>${prototype.name}</option>`)
      })
    }
  }, [categories])

  const binsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.insertAdjacentHTML(`beforeend`,`<option value='-1'>Select a bin</option>`)
      bins.forEach(bin => {
        node.insertAdjacentHTML(`beforeend`,`<option value=${bin.uuid}>${bin.name}</option>`)
      })
    }
  }, [bins])

  const handleCreate = async () => {
    const item = {
      uuid: uuid,
      prototype_uuid: prototype_uuid,
      bin_uuid: bin_uuid,
      in_bin: in_bin
    }

    const itemRes = await fetch('/api/item', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(item),
    })

    if (itemRes.status == 201) {
      console.log('item created successfully')
      Router.push('/item')
    } else {
      console.error('error while creating item')
      set_error(await itemRes.text())
    }
  }

  return(<>
    <h2 className={styles.elementHeader}>Create Category</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error ? <p style={{color: 'red'}}>{error}</p> : null}
        <div className={styles.elementEntryRow}>
          <span className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateUuid}>Generate</button>
          </span>
        </div>
        <div className={styles.elementEntryRow}>
          <label>UUID</label>
          <input type='text'
                  value={uuid}
                  readOnly={true}
                  onChange={e => set_uuid(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Prototype</label>
          <select className={styles.elementSelectDropdown}
                  ref={prototypesRef}
                  value={prototype_uuid}
                  onChange={e => set_prototype_uuid(e.target.value)}>
          </select>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Bin</label>
          <select className={styles.elementSelectDropdown}
                  ref={binsRef}
                  value={bin_uuid}
                  onChange={e => set_bin_uuid(e.target.value)}>
          </select>
        </div>
        <div className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create</button>
        </div>
      </div>
    </section>
  </>)
}

export async function getServerSideProps() {
  let prototypeRes = await fetch(urls.home + 'api/prototype')
  let prototypes = await prototypeRes.json()

  let binsRes = await fetch(urls.home + 'api/bin')
  let bins = await binsRes.json()

  return { props: { prototypes, bins } }
}

export default Index