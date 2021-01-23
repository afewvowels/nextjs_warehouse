import { useState, useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import urls from '@public/urls.json'

import randomIcon from '@components/modules/random/icon/randomIcon'
const readable = require('readable-url-names')
import { v4 as uuidv4 } from 'uuid'

import styles from '@styles/elements.module.css'

var generator = new readable()

const Index = ({categories, tags}) => {
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

  const categoriesRef = useCallback(node => {
    if (node != null && categories != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`,`<option value='-1'>Select a category</option>`)
      categories.forEach((category, index) => {
        node.insertAdjacentHTML(`beforeend`,`<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  const tagSelectRef = useCallback(node => {
    if (node != null && tags != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`,`<option value='-1'>Select a tag</option>`)
      tags.forEach((tag, index) => {
        if (tag.category_uuid == category_uuid) {
          node.insertAdjacentHTML(`beforeend`,`<option value=${tag.uuid}>${tag.name}</option>`)
        }
      })
    }
  }, [category_uuid])

  const tagsRef = useCallback(node => {
    if (node != null && tag_uuids.length > 0) {
      node.innerHTML = ''
      tag_uuids.forEach(tag => {
        tags.forEach(propTag => {
          if (propTag.uuid == tag) {
            node.insertAdjacentHTML(`beforeend`, `<li>${propTag.name}</li>`)
            return
          }
        })
      })
    }
  }, [tag_uuids])

  const imageRef = useCallback(node => {
    if (node != null && image_base64 != '') {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`,`<img src=${image_base64} alt=${name}/>`)
    }
  }, [image_base64])

  const traitsRef = useCallback(node => {
    if (node != null && traits.length > 0) {
      node.innerHTML = ''
      traits.forEach(trait => {
        node.insertAdjacentHTML(`beforeend`, `<li>${trait}</li>`)
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

  const generateIdentifiers = () => {
    set_icon(randomIcon())
    set_uuid(uuidv4())
    set_readable_name(generator.generate())
  }

  const handleImageRead = () => {
    const image = fileReader.result
    set_image_base64(image)
  }

  const handleImageUpload = (image) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleImageRead
    fileReader.readAsDataURL(image)
  }

  const handleCreate = async () => {
    let imageUuid = uuidv4()

    const image = {
      uuid: imageUuid,
      base64: image_base64
    }

    const imageRes = await fetch(urls.home + 'api/image', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify(image),
    })

    if (imgRes.status == 201) {
      console.log(`image created successfully`)
    } else {
      console.error(`error while creating image`)
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

    const prototypeRes = await fetch(urls.home + 'api/prototype', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify(image),
    })

    if (prototypeRes.status == 201) {
      console.log(`prototype created successfully`)
      Router.replace('/prototype')
    } else {
      console.error(`error while creating prototype`)
      set_error_msg(await prototypeRes.text())
    }
  }

  return(<>
    <h2 className={styles.elementHeader}>Create Prototype</h2>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
        <span className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={generateIdentifiers}>Generate</button>
        </span>
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
          <label>Category</label>
          <select ref={categoriesRef}
                  value={category_uuid}
                  onChange={e => set_category_uuid(e.target.value)}>
          </select>
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
          <label>Traits</label>
          <ul ref={traitsRef}></ul>
          <input type='text'
                  value={new_trait}
                  onChange={e => set_new_trait(e.target.value)}/>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={addNewTrait}>Add Trait</button>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Tags</label>
          <ul ref={tagsRef}></ul>
          <select ref={tagSelectRef}
                  value={new_tag}
                  onChange={e => set_new_tag(e.target.value)}/>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={addNewTag}>Add Tag</button>
        </div>
        <div className={styles.elementEntryRow}>
          <div ref={imageRef} className={styles.elementImageWrapper}></div>
          <label>Image</label>
          <input type='file'
                  multiple={false}
                  accept='image/jpeg'
                  onChange={e => handleImageUpload(e.target.files[0])}/>
        </div>
        <span className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create Prototype</button>
        </span>
      </div>
    </section>
  </>)
}

export async function getServerSideProps() {
  let categoryRes = await fetch(urls.home + 'api/group/category')
  let categories = await categoryRes.json()

  let tagRes = await fetch(urls.home + 'api/group/tag')
  let tags = await tagRes.json()

  return { props: { categories, tags } }
}

export default Index