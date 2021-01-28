import QRCode from 'qrcode.react'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { randomSet } from '@components/modules/random/palette/palette'
import Router from 'next/router'

import styles from '@styles/print.module.css'

const Index = ({bin}) => {
  const [qr_url, set_qr_url] = useState('')
  const [icon_base64, set_icon_base64] = useState('')
  const [svg_width, set_svg_width] = useState(0)
  const [svg_height, set_svg_height] = useState(0)

  useEffect(() => {
    set_qr_url(bin.tinyurl)
    let root = document.documentElement
    root.style.setProperty('--background-color', '#FFF')
    root.style.setProperty('--foreground-color', '#000')
  }, [bin])

  const iconRef = useCallback(node => {
    let width = 0
    let height = 0

    if (node != null) {
      set_icon_base64('data:image/svg+xml;utf8,' + node.innerHTML)

      width = node.childNodes[0].clientWidth
      height = node.childNodes[0].clientHeight

      console.log('original width: ', width, ', height: ', height)

      let maxWidth = 60
      let maxHeight = 60

      if (width > maxWidth || height > maxHeight) {
        if (width == height) {
          height = maxHeight
          width = maxWidth
        } else if (width > height) {
          height *= maxWidth / width
          width = maxWidth
        } else {
          height = maxHeight
          width *= maxHeight / height
        }
      }
    }
    console.log('new width: ', width, ', height: ', height)

    set_svg_width(width)
    set_svg_height(height)
  }, [bin])

  const goHome = () => {
    randomSet()
    Router.push('/bin')
  }

  return(<>
    <Head>
      <title>Print | Bin | Inventory</title>
    </Head>
    <>
    <section className={styles.printTopWrapper}>
    <div className={styles.printWrapper}>
      <QRCode value={qr_url}
              renderAs={'svg'}
              size={205}
              level={'M'}
              includeMargin={false}
              imageSettings={{
                src:`${icon_base64}`,
                excavate:true,
                height:svg_height,
                width:svg_width
              }}/>
    </div>
    <p onClick={goHome}>Home</p>
    <div>
      <span className={styles.printIcon} ref={iconRef}>
        <FontAwesomeIcon icon={bin.icon} />
      </span>
    </div>
    <p className={styles.printName}>{bin.name}</p>
    </section>
    </>
  </>)
}

export async function getServerSideProps({params}) {
  let binRes = await fetch(process.env.URL + 'api/bin/' + params.uuid)
  let bin = await binRes.json()

  return { props: { bin } }
}

export default Index