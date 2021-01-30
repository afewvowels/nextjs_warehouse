import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
// import db from '@db/firebase'
// import firebase from 'firebase'

import { initialize } from '@components/modules/random/palette/palette'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import '@styles/globals.css'
import Layout from '@components/templates/Layout'

library.add(fas,far,fad,fal,fab)

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const[signed_in, set_signed_in] = useState(false)

  useEffect(() => {
    // this.unregisterAuthObserver = db.auth().onAuthStateChanged(
    //   (user) => set_signed_in(!!user)
    // )
    if (!router.pathname.includes('print')) {
      initialize()
    }
  }, [router.isReady])

  const uiConfig = {
    // signInFlow: 'popup',
    // signInOptions: [
    //   firebase.auth.EmailAuthProvider.PROVIDER_ID
    // ],
    // callbacks:{
    //   signInSuccessWithAuthResult: () => false
    // }
  }

  if (!signed_in) {
    return(
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={db.auth()}/> */}
      </div>
    )
  }


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
