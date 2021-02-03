import SimpleTitle from '@templates/SimpleTitle'
import styles from '@styles/elements.module.css'
import Item from '@components/elements/Item'
import React, { useLayoutEffect, useState } from 'react'
import { useTrail, animated } from 'react-spring'
import { trailSet } from '@utils/springParams'

const Items = ({items}) => {
  const [trail, set] = useTrail(items.length, () => ({
    config: trailSet.configSimple,
    from: trailSet.fromSimple,
    to: trailSet.endSimple
  }))

  return(<><div className={styles.elementWrapperColumn}>
    {set(trailSet.fromSimple)}
    {trail.map((props,index) => {
      if (index < Math.floor(items.length/2)) {
        set(trailSet.endSimple)
        return <animated.span style={props}><Item item={items[index]} key={index}/></animated.span>
      }
    })}
  </div><div className={styles.elementWrapperColumn}>
    {set(trailSet.fromSimple)}
    {trail.map((props,index) => {
      if (index >= Math.floor(items.length/2)) {
        set(trailSet.endSimple)
        return <animated.span style={props}><Item item={items[index]} key={index}/></animated.span>
      }
    })}
  </div></>)
}

const Items1 = ({items}) => {
  const [trail, set] = useTrail(items.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromLeft,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {set(trailSet.fromLeft)}
    {trail.map((props,index) => {
      if (index % 2 == 0) {
        set(trailSet.endLR)
        return <animated.span style={props}><Item item={items[index]} key={index}/></animated.span>
      }
    })}
  </div>)
}

const Items2 = ({items}) => {
  const [trail, set] = useTrail(items.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromRight,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {set(trailSet.fromRight)}
    {trail.map((props,index) => {
      if (index % 2 == 1) {
        set(trailSet.endLR)
        return <animated.span style={props}><Item item={items[index]} key={index}/></animated.span>
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

const Index = ({items, name}) => {
  const [size] = useSize()

  return(<>
    <SimpleTitle title={`${name} | Items List`} link='bin' />
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

  let name = ''

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
        name = bin.name
        item.bin_name = bin.name
        item.bin_image_uuid = bin.image_uuid
        item.bin_icon = bin.icon
        return
      }
    })
  })

  items.sort((a, b) => (a.prototype_name > b.prototype_name) ? 1 : -1)

  return { props: { items, name } }
}

export default Index