import SimpleTitle from '@templates/SimpleTitle'
import styles from '@styles/elements.module.css'
import Item from '@components/elements/Item'
import Bin from '@components/elements/Bin'
import React, { useLayoutEffect, useState } from 'react'
import { useTrail, animated } from 'react-spring'
import { trailSet } from '@utils/springParams'

const Items = ({items, bin}) => {

  const [trail] = useTrail(items.length, () => ({
    config: trailSet.configSimple,
    from: trailSet.fromSimple,
    to: trailSet.endSimple
  }))

  return(<div className={styles.elementWrapperColumn}>
    <Bin bin={bin}/>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Item item={items[index]}/></animated.span>
    })}
  </div>)
}

const Items1 = ({items, bin}) => {
  let itemsArr = []

  items.map((item,index) => {
    if (index > 3 && index % 2 == 0) {
      itemsArr.push(item)
    }
  })

  const [trail] = useTrail(itemsArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromLeft,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    <Bin bin={bin}/>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Item item={itemsArr[index]}/></animated.span>
    })}
  </div>)
}

const Items2 = ({items}) => {
  let itemsArr = []

  items.map((item,index) => {
    if (index <= 3) {
      itemsArr.push(item)
    } else if (index % 2 == 1) {
      itemsArr.push(item)
    }
  })

  const [trail] = useTrail(itemsArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromRight,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Item item={itemsArr[index]}/></animated.span>
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

const Index = ({items, bin, name}) => {
  const [size] = useSize()

  return(<>
    <SimpleTitle title={`${name}`} link='bin' />
    <section className={styles.elementWrapper}>
      {(size > 666) ? <><Items1 items={items} bin={bin} />
        <Items2 items={items} /></> : <Items items={items} bin={bin} />}
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

  let binNameRes = await fetch(`${process.env.NEXT_PUBLIC_URL}api/bin/${params.uuid}`)
  let binName = await binNameRes.json()

  let name = binName.name

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

  return { props: { items, bin: binName, name } }
}

export default Index