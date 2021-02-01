import React from 'react'
import PropTypes from 'prop-types'
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
Images1.PropTypes = {
  images: PropTypes.any.isRequired
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
Images2.PropTypes = {
  images: PropTypes.any.isRequired
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
Index.PropTypes = {
  images: PropTypes.any.isRequired
}

export async function getServerSideProps() {
  let res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/image/info')
  let images = await res.json()

  return { props: { images } }
}

export default Index