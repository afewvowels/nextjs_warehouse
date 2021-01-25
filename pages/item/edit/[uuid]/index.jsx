import styles from '@styles/elements.module.css'
import { useState, useCallback, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import Link from 'next/link'
import Router from 'next/router'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useBins() {
  const { data, error } = useSWR(`/api/bin`, fetcher)
  return { bins: data, binsIsLoading: !error && !data, binsIsError: error }
}

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

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} size='sm' />
  return <img src={image.base64} alt={uuid} />
}

function PrototypeImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} size='sm' />
  return <img src={image.base64} alt={uuid} />
}

const ViewItem = ({item, bins}) => {
  const { bin, binIsLoading, binIsError } = useBin(item.bin_uuid)
  const { prototype, prototypeIsLoading, prototypeIsError } = usePrototype(item.prototype_uuid)


  const [check_in_out, set_check_in_out] = useState(item.in_bin)
  const [error_msg, set_error_msg] = useState('')
  const [bin_uuid, set_bin_uuid] = useState(item.bin_uuid)
  
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

  const updateItem = async () => {
    let itemBody = {
      uuid: item.uuid,
      prototype_uuid: item.prototype_uuid,
      bin_uuid: bin_uuid,
      itemStatus: check_in_out
    }

    const itemRes = await fetch('/api/item/' + item.uuid, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemBody)
    })

    if (itemRes.status == 201) {
      console.log(`item status changed successfully`)
      Router.push('/item')
    } else {
      console.error(`error while changing item status`)
      set_error_msg(checkRes.text())
    }
  }

  const binsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`,`<option value='all'>Select a bin</option>`)
      bins.forEach(bin => {
        if (bin.uuid == item.bin_uuid) {
          node.insertAdjacentHTML(`beforeend`,`<option value=${bin.uuid} selected>${bin.name}</option>`)
        } else {
          node.insertAdjacentHTML(`beforeend`,`<option value=${bin.uuid}>${bin.name}</option>`)
        }
      })
    }
  }, [bins])

  if (!bin || !prototype) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />

  return(<>
    <h2 className={styles.elementHeader}>Create Tag</h2>
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
        <div className={styles.elementInfoRow}>
          <p>Item is in bin</p>
          <p>{check_in_out ? 'True' : 'False'}</p>
        </div>
        <div className={styles.elementButtonsWrapper}>
          <Link href='/item'>
            <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={updateItem}>Update</button>
          </Link>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteItem}>Delete</button>
        </div>
      </div>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let itemRes = await fetch(`${process.env.URL}api/item/${params.uuid}`)
  let item = await itemRes.json()

  let binsRes = await fetch(`${process.env.URL}api/bin`)
  let bins = await binsRes.json()

  return { props: { item, bins } }
}

export default ViewItem