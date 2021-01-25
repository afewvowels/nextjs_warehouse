import SimpleTitle from '@templates/SimpleTitle'
import Bin from '@components/elements/Bin'
import urls from '@public/urls.json'
import Head from 'next/head'

import styles from '@styles/elements.module.css'

const Index = ({bin}) => {
  return (<>
    <Head>
      <title>${bin.name} | Bin | Inventory</title>
    </Head>
    <SimpleTitle title={`View Bin`}/>
    <section className={styles.elementWrapper}>
        <Bin bin={bin}/>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let res = await fetch(urls.home + 'api/bin/' + params.uuid)
  let bin = await res.json()

  return { props: { bin } }
}

export default Index