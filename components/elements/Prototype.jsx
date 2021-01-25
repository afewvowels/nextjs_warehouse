import { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'
import styles from '@styles/elements.module.css'
import Router from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useImage(uuid) {
  const { data, error } = useSWR(`/api/image/base64/${uuid}`, fetcher)

  return {
    image: data,
    isLoading: !error && !data,
    isError: error
  }
}

function PrototypeImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} size='sm' />
  return <img src={image.base64} alt={uuid}/>
}

const Prototype = ({prototype, categories, tags}) => {
  console.log('prototype')
  console.log(prototype)
  const [tag_names, set_tag_names] = useState([]);
  const [category_name, set_category_name] = useState('')
  const [edit_url, set_edit_url] = useState('')

  useEffect(() => {
    set_tag_names([])
    prototype.tag_uuids.forEach(uuid => {
      tags.forEach(tag => {
        if (tag.uuid == uuid) {
          set_tag_names(tag_names => [...tag_names, tag.name])
          return
        }
      })
    })

    categories.forEach(category => {
      if (category.uuid == prototype.category_uuid) {
        set_category_name(category.name)
        return
      }
    })

    set_edit_url('/prototype/edit/' + prototype.uuid)
  }, [prototype, tags])

  const tagsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      tag_names.forEach(name => {
        node.insertAdjacentHTML(`beforeend`, `<li>${name}</li>`)
      })
    }
  }, [prototype])

  const traitsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      prototype.traits.forEach(trait => {
        node.insertAdjacentHTML(`beforeend`, `<li>${trait}</li>`)
      })
    }
  }, [prototype])
  
  const deletePrototype = async () => {
    const delRes = await fetch('/api/prototype/' + prototype.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log(`delete sucessful`)
      Router.push('/prototype')
    } else {
      console.error(`error while deleting prototype`)
    }
  }

  return(
    <div className={styles.elementEntryRowsWrapper}>
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={prototype.icon} />
        <h3>{prototype.name}</h3>{}
      </div>
      {/* <div className={styles.elementInfoRow} ref={imageRef}>
      </div> */}
      <div className={styles.elementInfoRow}>
        <PrototypeImage uuid={prototype.image_uuid} />
      </div>
      <div className={styles.elementInfoRow}>
        <p>Category</p>
        <p>{category_name}</p>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Name</p>
        <p>{prototype.name}</p>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Description</p>
        <p>{prototype.description}</p>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Traits</p>
        <ul ref={traitsRef} className={styles.elementListBullets}></ul>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Tags</p>
        <ul ref={tagsRef} className={styles.elementListCloud}></ul>
      </div>
      <div className={styles.elementButtonsWrapper}>
        <Link href={edit_url}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
        </Link>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deletePrototype}>Delete</button>
      </div>
    </div>
  )
}

export default Prototype
