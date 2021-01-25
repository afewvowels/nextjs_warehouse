import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/elements.module.css'
import Link from 'next/link'

const Tag = ({tag, categories}) => {
  const [category_name, set_category_name] = useState('')
  const [edit_url, set_edit_url] = useState('')

  useEffect(() => {
    categories.forEach(category => {
      if (category.uuid = tag.category_uuid) {
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
      console.log(`delete sucessful`)
      Router.push('/group')
    } else {
      console.error(`error while deleting tag`)
    }
  }

  return(
    <div className={styles.elementEntryRowsWrapper}>
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={tag.icon} />
        <h3>{tag.name}</h3>{}
      </div>
      <div className={styles.elementInfoRow}>
        <p>Category</p>
        <p>{category_name}</p>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Description</p>
        <p>{tag.description}</p>
      </div>
      <div className={styles.elementButtonsWrapper}>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteTag}>Delete</button>
        <Link href={edit_url}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
        </Link>
      </div>
    </div>
  )
}

export default Tag
