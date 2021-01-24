import styles from '@styles/elements.module.css'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'
import Link from 'next/link'
import Router from 'next/router'
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

function BinImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} size='sm' />
  return <img src={image.base64} alt={uuid} />
}

const Bin = ({bin}) => {
  console.log('bin', bin)
  const [edit_url, set_edit_url] = useState('')
  const [bin_items, set_bin_items] = useState(null)
  const [prototypes, set_prototypes] = useState(null)
  const [prototype_names, set_prototype_names] = useState([])
  const [prototype_counts, set_prototype_counts] = useState({})

  useEffect(async () => {
    let editUrl = '/bin/edit/' + bin.uuid
    set_edit_url(editUrl)
    set_prototypes(null)
    set_bin_items(null)
    await fetch('/api/prototype')
      .then(res => res.json())
      .then(data => set_prototypes(data))
    await fetch('/api/item/byBin/' + bin.uuid)
      .then(res => res.json())
      .then(data => set_bin_items(data))

    bin_items.forEach(item => {
      prototypes.forEach(prototype => {
        if (item.prototype_uuid == prototype.uuid) {
          set_prototype_names(prototype_names => [...prototype_names, prototype.name])
          return
        }
      })
    })

    let count = {}
    prototype_names.forEach(function(i) { count[i] = (count[i] || 0 ) + 1})
    console.log('prototype count', count)
    set_prototype_counts(count)
  }, [bin])

  const itemsRef = useCallback(node => {
    if (node != null && bin_items && prototypes) {
      node.innerHTML = ''
      // console.log('prototype_counts arr', prototype_counts)
      if (prototype_counts.length > 0) {
        prototype_counts.forEach(item => {
          node.insertAdjacentHTML(`beforeend`, `<li>${item}</li>`)
        })
      }
    }
  }, [prototype_counts])
  
  const deleteBin = async () => {
    const delRes = await fetch('/api/bin/' + bin.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log(`delete sucessful`)
      Router.push('/bin')
    } else {
      console.error(`error while deleting bin`)
    }
  }

  return(
  <div className={styles.elementEntryRowsWrapper}>
    <div className={styles.elementHeaderRow}>
      <FontAwesomeIcon icon={bin.icon}/>
      <h3>{bin.name}</h3>
    </div>
    <div className={styles.elementInfoRow}>
      <BinImage uuid={bin.image_uuid}/>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Description</p>
      <p>{bin.description}</p>
    </div>
    <div className={styles.elementButtonsWrapper}>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Item UUIDs</p>
      <ul ref={itemsRef}></ul>
    </div>
    {/* <div className={styles.elementInfoRow}>
      <p>UUID</p>
      <p>{bin.uuid}</p>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Readable Name</p>
      <p>{bin.readable_name}</p>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Image UUID</p>
      <p>{bin.image_uuid}</p>
    </div> */}
    <div className={styles.elementButtonsWrapper}>
      <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteBin}>Delete</button>
      <Link href={edit_url}>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
      </Link>
    </div>
  </div>
  )
}

export default Bin