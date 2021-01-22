import React from 'react'
import Header from '@templates/Header'
import Footer from '@templates/Footer'
import styles from '@styles/templates.module.css'

const Layout = ({children}) => {
  return (
    <>
      <Header/>
      <main>{children}</main>
      <Footer/>
    </>
  )
}

export default Layout;