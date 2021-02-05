import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return(
      <Html lang='en'>
        <Head>
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={
              {__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.GTM_ID}');`,}
            }
          />
          {/* End Google Tag Manager */}
          <meta name="description" content="Home inventory management system for workshop" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="apple-mobile-web-app-title" content="Inventory" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="HandheldFriendly" content="true" />
          <meta name="MobileOptimized" content="width" />

          <link rel="apple-touch-icon" type="image/png" href='/icons/apple-touch-icon.png' />
          <link rel="icon" type="image/svg" href='/hand-receiving-solid.svg' />
          <link rel="manifest" href='/manifest.json' />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript
            dangerouslySetInnerHTML={
              {__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,}
            }
          />
          {/* End Google Tag Manager (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument