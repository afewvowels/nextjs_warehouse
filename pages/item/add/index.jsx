import React, { useState, useCallback } from 'react'
import Router from 'next/router'
import { v4 as uuidv4 } from 'uuid'
var TinyURL = require('tinyurl')

import styles from '@styles/elements.module.css'

const Index = ({prototypes, bins, categories}) => {
  const [count, set_count] = useState(1)
  const [prototype_uuid, set_prototype_uuid] = useState('')
  const [bin_uuid, set_bin_uuid] = useState('')
  const [category_uuid, set_category_uuid] = useState('')
  const [error, set_error] = useState('')
  const [status, set_status] = useState('')

  const categoriesRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.insertAdjacentHTML('beforeend', '<option value="all">All</option>')
      categories.forEach(category => {
        node.insertAdjacentHTML('beforeend', `<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  const prototypesRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.insertAdjacentHTML('beforeend','<option value="-1">Select a prototype</option>')
      prototypes.forEach(prototype => {
        if (category_uuid == 'all' || category_uuid == prototype.category_uuid){
          node.insertAdjacentHTML('beforeend',`<option value=${prototype.uuid}>${prototype.name}</option>`)
        }
      })
    }
  }, [category_uuid])

  const binsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.insertAdjacentHTML('beforeend','<option value="-1">Select a bin</option>')
      bins.forEach(bin => {
        node.insertAdjacentHTML('beforeend',`<option value=${bin.uuid}>${bin.name}</option>`)
      })
    }
  }, [bins])

  const handleCreate = async () => {
    for (var i = 0; i < count; i++) {
      set_status('Creating item, ' + (i + 1) + ' of ' + count)
      let newUuid = uuidv4()
      let tUrl = await TinyURL.shorten(`${process.env.NEXT_PUBLIC_URL}item/${newUuid}`)
      tUrl = tUrl.substring(8)
      const item = {
        uuid: newUuid,
        prototype_uuid: prototype_uuid,
        bin_uuid: bin_uuid,
        in_bin: true,
        notes: '',
        tinyurl: tUrl
      }

      const itemRes = await fetch('/api/item', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(item),
      })

      if (itemRes.status == 201) {
        console.log('item created successfully')
        set_status('Created item successfully, ' + (i + 1) + ' of ' + count)
      } else {
        console.error('error while creating item')
        set_error(await itemRes.text())
        return
      }
    }

    Router.push('/item')
  }

  return(<>
    <h2 className={styles.elementHeader}>Add Item</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error ? <p style={{color: 'red'}}>{error}</p> : null}
        {status ? <p style={{color: 'green'}}>{status}</p> : null}
        <div className={styles.elementEntryRow}>
          <label>Category</label>
          <select className={styles.elementSelectDropdown}
            ref={categoriesRef}
            value={category_uuid}
            onChange={e => set_category_uuid(e.target.value)}>
          </select>
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
        <div className={styles.elementEntryRow}>
          <label>Number to create</label>
          <input
            type='number'
            value={count}
            onChange={e => set_count(e.target.value)}/>
        </div>
        <div className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create</button>
        </div>
      </div>
    </section>
  </>)
}

export async function getServerSideProps() {
  let prototypeRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/prototype')
  let prototypes = await prototypeRes.json()

  let binsRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/bin')
  let bins = await binsRes.json()

  let categoriesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
  let categories = await categoriesRes.json()

  return { props: { prototypes, bins, categories } }
}

export default Index