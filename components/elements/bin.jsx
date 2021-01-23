import styles from '@styles/elements.module.css'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'

const Bin = ({bin}) => {
  const imageRef = useCallback(node => {
    if (node != null && bin.found_image) {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`, `<img src=${bin.base64} alt=${bin.name}/>`)
    }
  }, [bin])

  const itemsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      if (bin.item_uuids) {
        bin.item_uuids.forEach(item => {
          node.insertAdjacentHTML(`beforeend`, `<li>${item}</li>`)
        })
      }
    }
  }, [bin])

  return(
  <div className={styles.elementEntryRowsWrapper}>
    <div className={styles.elementHeaderRow}>
      <FontAwesomeIcon icon={bin.icon}/>
      <h3>{bin.name}</h3>
    </div>
    <div className={styles.elementInfoRow} ref={imageRef}>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Description</p>
      <p>{bin.description}</p>
    </div>
    {/* <div className={styles.elementInfoRow}>
      <p>UUID</p>
      <p>{bin.uuid}</p>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Readable Name</p>
      <p>{bin.readable_name}</p>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Item UUIDs</p>
      <ul ref={itemsRef}></ul>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Image UUID</p>
      <p>{bin.image_uuid}</p>
    </div> */}
  </div>
  )
}

export async function getServerSideProps({bin}) {
  let base64 = null
  if (bin.image_found) {
    let res = await fetch(urls.home + 'api/image/base64/' + bin.image_uuid)
    let image = await res.json()
    base64 = image.base64
    console.log(base64)
  }

  return { props: { bin, base64 } }
}

export default Bin