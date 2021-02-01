import React, { useEffect, useState, useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import randomIcon from '@components/modules/random/icon/randomIcon'

import styles from '@styles/elements.module.css'

const Index = ({tag, categories}) => {
  const [uuid, set_uuid] = useState('')
  const [category_uuid, set_category_uuid] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [icon, set_icon] = useState('')
  const [error, set_error] = useState('')

  useEffect(() => {
    set_uuid(tag.uuid)
    set_category_uuid(tag.category_uuid)
    set_name(tag.name)
    set_description(tag.description)
    set_icon(tag.icon)
  }, [tag])

  const categoriesRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend', '<option value="-1">Select a category</option>')
      categories.forEach(category => {
        if (category.uuid == category_uuid) {
          node.insertAdjacentHTML('beforeend',`<option value=${category.uuid} selected>${category.name}</option>`)
        } else {
          node.insertAdjacentHTML('beforeend',`<option value=${category.uuid}>${category.name}</option>`)
        }
      })
    }
  }, [categories])

  const generateIcon = () => {
    set_icon(randomIcon())
  }

  const handleUpdate = async () => {
    const tag = {
      uuid: uuid,
      category_uuid: category_uuid,
      name: name,
      description: description,
      icon: icon
    }
    const tagRes = await fetch('/api/group/tag/' + tag.uuid, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(tag)
    })

    if (tagRes.status == 201) {
      console.log('tag updated successfully')
      Router.push('/group/tag')
    } else {
      console.error('error while updating tag')
      set_error(await tagRes.text())
    }
  }

  return(<>
    <h2 className={styles.elementHeader}>Edit Tag</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error ? <p style={{color: 'red'}}>{error}</p> : null}
        <div className={styles.elementEntryRow}>
          <span className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateIcon}>Generate Icon</button>
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
            readOnly={true}/>
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
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let tagRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/tag/' + params.uuid)
  let tag = await tagRes.json()

  let categoriesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
  let categories = await categoriesRes.json()

  return { props: { tag, categories } }
}

export default Index