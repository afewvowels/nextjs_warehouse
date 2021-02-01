import styles from '@styles/elements.module.css'
import Router from 'next/router'
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

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} />
  return <><img src={image.base64} alt={uuid} /></>
}

function useImageInUse(uuid) {
  const { data, error } = useSWR(`/api/image/inUse/${uuid}`, fetcher)
  return { inUse: data, inUseIsLoading: !error && !data, inUseIsError: error }
}

function ImageInUse({uuid}) {
  const { inUse, inUseIsLoading, inUseIsError } = useImageInUse(uuid)
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading || inUseIsLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} />
  if (isError || inUseIsError) return <FontAwesomeIcon icon={['far', 'exclamation']} />
  if (image == undefined) return <p>Image undefined</p>
  if (inUse.in_use) {
    return (<span><FontAwesomeIcon icon={['fas', 'check-square']} /><span>In use | </span><span>{(parseFloat(image.base64.toString().length) * .001 * 0.75).toFixed(2)} KB</span></span>)
  } else {
    return (<span><FontAwesomeIcon icon={['fas', 'times-square']} /><span>Not in use | </span><span>{(parseFloat(image.base64.toString().length) * .001 * 0.75).toFixed(2)} KB</span></span>)
  }
}

const Image = ({image}) => {
  const [collapsed, set_collapsed] = useState(true)

  const deleteImage = async () => {
    const delRes = await fetch('/api/image/' + image.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log('delete sucessful')
      Router.push('/util/image')
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
          <ImageInUse uuid={image.uuid}/>
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
