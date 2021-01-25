import { useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'
import styles from '@styles/elements.module.css'
import Router from 'next/router'
import Link from 'next/link'

const Category = ({category, tags}) => {
  const [tag_names, set_tag_names] = useState([])
  const [edit_url, set_edit_url] = useState('')

  useEffect(() => {
    tags.forEach(tag => {
      if (tag.category_uuid == category.uuid) {
        set_tag_names(tag_names => [...tag_names, tag.name])
      }
    })
    set_edit_url('/group/category/edit/' + category.uuid)
  }, [category])

  const tagNamesRef = useCallback(node => {
    if (node != null) {
      while (node.children.length > 0) {
        node.removeChild()
      }
      tag_names.forEach(name => {
        node.insertAdjacentHTML(`beforeend`,`<li>${name}</li>`)
      })
    }
  }, [tag_names])
  
  const deleteCategory = async () => {
    const delRes = await fetch('/api/group/category/' + category.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log(`delete sucessful`)
      Router.push('/group')
    } else {
      console.error(`error while deleting category`)
    }
  }
  
  return(
    <div className={styles.elementEntryRowsWrapper}>
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={category.icon} />
        <h3>{category.name}</h3>{}
      </div>
      <div className={styles.elementInfoRow}>
        <p>Description</p>
        <p>{category.description}</p>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Tag Names</p>
        <ul ref={tagNamesRef} className={styles.elementListCloud}></ul>
      </div>
      <div className={styles.elementButtonsWrapper}>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteCategory}>Delete</button>
        <Link href={edit_url}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
        </Link>
      </div>
    </div>
  )
}

export default Category