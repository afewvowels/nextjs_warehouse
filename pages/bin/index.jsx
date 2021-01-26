import Title from '@templates/Title'
import Bin from '@components/elements/Bin'
import Head from 'next/head'

import styles from '@styles/elements.module.css'

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

const Index = ({bins}) => {
  return (<>
    <Head>
      <title>Bins | Inventory</title>
    </Head>
    <Title title='bins' addUrl='/bin/add' />
    <section className={styles.elementWrapper}>
      <Bins1 bins={bins} />
      <Bins2 bins={bins} />
    </section>
  </>)
}

export async function getServerSideProps() {
  let res = await fetch(process.env.URL + 'api/bin')
  let bins = await res.json()

  return { props: { bins } }
}

export default Index