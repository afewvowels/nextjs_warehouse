import Title from '@templates/Title'
import styles from '@styles/elements.module.css'
import Item from '@components/elements/Item'
import React, { useLayoutEffect, useState, useCallback } from 'react'

const Items = ({items, category, bin}) => {
  return(<><div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key < Math.floor(items.length/2)){
        if (category == 'all' && bin == 'all') {
          return <Item item={item} key={key}/>
        } else if (item.category_uuid == category || item.bin_uuid == bin) {
          return <Item item={item} key={key}/>
        }
      }
    })}
  </div><div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key >= Math.floor(items.length/2)){
        if (category == 'all' && bin == 'all') {
          return <Item item={item} key={key}/>
        } else if (item.category_uuid == category || item.bin_uuid == bin) {
          return <Item item={item} key={key}/>
        }
      }
    })}
  </div></>)
}

const Items1 = ({items, category, bin}) => {
  return(<div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key % 2 == 0){
        if (category == 'all' && bin == 'all') {
          return <Item item={item} key={key}/>
        } else if (item.category_uuid == category || item.bin_uuid == bin) {
          return <Item item={item} key={key}/>
        }
      }
    })}
  </div>)
}

const Items2 = ({items, category, bin}) => {
  return(<div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key % 2 == 1){
        if (category == 'all' && bin == 'all') {
          return <Item item={item} key={key}/>
        } else if (item.category_uuid == category || item.bin_uuid == bin) {
          return <Item item={item} key={key}/>
        }
      }
    })}
  </div>)
}

function useSize() {
  const [size, set_size] = useState([0])

  useLayoutEffect(() => {
    function updateWindowSize() {
      set_size([window.innerWidth])
    }
    window.addEventListener('resize', updateWindowSize)
    window.addEventListener('orientationchange', updateWindowSize)
    updateWindowSize()
    return () => {
      window.removeEventListener('resize', updateWindowSize)
      window.removeEventListener('orientationchange', updateWindowSize)
    }
  }, [])
  return size
}

const Index = ({items, categories, bins}) => {
  const [category, set_category] = useState('all')
  const [bin, set_bin] = useState('all')
  const [size] = useSize()

  const categoryRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend','<option value="all">All</option>')
      categories.forEach(category => {
        node.insertAdjacentHTML('beforeend',`<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  const binsRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend','<option value="all">All</option>')
      bins.forEach(bin => {
        node.insertAdjacentHTML('beforeend',`<option value=${bin.uuid}>${bin.name}</option>`)
      })
    }
  }, [bins])

  return(<>
    <Title title='items' addUrl='/item/add' />
    <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Category Select</h3>
        <select
          value={category}
          onChange={e => set_category(e.target.value)}
          ref={categoryRef}></select>
      </span>
      <span>
        <h3>Bin Select</h3>
        <select
          value={bin}
          onChange={e => set_bin(e.target.value)}
          ref={binsRef}></select>
      </span>
    </section>
    <section className={styles.elementWrapper}>
      {(size > 666) ? <><Items1 items={items} category={category} bin={bin}/>
        <Items2 items={items} category={category} bin={bin}/></> : <Items items={items} category={category} bin={bin}/>}
    </section>
  </>)
}

export async function getServerSideProps() {
  let itemsRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/item')
  let items = await itemsRes.json()

  let prototypesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/prototype')
  let prototypes = await prototypesRes.json()

  let binsRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/bin')
  let bins = await binsRes.json()

  let categoriesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
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

  return { props: { items, categories, bins } }
}

export default Index