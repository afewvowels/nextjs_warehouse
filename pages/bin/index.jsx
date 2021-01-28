import Title from '@templates/Title'
import Bin from '@components/elements/Bin'
import Head from 'next/head'
import { useLayoutEffect, useState } from 'react'

import styles from '@styles/elements.module.css'

const Bins = ({bins}) => {
  return(<>
    <div className={styles.elementWrapperColumn}>
    {bins.map((bin, key) => {
      if (key <= Math.floor(bins.length/2)){
        return <Bin bin={bin} key={key}/>
      }
    })}
    </div>
    <div className={styles.elementWrapperColumn}>
    {bins.map((bin, key) => {
      if (key > Math.floor(bins.length/2)){
        return <Bin bin={bin} key={key}/>
      }
    })}
    </div>
  </>)
}

const Bins1 = ({bins}) => {
  return(<div className={styles.elementWrapperColumn}>
  {bins.map((bin, key) => {
    if (key % 2 == 0) {
      return <Bin bin={bin} key={key}/>
    }
  })}</div>)
}

const Bins2 = ({bins}) => {
  return(<div className={styles.elementWrapperColumn}>
  {bins.map((bin, key) => {
    if (key % 2 == 1) {
      return <Bin bin={bin} key={key}/>
    }
  })}</div>)
}

function useSize() {
  const [size, set_size] = useState([0])

  useLayoutEffect(() => {
    function updateWindowSize() {
      set_size([window.innerWidth])
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()
    return () => window.removeEventListener('resize', updateWindowSize)
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

export async function getStaticProps() {
  let res = await fetch(process.env.URL + 'api/bin')
  let bins = await res.json()

  return { props: { bins }, revalidate: 5 }
}

export default Index