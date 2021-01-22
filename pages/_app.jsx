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
    initialize()
  }, [router.isReady])

  if (router.pathname == '/') return (<Component {...pageProps}></Component>);

  return (
    <Layout>
      <Head>
        <title>Inventory</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="HandheldFriendly" content="true"/>
        <meta name="MobileOptimized" content="width"/>

        <link rel="apple-touch-icon" type="image/svg" href={require('../public/ramp-loading-solid.svg')}/>
        <link rel="apple-touch-icon" sizes="114x114" type="image/svg" href={require('../public/ramp-loading-solid.svg')}/>
        <link rel="apple-touch-icon" type="image/svg" href={require('../public/ramp-loading-solid.svg')}/>
        <link rel="apple-touch-startup-image" type="image/svg" href={require('../public/ramp-loading-solid.svg')}/>
        <link rel="icon" type="image/svg" sizes="32x32" href={require('../public/ramp-loading-solid.svg')} />
        <link rel="manifest" href='/manifest.json'/>
      </Head>
      <Component {...pageProps} />
    </Layout>)
}

export default MyApp
