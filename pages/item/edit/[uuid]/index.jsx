import styles from '@styles/elements.module.css'
import React, { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import Router from 'next/router'
var TinyURL = require('tinyurl')

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useBin(uuid) {
  const { data, error } = useSWR(`/api/bin/${uuid}`, fetcher)
  return { bin: data, binIsLoading: !error && !data, binIsError: error }
}

function usePrototype(uuid) {
  const { data, error } = useSWR(`/api/prototype/${uuid}`, fetcher)
  return { prototype: data, prototypeIsLoading: !error && !data, prototypeIsError: error }
}

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
  return <img src={image.base64} alt={uuid} />
}

const ViewItem = ({item, bins}) => {
  const { bin } = useBin(item.bin_uuid)
  const { prototype } = usePrototype(item.prototype_uuid)

  const [check_in_out, set_check_in_out] = useState(item.in_bin)
  const [error_msg, set_error_msg] = useState('')
  const [bin_uuid, set_bin_uuid] = useState(item.bin_uuid)
  const [notes, set_notes] = useState(item.notes)
  const [tinyurl, set_tinyurl] = useState(item.tinyurl)

  const deleteItem = async () => {
    const delRes = await fetch(`/api/item/${item.uuid}`, {
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

  const generateTinyUrl = async () => {
    await TinyURL.shorten(`${process.env.NEXT_PUBLIC_URL}item/${item.uuid}`, function(res) {
      set_tinyurl(res.substring(8))
    })
  }

  const updateItem = async () => {
    let itemBody = {
      uuid: item.uuid,
      prototype_uuid: item.prototype_uuid,
      bin_uuid: bin_uuid,
      itemStatus: check_in_out,
      tinyurl: tinyurl
    }

    const itemRes = await fetch('/api/item/' + item.uuid, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemBody)
    })

    if (itemRes.status == 201) {
      console.log('item status changed successfully')
      Router.push('/item')
    } else {
      console.error('error while changing item status')
      set_error_msg(itemRes.text())
    }
  }

  const binsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend','<option value="all">Select a bin</option>')
      bins.forEach(bin => {
        if (bin.uuid == item.bin_uuid) {
          node.insertAdjacentHTML('beforeend',`<option value=${bin.uuid} selected>${bin.name}</option>`)
        } else {
          node.insertAdjacentHTML('beforeend',`<option value=${bin.uuid}>${bin.name}</option>`)
        }
      })
    }
  }, [bins])

  if (!bin || !prototype) return (<>
    <h2 className={styles.elementHeader}>Edit Item</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        <span className={`${styles.statusIconWrapper} ${styles.statusIconWrapperAnimated}`}>
          <FontAwesomeIcon icon={['far', 'atom-alt']} />
        </span>
      </div>
    </section>
  </>)

  return(<>
    <h2 className={styles.elementHeader}>Edit Item</h2>
    <section className={styles.elementWrapper}>
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
        <div className={styles.elementEntryRow}>
          <label>Bin</label>
          <select className={styles.elementSelectDropdown}
            ref={binsRef}
            value={bin_uuid}
            onChange={e => set_bin_uuid(e.target.value)}>
          </select>
        </div>
        <div className={styles.elementEntryRow}>
          <label>TinyURL</label>
          <input
            type='text'
            value={tinyurl}
            readOnly={true}
            onChange={e => set_tinyurl(e.target.value)}/>
        </div>
        <button className={`${styles.elementButton}`} onClick={generateTinyUrl}>TinyURL</button>
        <div className={styles.elementEntryRow}>
          <label>Notes</label>
          <input
            type='text'
            value={notes}
            onChange={e => set_notes(e.target.value)}/>
        </div>
        <div className={styles.elementInfoRow}>
          <p>Item is in bin</p>
          <p>{check_in_out ? 'True' : 'False'}</p>
        </div>
        <div className={styles.elementButtonsWrapperGrid}>
          <button className={`${styles.elementButton}`} onClick={deleteItem}>Delete</button>
          <button className={`${styles.elementButton}`} onClick={updateItem}>Update</button>
        </div>
      </div>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let itemRes = await fetch(`${process.env.NEXT_PUBLIC_URL}api/item/${params.uuid}`)
  let item = await itemRes.json()

  let binsRes = await fetch(`${process.env.NEXT_PUBLIC_URL}api/bin`)
  let bins = await binsRes.json()

  return { props: { item, bins } }
}

export default ViewItem