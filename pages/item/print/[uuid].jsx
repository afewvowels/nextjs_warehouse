import QRCode from 'qrcode.react'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import Link from 'next/link'

import styles from '@styles/print.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useBin(uuid) {
  const { data, error } = useSWR(`/api/bin/${uuid}`, fetcher)

  return {
    bin: data,
    isLoading: !error && !data,
    isError: error
  }
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

  useEffect(() => {
    set_qr_url(process.env.URL + 'item/' + item.uuid)
  }, [item])

  const iconRef = useCallback(node => {
    if (node != null) {
      set_icon_base64('data:image/svg+xml;utf8,' + node.innerHTML)
    }
  }, [item])

  if (!bin) return <FontAwesomeIcon icon={['far', 'exclamation']}/>

  return(<>
    <Head>
      <title>Item | Print</title>
    </Head>
    <>
    <section className={styles.printTopWrapper}>
    <div className={styles.printWrapper}>
      <span className={styles.printIcon} ref={iconRef}>
        <FontAwesomeIcon icon={bin.icon}/>
      </span>
      <QRCode value={qr_url}
              renderAs={'svg'}
              size={205}
              level={'H'}
              includeMargin={false}
              imageSettings={{
                src:`${icon_base64}`,
                excavate:true,
                height:48,
                width:48
              }}/>
    </div>
    <Link href='/'>
      <p>Home</p>
    </Link>
    </section>
    </>
    <style jsx>{`
    :root {
      --background-color: white !important;
      --foreground-color: black !important;
    }
    `}</style>
  </>)
}

export async function getServerSideProps({params}) {
  let itemRes = await fetch(process.env.URL + 'api/item/' + params.uuid)
  let item = await itemRes.json()

  return { props: { item } }
}

export default Index