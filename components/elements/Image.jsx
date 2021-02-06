import styles from '@styles/elements.module.css'
import useSWR from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useImage(uuid) {
  const { data, error } = useSWR(`/api/image/base64/${uuid}`, fetcher)
  return { image: data, isLoading: !error && !data, isError: error }
}

function FoundImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return (
    <span className={styles.statusIconWrapperSmall}>
      <FontAwesomeIcon icon={['far', 'atom-alt']} />
    </span>)
  if (isError) return (
    <span className={styles.statusIconWrapperSmall}>
      <FontAwesomeIcon icon={['far', 'exclamation']} />
    </span>)
  return <><img src={image.base64} alt={uuid} /></>
}

function useImageInUse(uuid) {
  const { data, error } = useSWR(`/api/image/inUse/${uuid}`, fetcher)
  return { inUse: data, inUseIsLoading: !error && !data, inUseIsError: error }
}

function ImageInUse({uuid, deleted}) {
  const { inUse, inUseIsLoading, inUseIsError } = useImageInUse(uuid)
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading || inUseIsLoading) return (
    <span className={styles.statusIconWrapperSmall}>
      <FontAwesomeIcon icon={['far', 'atom-alt']} />
    </span>)
  if (isError || inUseIsError) return (
    <span className={styles.statusIconWrapperSmall}>
      <FontAwesomeIcon icon={['far', 'exclamation']} />
    </span>)
  if (image == undefined || image.base64 == undefined) return <p>Image undefined</p>
  if (inUse.in_use) {
    return (<span><FontAwesomeIcon icon={['fas', 'check-square']} /><span>In use</span><span> | </span><span>{(parseFloat(image.base64.toString().length) * .001 * 0.75).toFixed(2)} KB</span></span>)
  } else if (deleted) {
    return (<span><FontAwesomeIcon icon={['fas', 'times-square']} /><span>Deleted</span><span> | </span><span>{(parseFloat(image.base64.toString().length) * .001 * 0.75).toFixed(2)} KB</span></span>)
  } else {
    return (<span><FontAwesomeIcon icon={['fas', 'times-square']} /><span style={{fontWeight: 'bold', color: 'red', textDecoration: 'underline'}}>Not in use</span><span> | </span><span>{(parseFloat(image.base64.toString().length) * .001 * 0.75).toFixed(2)} KB</span></span>)
  }
}

const Image = ({image}) => {
  const [collapsed, set_collapsed] = useState(true)
  const [deleted, set_deleted] = useState(false)

  const deleteImage = async () => {
    const delRes = await fetch('/api/image/' + image.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log('delete sucessful')
      set_collapsed(true)
      set_deleted(true)
      // Router.push('/util/image')
    } else {
      console.error('error while deleting image')
    }
  }

  const openImage = () => {
    set_collapsed(false)
  }

  const closeImage = () => {
    set_collapsed(true)
  }

  if (collapsed) {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div onClick={openImage} style={{cursor: 'pointer'}} className={styles.elementImageRow}>
          <ImageInUse uuid={image.uuid} deleted={deleted}/>
          <span>
            <FontAwesomeIcon icon={['far', 'plus-square']} />
          </span>
        </div>
      </div>)
  } else {
    return(
      <div className={styles.elementEntryRowsWrapper}>
        <div onClick={closeImage} style={{cursor: 'pointer'}} className={styles.elementImageRow}>
          <ImageInUse uuid={image.uuid}/>
          <span>
            <FontAwesomeIcon icon={['far', 'minus-square']} />
          </span>
        </div>
        <div className={styles.elementInfoRow}>
          <div className={styles.elementButtonsWrapperGrid}>
            <button style={{width: '100%', marginTop: '0.333rem', marginBottom: '0.5rem'}} className={`${styles.elementButton} ${styles.elementButtonWide} ${styles.elementButtonImageDelete}`} onClick={deleteImage}>Delete</button>
          </div>
          <FoundImage uuid={image.uuid}/>
        </div>
      </div>)
  }
}

export default Image
