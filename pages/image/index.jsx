import SimpleTitle from '@templates/SimpleTitle'
import Image from '@components/elements/Image'

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
  let res = await fetch(process.env.URL + 'api/image/info')
  let images = await res.json()

  return { props: { images } }
}

export default Index