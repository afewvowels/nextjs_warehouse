import SimpleTitle from '@templates/SimpleTitle'
import styles from '@styles/elements.module.css'
import Item from '@components/elements/Item'
import React, { useLayoutEffect, useState } from 'react'

const Items = ({items}) => {
  return(<><div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key < Math.floor(items.length/2)) return <Item item={item} key={key}/>
    })}
  </div><div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key >= Math.floor(items.length/2)) return <Item item={item} key={key}/>
    })}
  </div></>)
}

const Items1 = ({items}) => {
  return(<div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key % 2 == 0) return <Item item={item} key={key}/>
    })}
  </div>)
}

const Items2 = ({items}) => {
  return(<div className={styles.elementWrapperColumn}>
    {items.map((item, key) => {
      if (key % 2 == 1) return <Item item={item} key={key}/>
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

const Index = ({items}) => {
  const [size] = useSize()

  return(<>
    <SimpleTitle title='Items' link='bin' />
    <section className={styles.elementWrapper}>
      {(size > 666) ? <><Items1 items={items} />
        <Items2 items={items} /></> : <Items items={items} />}
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let itemsRes = await fetch(`${process.env.NEXT_PUBLIC_URL}api/bin/itemsList/${params.uuid}`)
  let items = await itemsRes.json()

  let prototypesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/prototype')
  let prototypes = await prototypesRes.json()

  let binsRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/bin')
  let bins = await binsRes.json()

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

  return { props: { items } }
}

export default Index