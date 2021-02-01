import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import PropTypes from 'prop-types'

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

  Router.events.on('routeChangeStart', () => set_loading(true))
  Router.events.on('routeChangeComplete', () => set_loading(false))
  Router.events.on('routeChangeError', () => set_loading(false))

  useEffect(() => {
    if (!router.pathname.includes('print')) {
      initialize()
    }
  }, [router.isReady])

  if (router.pathname == '/' || router.pathname.includes('print')) return (<Component {...pageProps}></Component>)

  return (
    <Layout>
      <Head>
        <title>Inventory</title>
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
      <Component {...pageProps} />
      <Loading loading={loading} />
    </Layout>)
}
MyApp.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired
}

export default MyApp
