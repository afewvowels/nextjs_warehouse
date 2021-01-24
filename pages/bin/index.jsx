import Title from '@templates/Title'
import Bin from '@components/elements/Bin'
import urls from '@public/urls.json'

import styles from '@styles/elements.module.css'

const Index = ({bins}) => {
  return (<>
    <Title title='bins' addUrl='/bin/add' />
    <section className={styles.elementWrapper}>
      {bins.map((bin, key) => (
        <Bin bin={bin} key={key}/>
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  let res = await fetch(urls.home + 'api/bin')
  let bins = await res.json()

  return { props: { bins } }
}

export default Index