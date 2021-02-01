import React from 'react'
import Header from '@templates/Header'
import Footer from '@templates/Footer'

const Layout = ({children}) => {
  return (
    <>
      <Header/>
      <main>{children}</main>
      <Footer/>
    </>
  )
}

export default Layout