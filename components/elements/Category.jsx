import React, { useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/elements.module.css'
import Router from 'next/router'
import Link from 'next/link'

const Category = ({category, tags}) => {
  const [tag_names, set_tag_names] = useState([])
  const [edit_url, set_edit_url] = useState('')
  const [collapsed, set_collapsed] = useState(true)

  useEffect(() => {
    set_tag_names([])
    tags.forEach(tag => {
      if (tag.category_uuid == category.uuid) {
        set_tag_names(tag_names => [...tag_names, tag.name])
      }
    })
    set_edit_url('/group/category/edit/' + category.uuid)
  }, [category])

  const tagNamesRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.children.length > 0) {
        node.removeChild()
      }
      tag_names.forEach(name => {
        node.insertAdjacentHTML('beforeend',`<li>${name}</li>`)
      })
    }
  }, [tag_names])

  const deleteCategory = async () => {
    const delRes = await fetch('/api/group/category/' + category.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log('delete sucessful')
      Router.push('/group/category')
    } else {
      console.error('error while deleting category')
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
          <FontAwesomeIcon icon={category.icon} />
          <h3 className={styles.elementHeaderRowTitle}>{category.name}</h3>
          <FontAwesomeIcon icon={['far', 'plus-square']}/>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Tag Names</p>
          <ul ref={tagNamesRef} className={styles.elementListCloud}></ul>
        </div>
      </div>
    )} else {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div className={`${styles.elementHeaderRow} ${styles.elementHeaderRowCollapsible}`} onClick={closeItem} >
          <FontAwesomeIcon icon={category.icon} />
          <h3 className={styles.elementHeaderRowTitle}>{category.name}</h3>
          <FontAwesomeIcon icon={['far', 'minus-square']}/>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Description</p>
          <p>{category.description}</p>
        </div>
        <div className={`${styles.elementInfoRow} ${styles.elementInfoRowIncrement}`}>
          <span>
            <p>Tag Names</p>
            <Link href='/group/tag/add'>
              <span className={styles.elementIncrementWrapper}>
                <FontAwesomeIcon icon={['fas', 'plus']}/>
                <FontAwesomeIcon icon={['fas', 'plus']}/>
              </span>
            </Link>
          </span>
          <ul ref={tagNamesRef} className={styles.elementListCloud}></ul>
        </div>
        <div className={styles.elementButtonsWrapperGrid}>
          <button className={`${styles.elementButton}`} onClick={deleteCategory}>Delete</button>
          <Link href={edit_url}>
            <button className={`${styles.elementButton}`}>Edit</button>
          </Link>
        </div>
      </div>
    )}
}

export default Category
