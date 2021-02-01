import React, { useState, useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuidv4 } from 'uuid'
import randomIcon from '@components/modules/random/icon/randomIcon'

import styles from '@styles/elements.module.css'

const Index = ({categories}) => {
  const [uuid, set_uuid] = useState('')
  const [category_uuid, set_category_uuid] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [icon, set_icon] = useState('')
  const [error, set_error] = useState('')

  const categoriesRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend', '<option value="-1">Select a category</option>')
      categories.forEach(category => {
        node.insertAdjacentHTML('beforeend',`<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  const generateIdentifiers = () => {
    set_uuid(uuidv4())
    set_icon(randomIcon())
  }

  const handleCreate = async () => {
    const tag = {
      uuid: uuid,
      category_uuid: category_uuid,
      name: name,
      description: description,
      icon: icon
    }

    const tagRes = await fetch('/api/group/tag', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(tag)
    })

    if (tagRes.status == 201) {
      console.log('tag created successfully')
      Router.push('/group/tag')
    } else {
      console.error('error while creating tag')
      set_error(await tagRes.text())
    }
  }

  return(<>
    <h2 className={styles.elementHeader}>Create Tag</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error ? <p style={{color: 'red'}}>{error}</p> : null}
        <div className={styles.elementEntryRow}>
          <span className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateIdentifiers}>Generate</button>
          </span>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Icon</label>
          {icon ? <FontAwesomeIcon icon={icon}/> : <></>}
        </div>
        <div className={styles.elementEntryRow}>
          <label>Category</label>
          <select className={styles.elementSelectDropdown}
            ref={categoriesRef}
            value={category_uuid}
            onChange={e => set_category_uuid(e.target.value)}>
          </select>
        </div>
        <div className={styles.elementEntryRow}>
          <label>UUID</label>
          <input
            type='text'
            value={uuid}
            readOnly={true}
            onChange={e => set_uuid(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Name</label>
          <input
            type='text'
            value={name}
            onChange={e => set_name(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => set_description(e.target.value)}/>
        </div>
        <div className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create</button>
        </div>
      </div>
    </section>
  </>)
}

export async function getServerSideProps() {
  let res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
  let categories = await res.json()

  return { props: { categories } }
}

export default Index