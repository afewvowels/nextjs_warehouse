import styles from '@styles/elements.module.css'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import Router from 'next/router'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useImage(uuid) {
  const { data, error } = useSWR(`/api/image/base64/${uuid}`, fetcher)
  return { image: data, isLoading: !error && !data, isError: error }
}

function BinImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return (
    <span className={`${styles.statusIconWrapper} ${styles.statusIconWrapperAnimated}`}>
      <FontAwesomeIcon icon={['far', 'atom-alt']} />
    </span>)
  if (isError) return (
    <span className={styles.statusIconWrapper}>
      <FontAwesomeIcon icon={['far', 'exclamation']} />
    </span>)
  return <img src={image.base64} alt={uuid} />
}

function useBinItems(uuid) {
  const { data, error } = useSWR(`/api/item/byBin/${uuid}`, fetcher)
  return { items: data, itemsLoading: !error && !data, itemsError: error }
}

function ItemsList({uuid}) {
  const { items, itemsLoading, itemsError } = useBinItems(uuid)

  if (itemsLoading) return <p>Loading items in bin...</p>
  if (itemsError) return <p>Error loading items</p>

  items.sort()

  return (<>
    {items.map((item, key) => {
      {if (item.length == 3) {
        return <p key={key}><span style={{fontWeight: 'bold'}}>{item[1]}/{item[2]}</span> - {item[0]}</p>
      } else {
        return <p key={key}>{item}</p>
      }}
    })}
  </>)
}

const Bin = ({bin}) => {
  const [edit_url, set_edit_url] = useState('')
  const [print_url, set_print_url] = useState('')
  const [collapsed, set_collapsed] = useState(true)

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
      console.log('delete sucessful')
      Router.push('/bin')
    } else {
      console.error('error while deleting bin')
    }
  }

  const openItem = () => {
    set_collapsed(false)
  }

  const closeItem = () => {
    set_collapsed(true)
  }

  const collapsedHtml = () => {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div className={`${styles.elementHeaderRow} ${styles.elementHeaderRowCollapsible}`} onClick={openItem} >
          <FontAwesomeIcon icon={bin.icon}/>
          <h3 className={styles.elementHeaderRowTitle}>{bin.name}</h3>
          <FontAwesomeIcon icon={['far', 'plus-square']}/>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Description</p>
          <p>{bin.description}</p>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Items</p>
          <ItemsList uuid={bin.uuid}/>
        </div>
      </div>
    )
  }

  const openHtml = () => {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div className={`${styles.elementHeaderRow} ${styles.elementHeaderRowCollapsible}`} onClick={closeItem} >
          <FontAwesomeIcon icon={bin.icon}/>
          <h3 className={styles.elementHeaderRowTitle}>{bin.name}</h3>
          <FontAwesomeIcon icon={['far', 'minus-square']}/>
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
        <div className={styles.elementButtonsWrapperGrid}>
          <Link href={print_url}>
            <button className={`${styles.elementButton}`}>Print</button>
          </Link>
          <Link href={`/bin/viewItems/${bin.uuid}`}>
            <button className={`${styles.elementButton}`}>Items</button>
          </Link>
          <button className={`${styles.elementButton}`} onClick={deleteBin}>Delete</button>
          <Link href={edit_url}>
            <button className={`${styles.elementButton}`}>Edit</button>
          </Link>
        </div>
      </div>)
  }

  return (collapsed) ? collapsedHtml() : openHtml()
}

export default Bin
