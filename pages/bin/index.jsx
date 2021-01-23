import Title from '@templates/Title'
import Bin from '@components/elements/Bin'
import urls from '@public/urls.json'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())

import styles from '@styles/elements.module.css'

const Index = ({bins}) => {
  console.log('bins length: ' + bins.length)
  return (<>
    <Title title='bins' />
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

  let imgRes = await fetch(urls.home + 'api/image')
  let images = await imgRes.json()

  // let itemRes = await fetch(urls.home + 'api/item')
  // let items = await itemRes.json()

  // let protoRes = await fetch(urls.home + 'api/prototype')
  // let prototypes = await protoRes.json()

  // const { bins, binsError } = useSWR('/api/bin', fetcher)
  // const { images, imagesError } = useSWR('/api/image', fetcher)

  bins.forEach((bin) => {
    bin.found_image = false
    bin.base64 = null
    images.forEach((image) => {
      if (bin.image_uuid == image.uuid) {
        console.log('found image for bin: ' + bin.uuid)
        bin.found_image = true
        bin.base64 = image.base64
        return
      }
    })
  })
  
  // await fetch(urls.home + '/api/bin', {
  //   method: 'GET',
  //   mode: 'same-origin',
  //   cache: 'no-cache',
  //   credentials: 'same-origin'
  // }).then(res => bins = res.data)

  return { props: { bins } }
}

export default Index