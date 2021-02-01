import React from 'react'
import Document, { Html, Head, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return(
      <Html lang='en'>
        <Head />
        <body>
          <div id='__next'></div>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument