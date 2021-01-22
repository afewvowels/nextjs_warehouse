import styles from '@styles/elements.module.css'
import { useCallback } from 'react'

const Bin = ({bin}) => {
  const itemsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      bin.item_uuids.forEach(item => {
        node.insertAdjacentHTML(`beforeend`, `<li>${item}</li>`)
      })
    }
  }, [bin])

  return(
  <div className={styles.elementEntryRowsWrapper}>
    <div className={styles.elementHeaderRow}>
      <FontAwesomeIcon icon={bin.icon}/>
      <h3>{bin.name}</h3>
    </div>
    <div className={styles.elementInfoRow}>
      <p>Description</p>
      <p>{bin.description}</p>
    </div>
    <div className={styles.elementInfoRow}>
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
    </div>
    <div className={styles.elementInfoRow}>
      <p>UUID</p>
      <p>{bin.uuid}</p>
    </div>
  </div>
  )
}

export default Bin