import QRCode from 'qrcode.react'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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

      width = node.childNodes[0].childNodes[0].getBBox()['width']
      height = node.childNodes[0].childNodes[0].getBBox()['height']

      let maxDim = 50

      if (width > maxDim || height > maxDim) {
        if (width == height) {
          height = maxDim
          width = maxDim
        } else if (width > height) {
          height /= width
          height *= maxDim
          width = maxDim
        } else {
          width /= height
          width *= maxDim
          height = maxDim
        }
      }
    }
    set_svg_width(width)
    set_svg_height(height)
  }, [bin])

  const goHome = async() => {
    Router.push('/bin')
    await randomSet()
  }

  return(<>
    <Head>
      <title>Print | Bin | Inventory</title>
      <meta name="description" content="Home inventory management system for workshop" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <meta name="HandheldFriendly" content="true"/>
      <meta name="MobileOptimized" content="width"/>

      <link rel="apple-touch-icon" type="image/png" href='/icons/apple-touch-icon.png'/>
      <link rel="icon" type="image/svg" href='/hand-receiving-solid.svg' />
      <link rel="manifest" href='/manifest.json'/>
    </Head>
    <>
      <section className={styles.printTopWrapper}>
        <div className={styles.printWrapper}>
          <QRCode value={qr_url}
            renderAs={'canvas'}
            size={205}
            level={'Q'}
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
Index.PropTypes = {
  bin: PropTypes.any.isRequired
}

export async function getServerSideProps({params}) {
  let binRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/bin/' + params.uuid)
  let bin = await binRes.json()

  return { props: { bin } }
}

export default Index