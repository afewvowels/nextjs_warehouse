import QRCode from 'qrcode.react'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
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

function BinInfo({uuid}) {
  const { bin, isLoading, isError } = useBin(uuid)

  if (isLoading) return <FontAwesomeIcon icon={['far', 'atom-alt']} spin size='sm' />
  if (isError) return <FontAwesomeIcon icon={['far', 'exclamation']} size='sm' />
  return <FontAwesomeIcon icon={bin.icon}/>
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

      width = node.childNodes[0].clientWidth
      height = node.childNodes[0].clientHeight

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

    set_svg_width(width)
    set_svg_height(height)
  }, [item])

  const goHome = () => {
    randomSet()
    Router.push('/item')
  }

  if (!bin) return <FontAwesomeIcon icon={['far', 'exclamation']}/>

  return(<>
    <Head>
      <title>Item | Print</title>
    </Head>
    <>
    <section className={styles.printTopWrapper}>
    <div className={styles.printWrapper}>
      <QRCode value={qr_url}
              renderAs={'svg'}
              size={206}
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
    <span className={styles.printIcon} ref={iconRef}>
      <FontAwesomeIcon icon={bin.icon}/>
    </span>
    <p className={styles.printName}>{bin.name}</p>
    </section>
    </>
  </>)
}

export async function getServerSideProps({params}) {
  let itemRes = await fetch(process.env.URL + 'api/item/' + params.uuid)
  let item = await itemRes.json()

  return { props: { item } }
}

export default Index