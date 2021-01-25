import { useState, useCallback } from 'react'
import Title from '@templates/Title'
import Tag from '@components/elements/Tag'
import styles from '@styles/elements.module.css'

const Index = ({categories, tags}) => {
  const [category, set_category] = useState('all')

  const categoryRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`,`<option value='all'>All</option>`)
      categories.forEach(category => {
        node.insertAdjacentHTML(`beforeend`,`<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  return (<>
    <Title title='tags' addUrl='/group/tag/add' />
    <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Category Select</h3>
        <select value={category}
                onChange={e => set_category(e.target.value)}
                ref={categoryRef}></select>
      </span>
    </section>
    <section className={styles.elementWrapper}>
      {tags.map((tag, key) => (
        (category == 'all' || tag.category_uuid == category) ? <Tag tag={tag} categories={categories} key={key} /> : null
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  let categoryRes = await fetch(process.env.URL + 'api/group/category')
  let categories = await categoryRes.json()

  let tagRes = await fetch(process.env.URL + 'api/group/tag')
  let tags = await tagRes.json()

  return { props: { categories, tags } }
}

export default Index