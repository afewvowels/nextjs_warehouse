import urls from '@public/urls.json'
import QRCode from 'qrcode.react'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import styles from '@styles/print.module.css'

const Index = ({bin}) => {
  const [qr_url, set_qr_url] = useState('')
  const [icon_base64, set_icon_base64] = useState('')

  useEffect(() => {
    set_qr_url(urls.home + 'bin/' + bin.uuid)
  }, [bin])

  const iconRef = useCallback(node => {
    if (node != null) {
      set_icon_base64('data:image/svg+xml;utf8,' + node.innerHTML)
    }
  }, [bin])

  return(<>
    <Head>
      <title>Bin | Print</title>
    </Head>
    <>
    <section className={styles.printTopWrapper}>
    <div className={styles.printWrapper}>
      <div>
        <span className={styles.printIcon} ref={iconRef}>
          <FontAwesomeIcon icon={bin.icon} />
        </span>
        <p className={styles.printName}>{bin.name}</p>
      </div>
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
  let binRes = await fetch(urls.home + 'api/bin/' + params.uuid)
  let bin = await binRes.json()

  return { props: { bin } }
}

export default Index