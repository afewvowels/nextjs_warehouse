import React, { useState, useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
var TinyURL = require('tinyurl')
import Compressor from 'compressorjs'
import randomWords from '@components/modules/random/urls/randomWords'
import { isMobile } from 'react-device-detect'

import randomIcon from '@components/modules/random/icon/randomIcon'
import { v4 as uuidv4 } from 'uuid'

import styles from '@styles/elements.module.css'

const Index = () => {
  let fileReader

  const [uuid, set_uuid] = useState('')
  const [readable_name, set_readable_name] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [image_base64, set_image_base64] = useState('')
  const [icon, set_icon] = useState(null)
  const [tinyurl, set_tinyurl] = useState('')
  const [error_msg, set_error_msg] = useState('')

  const imageRef = useCallback(node => {
    if (node != null && image_base64 != '') {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend', `<img src=${image_base64} alt=${name}/>`)
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
      console.log('image created successfully')
    } else {
      console.error('error while creating image')
    }

    console.log('after image submission attempt')

    const bin = {
      uuid: uuid,
      readable_name: readable_name,
      name: name,
      description: description,
      item_uuids: [],
      image_uuid: imageUuid,
      icon: icon,
      tinyurl: tinyurl
    }

    console.log('before bin submission attempt')

    const binRes = await fetch('/api/bin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bin),
    })

    console.log('after bin submission attempt')

    if (binRes.status == 201) {
      console.log('bin created successfully')
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
    const mime = (isMobile) ? 'image/jpeg' : 'image/webp'
    new Compressor(image, {
      maxWidth: 780,
      maxHeight: 780,
      minWidth: 100,
      minHeight: 100,
      quality: 0.7,
      mimeType: mime,
      success(result) {
        fileReader = new FileReader()
        fileReader.readAsDataURL(result)
        fileReader.onloadend = handleImageRead
      }
    })
  }

  async function generateIdentifiers() {
    let newUuid = uuidv4()
    let icon = randomIcon()
    let bin_name = await randomWords(3)
    set_icon(icon)
    set_uuid(newUuid)
    set_readable_name(bin_name)
    set_name(bin_name)
    await TinyURL.shorten(`${process.env.NEXT_PUBLIC_URL}bin/viewItems/${newUuid}`, function(res) {
      set_tinyurl(res.substring(8))
    })
  }

  return(
    <>
      <Head>
        <title>Add | Bin | Inventory</title>
      </Head>
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
            <label>TinyURL</label>
            <input
              type='text'
              value={tinyurl}
              readOnly={true}
              onChange={e => set_tinyurl(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>UUID</label>
            <input
              type='text'
              value={uuid}
              readOnly={true}
              onChange={e => set_uuid(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Readable Name</label>
            <input
              type='text'
              value={readable_name}
              readOnly={true}
              onChange={e => set_readable_name(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Name</label>
            <input
              type='text'
              value={name}
              onChange={e => set_name(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => set_description(e.target.value)}/>
          </div>
          <div className={styles.elementEntryRow}>
            <div ref={imageRef} className={styles.elementImageWrapper}></div>
            <label>Image</label>
            <input
              type='file'
              multiple={false}
              accept='image/*'
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