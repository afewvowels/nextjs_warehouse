import Title from '@templates/Title'
import styles from '@styles/elements.module.css'
import Item from '@components/elements/Item'
import { useState, useCallback } from 'react'

const Index = ({items, categories}) => {
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

  return(<>
    <Title title='items' addUrl='/item/add' />
    <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Category Select</h3>
        <select value={category}
                onChange={e => set_category(e.target.value)}
                ref={categoryRef}></select>
      </span>
    </section>
    <section className={styles.elementWrapper}>
      {items.map((item, key) => (
        (category == 'all' || item.category_uuid == category) ? <Item item={item} key={key}/> : null
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  let itemsRes = await fetch(process.env.URL + 'api/item')
  let items = await itemsRes.json()

  let prototypesRes = await fetch(process.env.URL + 'api/prototype')
  let prototypes = await prototypesRes.json()

  let binsRes = await fetch(process.env.URL + 'api/bin')
  let bins = await binsRes.json()

  let categoriesRes = await fetch(process.env.URL + 'api/group/category')
  let categories = await categoriesRes.json()

  items.forEach((item) => {
    prototypes.forEach((prototype) => {
      if (prototype.uuid == item.prototype_uuid) {
        item.prototype_name = prototype.name
        item.prototype_image_uuid = prototype.image_uuid
        item.prototype_icon = prototype.icon
        item.category_uuid = prototype.category_uuid
        return
      }
    })

    bins.forEach((bin) => {
      if (bin.uuid == item.bin_uuid) {
        item.bin_name = bin.name
        item.bin_image_uuid = bin.image_uuid
        item.bin_icon = bin.icon
        return
      }
    })
  })

  return { props: { items, categories } }
}

export default Index