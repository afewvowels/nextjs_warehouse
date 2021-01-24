import styles from '@styles/elements.module.css'
import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useBin(uuid) {
  const { data, error } = useSWR(`/api/bin/${uuid}`, fetcher)

  return {
    bin: data,
    isLoading: !error && !data,
    isError: error
  }
}

function usePrototype(uuid) {
  const { data, error } = useSWR(`/api/prototype/${uuid}`, fetcher)

  return {
    prototype: data,
    isLoading: !error && !data,
    isError: error
  }
}

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

function PrototypeImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} size='sm' />
  return <img src={image.base64} alt={uuid}/>
}

const Item = ({item}) => {
  const deleteItem = async () => {
    const delRes = await fetch('/api/item/' + item.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log(`delete sucessful`)
      Router.push('/item')
    } else {
      console.error(`error while deleting item`)
    }
  }

  return(
    <div className={styles.elementEntryRowsWrapper}>
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={item.bin_icon}/>
        <h3>{item.bin_name}</h3>
      </div>
      <div className={styles.elementInfoRow}>
        <BinImage uuid={item.bin_image_uuid}/>
      </div>
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={item.prototype_icon}/>
        <h3>{item.prototype_name}</h3>
      </div>
      <div className={styles.elementInfoRow}>
        <PrototypeImage uuid={item.prototype_image_uuid}/>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Item is in bin</p>
        <p>{item.in_bin ? 'True' : 'False'}</p>
      </div>
      <div className={styles.elementButtonsWrapper}>
        <Link href={`/item/print/${item.uuid}`}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Print</button>
        </Link>
        <Link href={`/item/${item.uuid}`}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
        </Link>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteItem}>Delete</button>
      </div>
    </div>
  )
}

export default Item