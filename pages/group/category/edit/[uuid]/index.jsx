import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import randomIcon from '@components/modules/random/icon/randomIcon'

import styles from '@styles/elements.module.css'

const Index = ({category}) => {
  const [uuid, set_uuid] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [icon, set_icon] = useState('')
  const [error, set_error] = useState('')

  useEffect(() => {
    set_uuid(category.uuid)
    set_name(category.name)
    set_description(category.description)
    set_icon(category.icon)
  }, [category])

  const generateIcon = () => {
    set_icon(randomIcon())
  }

  const handleUpdate = async () => {
    const category = {
      uuid: uuid,
      name: name,
      description: description,
      icon: icon
    }

    const categoryRes = await fetch('/api/group/category/' + category.uuid, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(category),
    })

    if (categoryRes.status == 201) {
      console.log('category created successfully')
      Router.push('/group/category')
    } else {
      console.error('error while creating category')
      set_error(await categoryRes.text())
    }
  }
  return(<>
    <h2 className={styles.elementHeader}>Edit Category</h2>
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
  let categoryRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category/' + params.uuid)
  let category = await categoryRes.json()

  return { props : { category } }
}

export default Index