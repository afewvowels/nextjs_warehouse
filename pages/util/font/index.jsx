import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import Font from '@components/elements/Font'
import Head from 'next/head'
import styles from '@styles/elements.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Index = ({fonts}) => {
  const [name, set_name] = useState('')
  const [link, set_link] = useState('')
  const [css, set_css] = useState('')
  const [category, set_category] = useState('')
  const [weight0, set_weight0] = useState('')
  const [weight1, set_weight1] = useState('')
  const [error_msg, set_error_msg] = useState('')

  const handleCreate = async () => {
    const newFont = {
      uuid: uuidv4(),
      name: name,
      link: link,
      css: css,
      category: category,
      weight0: weight0,
      weight1: weight1
    }

    const fontRes = await fetch('/api/fonts', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify(newFont)
    })

    if (fontRes.status == 201) {
      console.log('font added successfully')
      Router.push('/util/font')
    } else {
      console.error('error while adding font')
      set_error_msg(await fontRes.text())
    }
  }

  return(<>
    <Head>
      <title>Font | Inventory</title>
    </Head>
    <div className={`${styles.titleWrapper} ${styles.titleHeadingLink}`}>
      <h2>Fonts</h2>
    </div>
    <section className={styles.elementWrapper}>
      <div className={styles.elementEntryRowsWrapper}>
        {error_msg ? <p style={{color: 'red'}}>{error_msg}</p> : null}
        <div className={styles.elementEntryRow}>
          <label>Font Name</label>
          <input
            type='text'
            value={name}
            onChange={e => set_name(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Link Import</label>
          <input
            type='text'
            value={link}
            onChange={e => set_link(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>CSS Rule</label>
          <input
            type='text'
            value={css}
            onChange={e => set_css(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Font Category</label>
          <select className={styles.elementSelectDropdown}
            value={category}
            onChange={e => set_category(e.target.value)}>
            <option value=''>Select a category</option>
            <option value='sans'>Sans-serif</option>
            <option value='serif'>Serif</option>
            <option value='mono'>Monospace</option>
            <option value='display'>Fancy</option>
          </select>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Weight 0</label>
          <input
            type='text'
            value={weight0}
            onChange={e => set_weight0(e.target.value)}/>
        </div>
        <div className={styles.elementEntryRow}>
          <label>Weight 1</label>
          <input
            type='text'
            value={weight1}
            onChange={e => set_weight1(e.target.value)}/>
        </div>
        <span className={styles.elementButtonsWrapper}>
          <button className={`${styles.elementButton} ${styles.elementButtonWide}`} onClick={handleCreate}>Create</button>
        </span>
      </div>
    </section>
    <section className={`${styles.elementWrapperWide} ${styles.elementWrapper}`}>
      {fonts.map((font, key) => (
        <Font font={font} key={key}/>
      ))}
    </section>
  </>)
}
Index.PropTypes = {
  fonts: PropTypes.any.isRequired
}

export async function getServerSideProps() {
  const fonts = await fetcher(`${process.env.NEXT_PUBLIC_URL}api/fonts`)

  return { props: { fonts } }
}

export default Index