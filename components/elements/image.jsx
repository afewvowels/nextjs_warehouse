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

function FoundImage({uuid}) {
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading) return <p>...Loading image...</p>
  if (isError) return <p>Error loading image...</p>
  return <img src={image.base64} alt={uuid} />
}

function useImageInUse(uuid) {
  const { data, error } = useSWR(`/api/image/inUse/${uuid}`, fetcher)

  return {
    inUse: data,
    isLoading: !error && !data,
    isError: error
  }
}

function ImageInUse({uuid}) {
  const { inUse, isLoading, isError } = useImageInUse(uuid)

  if (isLoading) return <p>...Loading image in use status...</p>
  if (isError) return <p>Error loading image in use status...</p>
  return (inUse.in_use) ? <p>In use</p> : <p>Not in use</p>
}

const Image = ({image}) => {
  const deleteImage = async () => {
    const delRes = await fetch('/api/image/' + image.uuid, {
      method: 'DELETE',
    })

    if (delRes.status == 201) {
      console.log(`delete sucessful`)
      Router.push('/image')
    } else {
      console.error(`error while deleting image`)
    }
  }
  
  return(
    <div className={styles.elementEntryRowsWrapper}>
      <div className={styles.elementInfoRow}>
        <FoundImage uuid={image.uuid}/>
        <ImageInUse uuid={image.uuid}/>
      </div>
      <div className={styles.elementButtonsWrapper}>
        <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={deleteImage}>Delete</button>
      </div>
    </div>)
}

export default Image