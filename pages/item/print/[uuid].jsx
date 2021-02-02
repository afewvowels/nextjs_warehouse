import QRCode from 'qrcode.react'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import { randomSet } from '@components/modules/random/palette/palette'
import Router from 'next/router'

import styles from '@styles/print.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useBin(uuid) {
  const { data, error } = useSWR(`/api/bin/${uuid}`, fetcher)
  return { bin: data, isLoading: !error && !data, isError: error }
}

const Index = ({item}) => {
  const [qr_url, set_qr_url] = useState('')
  const [icon_base64, set_icon_base64] = useState('')
  const { bin, isLoading, isError } = useBin(item.bin_uuid)
  const [svg_width, set_svg_width] = useState(0)
  const [svg_height, set_svg_height] = useState(0)

  useEffect(() => {
    set_qr_url(item.tinyurl)
    let root = document.documentElement
    root.style.setProperty('--background-color', '#FFF')
    root.style.setProperty('--foreground-color', '#000')
  }, [item])

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

      set_svg_width(width)
      set_svg_height(height)
    }
  }, [item])

  const goHome = async() => {
    await randomSet()
    Router.push('/item')
  }

  if (!bin || isLoading || isError) return <FontAwesomeIcon icon={['far', 'exclamation']}/>

  return(<>
    <Head>
      <title>Item | Print</title>
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
            size={206}
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
        <span className={styles.printIcon} ref={iconRef}>
          <FontAwesomeIcon icon={bin.icon}/>
        </span>
        <p className={styles.printName}>{bin.name}</p>
      </section>
    </>
  </>)
}
Index.PropTypes = {
  item: PropTypes.any.isRequired
}

export async function getServerSideProps({params}) {
  let itemRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/item/' + params.uuid)
  let item = await itemRes.json()

  return { props: { item } }
}

export default Index