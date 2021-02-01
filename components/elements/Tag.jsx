import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/elements.module.css'
import Link from 'next/link'
import Router from 'next/router'

const Tag = ({tag, categories}) => {
  const [category_name, set_category_name] = useState('')
  const [edit_url, set_edit_url] = useState('')
  const [collapsed, set_collapsed] = useState(true)

  useEffect(() => {
    categories.forEach(category => {
      if (category.uuid == tag.category_uuid) {
        set_category_name(category.name)
        return
      }
    })
    set_edit_url('/group/tag/edit/' + tag.uuid)
  }, [tag])

  const deleteTag = async () => {
    const delRes = await fetch('/api/group/tag/' + tag.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log('delete sucessful')
      Router.push('/group/tag')
    } else {
      console.error('error while deleting tag')
    }
  }

  const openItem = () => {
    set_collapsed(false)
  }

  const closeItem = () => {
    set_collapsed(true)
  }

  if (collapsed) {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div className={`${styles.elementHeaderRow} ${styles.elementHeaderRowCollapsible}`} onClick={openItem} >
          <FontAwesomeIcon icon={tag.icon} />
          <h3 className={styles.elementHeaderRowTitle}>{tag.name}</h3>
          <FontAwesomeIcon icon={['far', 'plus-square']}/>
        </div>
      </div>
    )} else {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div className={`${styles.elementHeaderRow} ${styles.elementHeaderRowCollapsible}`} onClick={closeItem} >
          <FontAwesomeIcon icon={tag.icon} />
          <h3 className={styles.elementHeaderRowTitle}>{tag.name}</h3>
          <FontAwesomeIcon icon={['far', 'minus-square']}/>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Category</p>
          <p>{category_name}</p>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Description</p>
          <p>{tag.description}</p>
        </div>
        <div className={styles.elementButtonsWrapperGrid}>
          <button className={`${styles.elementButton}`} onClick={deleteTag}>Delete</button>
          <Link href={edit_url}>
            <button className={`${styles.elementButton}`}>Edit</button>
          </Link>
        </div>
      </div>
    )}
}

export default Tag
