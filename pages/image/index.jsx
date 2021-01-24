import SimpleTitle from '@templates/SimpleTitle'
import Image from '@components/elements/Image'
import urls from '@public/urls.json'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

import styles from '@styles/elements.module.css'

const Index = ({images}) => {
  return (<>
    <SimpleTitle title='images'/>
    <section className={styles.elementWrapper}>
      {images.map((image, key) => (
        <Image image={image} key={key}/>
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  let res = await fetch(urls.home + 'api/image/info')
  let images = await res.json()

  return { props: { images } }
}

export default Index