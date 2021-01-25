import styles from '@styles/elements.module.css'
import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'
import useSWR from 'swr'
import Link from 'next/link'
import Router from 'next/router'

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

  if (isLoading) return <p>...Loading image...</p>
  if (isError) return <p>Error loading image...</p>
  return <img src={image.base64} alt={uuid} />
}

function PrototypeImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return <p>...Loading image...</p>
  if (isError) return <p>Error loading image...</p>
  return <img src={image.base64} alt={uuid}/>
}

const ViewItem = ({item}) => {
  const { bin, binIsLoading, binIsError } = useBin(item.bin_uuid)
  const { prototype, prototypeIsLoading, prototypeIsError } = usePrototype(item.prototype_uuid)

  const [check_in_out, set_check_in_out] = useState(item.in_bin)
  const [error_msg, set_error_msg] = useState('')
  
  const deleteItem = async () => {
    const delRes = await fetch(`/api/item/${item.uuid}`, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log(`delete sucessful`)
      Router.push('/item')
    } else {
      console.error(`error while deleting item`)
    }
  }

  const checkInOut = async () => {
    let itemStatus = {
      in_bin: !check_in_out
    }

    const checkRes = await fetch('/api/item/checkInOut/' + item.uuid, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemStatus)
    })

    if (checkRes.status == 201) {
      console.log(`item status changed successfully`)
      set_check_in_out(!check_in_out)
      set_error_msg('')
    } else {
      console.error(`error while changing item status`)
      set_error_msg(checkRes.text())
    }
  }

  if (!bin || !prototype) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />

  return(
    <div className={styles.elementEntryRowsWrapper}>
      {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
      <div className={styles.elementButtonsWrapper}>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={checkInOut}>{(check_in_out ? 'Check out' : 'Check in')}</button>
      </div>
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={bin.icon}/>
        <h3>{bin.name}</h3>
      </div>
      <div className={styles.elementInfoRow}>
        <BinImage uuid={bin.image_uuid}/>
      </div>
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={prototype.icon}/>
        <h3>{prototype.name}</h3>
      </div>
      <div className={styles.elementInfoRow}>
        <PrototypeImage uuid={prototype.image_uuid}/>
      </div>
      <div className={styles.elementInfoRow}>
        <p>Item is in bin</p>
        <p>{check_in_out ? 'True' : 'False'}</p>
      </div>
      <div className={styles.elementButtonsWrapper}>
        <Link href='/item'>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
        </Link>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteItem}>Delete</button>
      </div>
    </div>
  )
}

export default ViewItem