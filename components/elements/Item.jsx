import styles from '@styles/elements.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import Link from 'next/link'
import Router from 'next/router'
import { useState } from 'react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useImage(uuid) {
  const { data, error } = useSWR(`/api/image/base64/${uuid}`, fetcher)
  return { image: data, isLoading: !error && !data, isError: error }
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
  const [collapsed, set_collapsed] = useState(true)
  const [check_in_out, set_check_in_out] = useState(item.in_bin)
  const [error_msg, set_error_msg] = useState('')

  
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

  const openItem = () => {
    set_collapsed(false)
  }

  const closeItem = () => {
    set_collapsed(true)
  }
  if (collapsed) {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div className={styles.elementHeaderRow}>
          <FontAwesomeIcon icon={item.bin_icon}/>
          <h3>{item.bin_name}</h3>
        <FontAwesomeIcon icon={['far', 'plus-square']} onClick={openItem} />
        </div>
      </div>
  )} else {
  return(
    <div className={styles.elementEntryRowsWrapper}>
      {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
      <div className={styles.elementHeaderRow}>
        <FontAwesomeIcon icon={item.bin_icon}/>
        <h3>{item.bin_name}</h3>
        <FontAwesomeIcon icon={['far', 'minus-square']} onClick={closeItem} />
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
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={checkInOut}>{(check_in_out ? 'Check Out' : 'Check In')}</button>
        <Link href={`/item/print/${item.uuid}`}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Print</button>
        </Link>
        <Link href={`/item/edit/${item.uuid}`}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`}>Edit</button>
        </Link>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteItem}>Delete</button>
      </div>
    </div>
  )}
}

export default Item
