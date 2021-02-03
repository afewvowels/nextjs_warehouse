import Title from '@templates/Title'
import Bin from '@components/elements/Bin'
import Head from 'next/head'
import React, { useLayoutEffect, useState } from 'react'
import { useTrail, animated } from 'react-spring'
import { trailSet } from '@utils/springParams'

import styles from '@styles/elements.module.css'


const Bins = ({bins}) => {
  const [trail, set] = useTrail(bins.length, () => ({
    config: trailSet.configSimple,
    from: trailSet.fromSimple,
    to: trailSet.endSimple
  }))

  return(<>
    <div className={styles.elementWrapperColumn}>
      {set(trailSet.fromSimple)}
      {trail.map((props,index) => {
        if (index < Math.floor(bins.length/2)){
          set(trailSet.endSimple)
          return <animated.span style={props} key={index}><Bin bin={bins[index]}/></animated.span>
        }
      })}
    </div>
    <div className={styles.elementWrapperColumn}>
      {set(trailSet.fromSimple)}
      {trail.map((props,index) => {
        if (index >= Math.floor(bins.length/2)){
          set(trailSet.endSimple)
          return <animated.span style={props} key={index}><Bin bin={bins[index]}/></animated.span>
        }
      })}
    </div>
  </>)
}

const Bins1 = ({bins}) => {
  const [trail, set] = useTrail(bins.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromLeft,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {set(trailSet.fromLeft)}
    {trail.map((props,index) => {
      if (index % 2 == 0) {
        set(trailSet.endLR)
        return <animated.span style={props} key={index}><Bin bin={bins[index]}/></animated.span>
      }
    })}
  </div>)
}

const Bins2 = ({bins}) => {
  const [trail, set] = useTrail(bins.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromRight,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {set(trailSet.fromRight)}
    {trail.map((props,index) => {
      if (index % 2 == 1) {
        set(trailSet.endLR)
        return <animated.span style={props} key={index}><Bin bin={bins[index]}/></animated.span>
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

const Index = ({bins}) => {
  const [windowSize] = useSize()

  return (<>
    <Head>
      <title>Bins | Inventory</title>
    </Head>
    <Title title='bins' addUrl='/bin/add' />
    <section className={styles.elementWrapper}>
      {(windowSize > 666) ? <><Bins1 bins={bins} /><Bins2 bins={bins} /></> : <Bins bins={bins} />}
    </section>
  </>)
}

export async function getServerSideProps() {
  let res = await fetch(`${process.env.NEXT_PUBLIC_URL}api/bin`)
  let bins = await res.json()

  return { props: { bins } }
}

export default Index