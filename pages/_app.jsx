import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { GTMPageView } from '@utils/gtm.ts'

import { initialize } from '@components/modules/random/palette/palette'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import '@styles/globals.css'
import Layout from '@components/templates/Layout'
import Loading from '@components/templates/Loading'

library.add(fas,far,fad,fal,fab)

const MyApp = ({ Component, pageProps }) => {
  const [loading, set_loading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => GTMPageView(url)

    Router.events.on('routeChangeStart', () => {
      set_loading(true)
    })
    Router.events.on('routeChangeComplete', () => {
      set_loading(false)
      handleRouteChange(router.pathname)
    })
    Router.events.on('routeChangeError', () => set_loading(false))
    if (!router.pathname.includes('print')) {
      initialize()
    }
    return Router.events.off('routeChangeComplete', handleRouteChange(router.pathname))
  }, [])

  if (router.pathname == '/' || router.pathname.includes('print')) return (<Component {...pageProps}></Component>)

  return (
    <Layout>
      <Head>
        <title>Inventory</title>
      </Head>
      <Component {...pageProps} />
      <Loading loading={loading} />
    </Layout>)
}

export default MyApp
