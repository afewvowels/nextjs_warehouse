import Title from '@templates/Title'
import Prototype from '@components/elements/Prototype'
import styles from '@styles/elements.module.css'
import { useState, useCallback } from 'react'

const Prototypes1 = ({prototypes, categories, tags, category}) => {
  return(<div className={styles.elementWrapperColumn}>
    {prototypes.map((prototype, key) => {
      if (key % 2 == 0) {
        if (category == 'all' && tag == 'all') {
          return <Prototype prototype={prototype} categories={categories} tags={tags} key={key}/>
        } else if (category == prototype.category_uuid) {
          return <Prototype prototype={prototype} categories={categories} tags={tags} key={key}/>
        }
      }
    })}
  </div>)
}

const Prototypes2 = ({prototypes, categories, tags, category}) => {
  return(<div className={styles.elementWrapperColumn}>
    {prototypes.map((prototype, key) => {
      if (key % 2 == 1) {
        if (category == 'all') {
          return <Prototype prototype={prototype} categories={categories} tags={tags} key={key}/>
        } else if (category == prototype.category_uuid) {
          return <Prototype prototype={prototype} categories={categories} tags={tags} key={key}/>
        }
      }
    })}
  </div>)
}

const Index = ({prototypes, categories, tags}) => {
  const [category, set_category] = useState('all')
  const [tag, set_tag] = useState('all')

  const categoryRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`,`<option value='all'>All</option>`)
      categories.forEach(category => {
        node.insertAdjacentHTML(`beforeend`,`<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  const tagsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML(`beforeend`,`<option value='all'>All</option>`)
      tags.map((tag, key) => {
        if (category == 'all' || tag.category_uuid == category) {
          node.insertAdjacentHTML(`beforeend`,`<option value=${tag.uuid}>${tag.name}</option>`)
        }
      })
    }
  }, [category])

  return(<>
    <Title title='prototypes' addUrl='/prototype/add' />
    <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Category Select</h3>
        <select value={category}
                onChange={e => set_category(e.target.value)}
                ref={categoryRef}></select>
      </span>
    </section>
    <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Tag Select</h3>
        <select value={tag}
                onChange={e => set_tag(e.target.value)}
                ref={tagsRef}></select>
      </span>
    </section>
    <section className={styles.elementWrapper}>
      <Prototypes1 prototypes={prototypes} categories={categories} tags={tags} category={category} />
      <Prototypes2 prototypes={prototypes} categories={categories} tags={tags} category={category} />
    </section>
  </>)
}

export async function getServerSideProps() {
  let prototypesRes = await fetch(process.env.URL + 'api/prototype')
  let prototypes = await prototypesRes.json()

  let categoriesRes = await fetch(process.env.URL + 'api/group/category')
  let categories = await categoriesRes.json()

  let tagsRes = await fetch(process.env.URL + 'api/group/tag')
  let tags = await tagsRes.json()

  return { props: { prototypes, categories, tags } }
}

export default Index