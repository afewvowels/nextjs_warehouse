import styles from '@styles/elements.module.css'
import Router from 'next/router'
import useSWR from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  return { inUse: data, isLoading: !error && !data, isError: error }
}

function ImageInUse({uuid}) {
  const { inUse, inUseIsLoading, inUseIsError } = useImageInUse(uuid)
  const { image, isLoading, isError } = useImage(uuid)

  if (isLoading || inUseIsLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} />
  if (isError || inUseIsError) return <FontAwesomeIcon icon={['far', 'exclamation']} />
  if (inUse.in_use) {
    return (<span><FontAwesomeIcon icon={['fas', 'check-square']} /><span>In use | </span><span>{(parseFloat(image.base64.toString().length) * .001 * 0.75).toFixed(2)} KB</span></span>)
   } else {
    return (<span><FontAwesomeIcon icon={['fas', 'times-square']} /><span>Not in use | </span><span>{(parseFloat(image.base64.toString().length) * .001 * 0.75).toFixed(2)} KB</span></span>)
   }
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
      <div className={styles.elementImageRow}>
        <ImageInUse uuid={image.uuid}/>
        <button className={`${styles.elementButton} ${styles.elementButtonImageDelete}`} onClick={deleteImage}>Delete</button>
      </div>
      <div className={styles.elementInfoRow}>
        <FoundImage uuid={image.uuid}/>
      </div>
    </div>)
}

export default Image
