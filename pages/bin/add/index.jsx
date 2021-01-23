import { useEffect, useState, useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import randomIcon from '@components/modules/random/icon/randomIcon'
const readable = require('readable-url-names')
import { v4 as uuidv4 } from 'uuid'
// import webp from 'webp-converter'
// webp.grant_permission()

import styles from '@styles/elements.module.css'

var generator = new readable()

const Index = () => {
  let fileReader

  const [uuid, set_uuid] = useState('')
  const [readable_name, set_readable_name] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [item_uuids, set_item_uuids] = useState([])
  const [image_base64, set_image_base64] = useState('')
  const [icon, set_icon] = useState(null)
  const [error_msg, set_error_msg] = useState('')

  const imageRef = useCallback(node => {
    if (node != null && image_base64 != '') {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`, `<img src=${image_base64} alt=${name}/>`)
    }
  }, [image_base64])

  const handleCreate = async () => {
    let imageUuid = uuidv4()

    const image = {
      uuid: imageUuid,
      base64: image_base64
    }

    console.log('before image submission attempt')

    const imgRes = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify(image),
    })

    if (imgRes.status == 201) {
      console.log(`image created successfully`)
    } else {
      console.error(`error while creating image`)
    }

    console.log('after image submission attempt')

    const bin = {
      uuid: uuid,
      readable_name: readable_name,
      name: name,
      description: description,
      item_uuids: [],
      image_uuid: imageUuid,
      icon: icon
    }

    console.log('before bin submission attempt')
    
    const binRes = await fetch('/api/bin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bin),
    })

    console.log('after bin submission attempt')

    if (binRes.status == 201) {
      console.log(`bin created successfully`)
      Router.replace('/bin')
    } else {
      set_error_msg(await binRes.text())
    }
  }

  const handleImageRead = () => {
    const image = fileReader.result
    set_image_base64(image)
  }

  const handleImageUpload = (image) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleImageRead
    fileReader.readAsDataURL(image)
    // fileReader.onloadend = function() {
      // let base64 = fileReader.readAsDataURL(file)
      // let resizedBase64 = ''
      // resizedBase64 = resizeImage(base64)
      // let webpBase64 = webp.str2webpstr(resizedBase64, 'jpg', '-q 65')
      // let webpBase64 = webp.str2webpstr(base64, 'jpg', '-q 65')
      // set_image_base64(base64)
    // }
  }

  const resizeImage = (base64str, maxWidth = 500, maxHeight = 500) => {
    let img = new Image()
    img.src = base64str
    img.onload = () => {
      let canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width
          width = maxWidth
        } else {
          height = maxHeight
          width *= maxHeight / height
        }
      }

      canvas.height = height
      canvas.width = width
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      console.log('data url resized to: ' + canvas.toDataURL())
      return canvas.toDataURL()
    }
  }

  function generateIdentifiers() {
    let icon = randomIcon()
    set_icon(icon)
    set_uuid(uuidv4())
    set_readable_name(generator.generate())
  }

  return(
    <>
      <h2 className={styles.elementHeader}>Add Bin</h2>
      <section className={styles.elementWrapper}>
        <div className={styles.elementEntryRowsWrapper}>
          {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
          <div className={styles.elementEntryRow}>
            <span className={styles.elementButtonsWrapper}>
              <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateIdentifiers}>Generate</button>
            </span>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Icon</label>
            {icon ? <FontAwesomeIcon icon={icon}/> : <></>}
          </div>
          <div className={styles.elementEntryRow}>
            <label>UUID</label>
            <input type='text'
                    value={uuid}
                    readOnly={true}
                    onChange={e => set_uuid(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Readable Name</label>
            <input type='text'
                    value={readable_name}
                    readOnly={true}
                    onChange={e => set_readable_name(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Name</label>
            <input type='text'
                    value={name}
                    onChange={e => set_name(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Description</label>
            <input type='text'
                    value={description}
                    onChange={e => set_description(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <div ref={imageRef} className={styles.elementImageWrapper}></div>
            <label>Image</label>
            <input type='file'
                    multiple={false}
                    accept='image/jpeg'
                    onChange={e => handleImageUpload(e.target.files[0])}/>
          </div>
          <div className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create</button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Index