import Title from '@templates/Title'
import styles from '@styles/elements.module.css'
import Item from '@components/elements/Item'
import React, { useLayoutEffect, useState, useCallback } from 'react'
import { useTrail, animated } from 'react-spring'
import { trailSet } from '@utils/springParams'


const Items = ({items, category, bin}) => {
  const [trail, set] = useTrail(items.length, () => ({
    config: trailSet.configSimple,
    from: trailSet.fromSimple,
    to: trailSet.endSimple
  }))

  return(<><div className={styles.elementWrapperColumn}>
    {set(trailSet.fromSimple)}
    {trail.map((props,index) => {
      if (index < Math.floor(items.length/2)){
        if (category == 'all' && bin == 'all') {
          return null
        } else if (items[index].category_uuid == category || items[index].bin_uuid == bin) {
          set(trailSet.endSimple)
          return <animated.span style={props} key={index}><Item item={items[index]}/></animated.span>
        }
      }
    })}
  </div><div className={styles.elementWrapperColumn}>
    {set(trailSet.fromSimple)}
    {trail.map((props,index) => {
      if (index >= Math.floor(items.length/2)){
        if (category == 'all' && bin == 'all') {
          return null
        } else if (items[index].category_uuid == category || items[index].bin_uuid == bin) {
          set(trailSet.endSimple)
          return <animated.span style={props} key={index}><Item item={items[index]}/></animated.span>
        }
      }
    })}
  </div></>)
}

const Items1 = ({items, category, bin}) => {
  const [trail, set] = useTrail(items.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromLeft,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {set(trailSet.fromLeft)}
    {trail.map((props,index) => {
      if (index % 2 == 0){
        if (category == 'all' && bin == 'all') {
          return null
        } else if (items[index].category_uuid == category || items[index].bin_uuid == bin) {
          set(trailSet.endLR)
          return <animated.span style={props} key={index}><Item item={items[index]}/></animated.span>
        }
      }
    })}
  </div>)

  // return(<div className={styles.elementWrapperColumn}>
  //   {items.map((item, key) => {
  //     if (key % 2 == 0){
  //       if (category == 'all' && bin == 'all') {
  //         return null
  //       } else if (item.category_uuid == category || item.bin_uuid == bin) {
  //         return <Item item={item} key={key}/>
  //       }
  //     }
  //   })}
  // </div>)
}

const Items2 = ({items, category, bin}) => {
  const [trail, set] = useTrail(items.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromRight,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {set(trailSet.fromRight)}
    {trail.map((props,index) => {
      if (index % 2 == 1){
        if (category == 'all' && bin == 'all') {
          return  null
        } else if (items[index].category_uuid == category || items[index].bin_uuid == bin) {
          set(trailSet.endLR)
          return <animated.span style={props} key={index}><Item item={items[index]}/></animated.span>
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
          onChange={e => {
            set_category(e.target.value)
            set_bin('all')
          }}
          ref={categoryRef}></select>
      </span>
      <span>
        <h3>Bin Select</h3>
        <select
          value={bin}
          onChange={e => {
            set_bin(e.target.value)
            set_category('all')
          }}
          ref={binsRef}></select>
      </span>
    </section>
    <section className={styles.elementWrapper}>
      {(bin == 'all' && category == 'all') ? (
        <div style={{gridColumn: '1/3'}}>
          <h3 style={{textAlign: 'center', fontSize: '2.0rem'}}>Select a Bin or Category</h3>
        </div>) : null}
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

  items.sort((a, b) => (a.prototype_name > b.prototype_name) ? 1 : -1)

  return { props: { items, categories, bins } }
}

export default Index