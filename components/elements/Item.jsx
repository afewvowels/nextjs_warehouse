import styles from '@styles/elements.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import Link from 'next/link'
import Router from 'next/router'
import React, { useState, useEffect } from 'react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useImage(uuid) {
  const { data, error } = useSWR(`/api/image/base64/${uuid}`, fetcher)
  return { image: data, isLoading: !error && !data, isError: error }
}

// function BinImage({uuid, item}) {
//   const { image, isLoading, isError } = useImage(uuid)

//   if (isLoading) return (
//     <span className={`${styles.statusIconWrapper} ${styles.statusIconWrapperAnimated}`}>
//       <FontAwesomeIcon icon={['far', 'atom-alt']} />
//     </span>)
//   if (isError) return (
//     <span className={styles.statusIconWrapper}>
//       <FontAwesomeIcon icon={['far', 'exclamation']} />
//     </span>)
//   return (<Link href={`/bin/${item.bin_uuid}`}><img src={image.base64} alt={uuid} className={styles.elementInfoImage}/></Link>)
// }

function PrototypeImage({uuid, item}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return (
    <span className={`${styles.statusIconWrapper} ${styles.statusIconWrapperAnimated}`}>
      <FontAwesomeIcon icon={['far', 'atom-alt']} />
    </span>)
  if (isError) return (
    <span className={styles.statusIconWrapper}>
      <FontAwesomeIcon icon={['far', 'exclamation']} />
    </span>)
  return (<Link href={`/prototype/${item.prototype_uuid}`}><img src={image.base64} alt={uuid} className={styles.elementInfoImage}/></Link>)
}

const Item = ({item}) => {
  const [collapsed, set_collapsed] = useState(true)
  const [check_in_out, set_check_in_out] = useState()
  const [error_msg, set_error_msg] = useState('')

  useEffect(() => {
    set_check_in_out(item.in_bin)
  }, [item])


  const deleteItem = async () => {
    const delRes = await fetch('/api/item/' + item.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log('delete sucessful')
      Router.push('/item')
    } else {
      console.error('error while deleting item')
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
      console.log('item status changed successfully')
      set_check_in_out(!check_in_out)
      set_error_msg('')
    } else {
      console.error('error while changing item status')
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
        <div className={`${styles.elementHeaderRowItems} ${styles.elementHeaderRowCollapsible}`}>
          <span onClick={checkInOut}>
            {check_in_out ? <FontAwesomeIcon icon={['fas', 'toggle-on']} /> :<FontAwesomeIcon icon={['fas', 'toggle-off']} onClick={checkInOut} />}
            <FontAwesomeIcon className={styles.elementHeaderRowItemIconPrototype} icon={item.prototype_icon} />
          </span>
          <span onClick={openItem}>
            <h3 className={styles.elementHeaderRowTitle}>{item.prototype_name}</h3>
            <FontAwesomeIcon icon={['far', 'plus-square']} />
          </span>
        </div>
      </div>
    )} else {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
        <div className={`${styles.elementHeaderRowItems} ${styles.elementHeaderRowCollapsible}`}>
          <span onClick={checkInOut}>
            {check_in_out ? <FontAwesomeIcon icon={['fas', 'toggle-on']}  onClick={checkInOut} /> : <FontAwesomeIcon icon={['fas', 'toggle-off']} onClick={checkInOut} />}
            <FontAwesomeIcon className={styles.elementHeaderRowItemIconPrototype}  icon={item.prototype_icon}/>
          </span>
          <span onClick={closeItem}>
            <h3 className={styles.elementHeaderRowTitle}>{item.prototype_name}</h3>
            <FontAwesomeIcon icon={['far', 'minus-square']} onClick={closeItem} />
          </span>
        </div>
        <div className={styles.elementInfoRow}>
          <PrototypeImage uuid={item.prototype_image_uuid} item={item}/>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Notes</p>
          <p>{(item.notes) ? (item.notes == '') ? 'None' : item.notes : 'None' }</p>
        </div>
        {/* <div className={styles.elementHeaderRow}>
          <FontAwesomeIcon icon={item.bin_icon}/>
          <h3>{item.bin_name}</h3>
        </div>
        <div className={styles.elementInfoRow}>
          <BinImage uuid={item.bin_image_uuid} item={item}/>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Item is in bin</p>
          <p>{check_in_out ? 'True' : 'False'}</p>
        </div> */}
        <div className={styles.elementButtonsWrapperGrid}>
          <button className={`${styles.elementButton}`} onClick={checkInOut}>{(check_in_out ? 'Check Out' : 'Check In')}</button>
          <Link href={`/item/print/${item.uuid}`}>
            <button className={`${styles.elementButton}`}>Print</button>
          </Link>
          <button className={`${styles.elementButton}`} onClick={deleteItem}>Delete</button>
          <Link href={`/item/edit/${item.uuid}`}>
            <button className={`${styles.elementButton}`}>Edit</button>
          </Link>
        </div>
      </div>
    )}
}

export default Item
