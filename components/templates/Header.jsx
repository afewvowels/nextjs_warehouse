import React from 'react'
import Navbar from '@templates/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/templates.module.css'
import Link from 'next/link'

const Header = () => {
  return (
    <header className={styles.headerMain}>
      <Link href='/'>
        <div className={styles.headerTitle}>
          <FontAwesomeIcon icon={['fas', 'warehouse-alt']}/>
          <h1>Inventory</h1>
        </div>
      </Link>
      <Navbar/>
    </header>)
}

export default Header