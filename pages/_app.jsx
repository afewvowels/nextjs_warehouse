import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initialize } from '@components/modules/random/palette/palette'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import 'styles/globals.css'
import Layout from 'components/templates/Layout'

library.add(fas,far,fad,fal,fab)

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    if (!router.pathname.includes('print')) {
      initialize()
    }
  }, [router.isReady])

  if (router.pathname == '/' || router.pathname.includes('print')) return (<Component {...pageProps}></Component>);

  return (
    <Layout>
      <Head>
        <title>Inventory</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="HandheldFriendly" content="true"/>
        <meta name="MobileOptimized" content="width"/>

        <link rel="apple-touch-icon" type="image/png" href={require('../public/icons/apple-touch-icon.png')}/>
        <link rel="icon" type="image/png" sizes="32x32" href={require('../public/icons/favicon-32x32.png')} />
        <link rel="manifest" href='/manifest.json'/>
      </Head>
      <Component {...pageProps} />
    </Layout>)
}

export default MyApp
