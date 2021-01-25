import Title from '@templates/Title'
import Bin from '@components/elements/Bin'
import Head from 'next/head'

import styles from '@styles/elements.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Index = ({bins}) => {
  return (<>
    <Head>
      <title>Bins | Inventory</title>
    </Head>
    <Title title='bins' addUrl='/bin/add' />
    <section className={styles.elementWrapper}>
      {bins.map((bin, key) => (
        <Bin bin={bin} key={key}/>
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  let res = await fetch(process.env.URL + 'api/bin')
  let bins = await res.json()

  return { props: { bins } }
}

export default Index