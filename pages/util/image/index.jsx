import React from 'react'
import SimpleTitle from '@templates/SimpleTitle'
import Image from '@components/elements/Image'

import styles from '@styles/elements.module.css'

const Images1 = ({images}) => {
  return(<div className={styles.elementWrapperColumn}>
    {images.map((image, key) => {
      if (key % 2 == 0) {
        return <Image image={image} key={key}/>
      }
    })}
  </div>)
}

const Images2 = ({images}) => {
  return(<div className={styles.elementWrapperColumn}>
    {images.map((image, key) => {
      if (key % 2 == 1) {
        return <Image image={image} key={key}/>
      }
    })}
  </div>)
}

const Index = ({images}) => {
  return (<>
    <SimpleTitle title='images'/>
    <section className={styles.elementWrapper}>
      <Images1 images={images} />
      <Images2 images={images} />
    </section>
  </>)
}

export async function getServerSideProps() {
  let res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/image/info')
  let images = await res.json()

  images.sort((a, b) => a.hasImage - b.hasImage)

  return { props: { images } }
}

export default Index