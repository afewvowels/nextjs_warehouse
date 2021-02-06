import React, { useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/elements.module.css'
import Router from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useImage(uuid) {
  const { data, error } = useSWR(`/api/image/base64/${uuid}`, fetcher)
  return { image: data, isLoading: !error && !data, isError: error }
}

function PrototypeImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return (
    <span className={`${styles.statusIconWrapper} ${styles.statusIconWrapperAnimated}`}>
      <FontAwesomeIcon icon={['far', 'atom-alt']} />
    </span>)
  if (isError) return (
    <span className={styles.statusIconWrapper}>
      <FontAwesomeIcon icon={['far', 'exclamation']} />
    </span>)
  return <img src={image.base64} alt={uuid}/>
}

const Prototype = ({prototype, categories, tags, startOpen}) => {
  const [tag_names, set_tag_names] = useState([])
  const [category_name, set_category_name] = useState('')
  const [edit_url, set_edit_url] = useState('')
  const [collapsed, set_collapsed] = useState((startOpen) ? false : true)

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
        node.insertAdjacentHTML('beforeend', `<li>${name}</li>`)
      })
    }
  }, [tag_names])

  const traitsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      while (node.childCount > 0) {
        node.removeChild()
      }
      prototype.traits.forEach(trait => {
        node.insertAdjacentHTML('beforeend', `<li>${trait}</li>`)
      })
    }
  }, [prototype])

  const deletePrototype = async () => {
    const delRes = await fetch('/api/prototype/' + prototype.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log('delete sucessful')
      set_collapsed(true)
      Router.push('/prototype')
    } else {
      console.error('error while deleting prototype')
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
          <FontAwesomeIcon icon={prototype.icon} />
          <h3 className={styles.elementHeaderRowTitle}>{prototype.name}</h3>
          <FontAwesomeIcon icon={['far', 'plus-square']}/>
        </div>
      </div>
    )} else {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div className={`${styles.elementHeaderRow} ${styles.elementHeaderRowCollapsible}`} onClick={closeItem} >
          <FontAwesomeIcon icon={prototype.icon} />
          <h3 className={styles.elementHeaderRowTitle}>{prototype.name}</h3>
          <FontAwesomeIcon icon={['far', 'minus-square']}/>
        </div>
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
        <div className={styles.elementButtonsWrapperGrid}>
          <button className={`${styles.elementButton}`} onClick={deletePrototype}>Delete</button>
          <Link href={edit_url}>
            <button className={`${styles.elementButton}`}>Edit</button>
          </Link>
        </div>
      </div>
    )}
}

export default Prototype
