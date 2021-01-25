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

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} />
  return <img src={image.base64} alt={uuid} />
}

function useBinItems(uuid) {
  const { data, error } = useSWR(`/api/item/byBin/${uuid}`, fetcher)
  return { items: data, itemsLoading: !error && !data, itemsError: error }
}

function ItemsList({uuid}) {
  const { items, itemsLoading, itemsError } = useBinItems(uuid)

  if (itemsLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} />
  if (itemsError) return <FontAwesomeIcon icon={['far', 'exclamation']} />

  return (<>
    {items.map((item, key) => {
      return <p key={key}>{item}</p>
    })}
  </>)
}

const Bin = ({bin}) => {
  const [edit_url, set_edit_url] = useState('')
  const [print_url, set_print_url] = useState('')

  useEffect(() => {
    let editUrl = '/bin/edit/' + bin.uuid
    set_edit_url(editUrl)
    let printUrl = '/bin/print/' + bin.uuid
    set_print_url(printUrl)
  }, [bin])
  
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
      <p>Items</p>
      <ItemsList uuid={bin.uuid}/>
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
      <Link href={print_url}>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Print</button>
      </Link>
      <Link href={edit_url}>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
      </Link>
      <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteBin}>Delete</button>
    </div>
  </div>)
}

export default Bin