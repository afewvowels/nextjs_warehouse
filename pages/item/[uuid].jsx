import SimpleTitle from '@templates/SimpleTitle'
import ViewItem from '@components/elements/ViewItem'
import urls from '@public/urls.json'
import useSWR from 'swr'

import styles from '@styles/elements.module.css'

const Index = ({item}) => {
  return (<>
    <SimpleTitle title={`View Item`}/>
    <section className={styles.elementWrapper}>
        <ViewItem item={item}/>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let res = await fetch(urls.home + 'api/item/' + params.uuid)
  let item = await res.json()

  return { props: { item } }
}

export default Index