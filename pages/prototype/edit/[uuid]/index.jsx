import React, { useState, useCallback, useEffect } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import randomIcon from '@components/modules/random/icon/randomIcon'
import { v4 as uuidv4 } from 'uuid'
import Compressor from 'compressorjs'
import { isMobile } from 'react-device-detect'

import styles from '@styles/elements.module.css'

const Index = ({prototype, image, categories, tags}) => {
  let fileReader

  const [uuid, set_uuid] = useState('')
  const [readable_name, set_readable_name] = useState('')
  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [traits, set_traits] = useState([])
  const [new_trait, set_new_trait] = useState('')
  const [category_uuid, set_category_uuid] = useState('')
  const [tag_uuids, set_tag_uuids] = useState([])
  const [new_tag, set_new_tag] = useState(-1)
  const [image_base64, set_image_base64] = useState('')
  const [icon, set_icon] = useState('')
  const [error_msg, set_error_msg] = useState('')

  useEffect(() => {
    set_uuid(prototype.uuid)
    set_readable_name(prototype.readable_name)
    set_name(prototype.name)
    set_description(prototype.description)
    set_traits(prototype.traits)
    set_category_uuid(prototype.category_uuid)
    set_tag_uuids(prototype.tag_uuids)
    set_image_base64(image.base64)
    set_icon(prototype.icon)
  }, [prototype, image])

  const categoriesRef = useCallback(node => {
    if (node != null && categories != null) {
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend','<option value="-1">Select a category</option>')
      categories.forEach((category) => {
        if (category.uuid == category_uuid) {
          node.insertAdjacentHTML('beforeend',`<option value=${category.uuid} selected>${category.name}</option>`)
        } else {
          node.insertAdjacentHTML('beforeend',`<option value=${category.uuid}>${category.name}</option>`)
        }
      })
    }
  }, [categories])

  const tagSelectRef = useCallback(node => {
    if (node != null && tags != null) {
      while (node.childCount > 0) {
        node.removeChild()
      }
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend','<option value="-1">Select a tag</option>')
      tags.forEach((tag) => {
        if (tag.category_uuid == category_uuid) {
          node.insertAdjacentHTML('beforeend',`<option value=${tag.uuid}>${tag.name}</option>`)
        }
      })
    }
  }, [category_uuid])

  const tagsRef = useCallback(node => {
    if (node != null && tag_uuids.length != undefined) {
      node.innerHTML = ''
      tag_uuids.forEach(tag => {
        tags.forEach(propTag => {
          if (propTag.uuid == tag) {
            node.insertAdjacentHTML('beforeend', `<li>${propTag.name}</li>`)
            return
          }
        })
      })
    }
  }, [tag_uuids])

  const imageRef = useCallback(node => {
    if (node != null && image_base64 != '') {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend',`<img src=${image_base64} alt=${name}/>`)
    }
  }, [image_base64])

  const traitsRef = useCallback(node => {
    if (node != null && traits.length != undefined) {
      node.innerHTML = ''
      traits.forEach(trait => {
        node.insertAdjacentHTML('beforeend', `<li>${trait}</li>`)
      })
    }
  }, [traits])

  const addNewTrait = () => {
    set_traits(traits => [...traits, new_trait])
    set_new_trait('')
  }

  const addNewTag = () => {
    set_tag_uuids(tag_uuids => [...tag_uuids, new_tag])
    set_new_tag('')
  }

  const generateIcon = () => {
    set_icon(randomIcon())
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

  const clearTags = () => {
    set_tag_uuids([])
  }

  const clearTraits = () => {
    set_traits([])
  }

  const handleUpdate = async () => {
    let imageUuid

    if (image_base64 == image.base64) {
      console.log('image has not changed not updating')
      imageUuid = image.uuid
    } else {
      console.log('new image detected, uploading to database')
      imageUuid = uuidv4()

      const image = {
        uuid: imageUuid,
        base64: image_base64
      }

      const imageRes = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(image),
      })

      if (imageRes.status == 201) {
        console.log('image created successfully')
      } else {
        console.error('error while creating image')
      }
    }

    const prototype = {
      uuid: uuid,
      readable_name: readable_name,
      name: name,
      description: description,
      traits: traits,
      category_uuid: category_uuid,
      tag_uuids: tag_uuids,
      image_uuid: imageUuid,
      icon: icon
    }

    const prototypeRes = await fetch('/api/prototype/' + prototype.uuid, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify(prototype),
    })

    if (prototypeRes.status == 201) {
      console.log('prototype created successfully')
      Router.replace('/prototype')
    } else {
      console.error('error while creating prototype')
      set_error_msg(await prototypeRes.text())
    }
  }

  return(<>
    <h2 className={styles.elementHeader}>Edit Prototype</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
        <div className={styles.elementEntryRow}>
          <label>Icon</label>
          {icon ? <FontAwesomeIcon icon={icon}/> : <></>}
        </div>
        <span className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateIcon}>Generate Icon</button>
        </span>
        <div className={styles.elementEntryRow}>
          <label>UUID</label>
          <input
            type='text'
            value={uuid}
            readOnly={true}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Readable Name</label>
          <input
            type='text'
            value={readable_name}
            readOnly={true}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Category</label>
          <select className={styles.elementSelectDropdown}
            ref={categoriesRef}
            value={category_uuid}
            onChange={e => set_category_uuid(e.target.value)}>
          </select>
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
        <div className={`${styles.elementEntryRow} ${styles.elementEntryWithDropdown}`}>
          <label>Traits</label>
          <ul ref={traitsRef} className={styles.elementListBullets}></ul>
          <input
            type='text'
            value={new_trait}
            onChange={e => set_new_trait(e.target.value)}/>
          <span className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton}`} onClick={clearTraits}>Delete Traits</button>
            <button className={`${styles.elementButton}`} onClick={addNewTrait}>Add Trait</button>
          </span>
        </div>
        <div className={`${styles.elementEntryRow} ${styles.elementEntryWithDropdown}`}>
          <label>Tags</label>
          <ul ref={tagsRef} className={styles.elementListCloud}></ul>
          <select className={styles.elementSelectDropdown}
            ref={tagSelectRef}
            value={new_tag}
            onChange={e => set_new_tag(e.target.value)}/>

          <span className={styles.elementButtonsWrapper}>
            <button className={`${styles.elementButton}`} onClick={clearTags}>Delete Tags</button>
            <button className={`${styles.elementButton}`} onClick={addNewTag}>Add Tag</button>
          </span>
        </div>
        <div className={styles.elementEntryRow}>
          <div ref={imageRef} className={styles.elementImageWrapper}></div>
          <label>Image</label>
          <input type='file'
            multiple={false}
            accept='image/*'
            onChange={e => handleImageUpload(e.target.files[0])}/>
        </div>
        <span className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleUpdate}>Update</button>
        </span>
      </div>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let prototypeRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/prototype/' + params.uuid)
  let prototype = await prototypeRes.json()

  let imageRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/image/' + prototype.image_uuid)
  let image = await imageRes.json()

  let categoriesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
  let categories = await categoriesRes.json()

  let tagsRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/tag')
  let tags = await tagsRes.json()

  return { props: { prototype, image, categories, tags} }
}

export default Index