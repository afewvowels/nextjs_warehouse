import { useEffect, useState, useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'

import randomIcon from '@components/modules/random/icon/randomIcon'
const readable = require('readable-url-names')
import { v4 as uuidv4 } from 'uuid'

import styles from '@styles/elements.module.css'

var generator = new readable()

const Index = ({bin, image}) => {
  let fileReader

  const [uuid, set_uuid] = useState('')
  const [readable_name, set_readable_name] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [item_uuids, set_item_uuids] = useState([])
  const [image_base64, set_image_base64] = useState('')
  const [icon, set_icon] = useState(null)
  const [error_msg, set_error_msg] = useState('')

  useEffect(() => {
    set_uuid(bin.uuid)
    set_readable_name(bin.readable_name)
    set_name(bin.name)
    set_description(bin.description)
    set_item_uuids(bin.item_uuids)
    set_image_base64(image.base64)
    set_icon(bin.icon)
  }, [bin])

  const imageRef = useCallback(node => {
    if (node != null && image_base64 != '') {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`, `<img src=${image_base64} alt=${name}/>`)
    }
  }, [image_base64])

  const generateIcon = () => {
    let newIcon = randomIcon()
    set_icon(newIcon)
  }

  const handleImageRead = () => {
    const img = fileReader.result
    console.log(img)
    set_image_base64(img)
  }

  const handleImageUpload = (newImg) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleImageRead
    fileReader.readAsDataURL(newImg)
  }

  const handleUpdate = async () => {
    let imageUuid

    if (image.base64 == image_base64) {
      console.log('image has not changed, not uploading new image')
      imageUuid = image.uuid
    } else {
      console.log('image is new, uploading new image')
      imageUuid = uuidv4()

      const image = {
        uuid: imageUuid,
        base64: image_base64
      }
  
      const imgRes = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(image)
      })
  
      if (imgRes.status == 201) {
        console.log(`image created successfully`)
      } else {
        console.error(`error while creating image`)
      }
    }

    const bin = {
      uuid: uuid,
      readable_name: readable_name,
      name: name,
      description: description,
      item_uuids: item_uuids,
      image_uuid: imageUuid,
      icon: icon
    }

    const binRes = await fetch('/api/bin/' + bin.uuid, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(bin)
    })

    if (binRes.status == 201) {
      console.log(`bin created successfully`)
      Router.replace('/bin')
    } else {
      set_error_msg(await binRes.text())
    }
  }

  return(<>
    <h2 className={styles.elementHeader}>Edit Bin</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
        <div className={styles.elementEntryRow}>
          <label>Icon</label>
          {icon ? <FontAwesomeIcon icon={icon}/> : <></>}
        </div>
        <div className={styles.elementEntryRow}>
          <span className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateIcon}>Generate Icon</button>
          </span>
        </div>
        <div className={styles.elementEntryRow}>
          <label>UUID</label>
          <input type='text'
                  value={uuid}
                  readOnly={true}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Readable Name</label>
          <input type='text'
                  value={readable_name}
                  readOnly={true}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Name</label>
          <input type='text'
                 value={name}
                 onChange={e => set_name(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Description</label>
          <textarea value={description}
                    onChange={e => set_description(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <div ref={imageRef} className={styles.elementImageWrapper}></div>
          <label>Image</label>
          <input type='file'
                  multiple={false}
                  accept='image/jpeg,image/webp,image/png'
                  onChange={e => handleImageUpload(e.target.files[0])}/>
        </div>
        <div className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let binRes = await fetch(urls.home + 'api/bin/' + params.uuid)
  let bin = await binRes.json()

  let imageRes = await fetch(urls.home + 'api/image/' + bin.image_uuid)
  let image = await imageRes.json()

  return { props: { bin, image } }
}

export default Index