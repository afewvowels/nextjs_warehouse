import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '@styles/templates.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PageNotFound = () => {
  return(<>
    <Head>
      <title>404 | Page not found | Inventory</title>
    </Head>
    <div className={styles.fourohfourTopWrapper}>
      <div className={styles.fourohfourWrapper}>
        <div className={styles.fourohfourCell}>
          <FontAwesomeIcon icon={['fas', 'bomb']}/>
          <p className={styles.fourohfour404}>404</p>
        </div>
        <div className={styles.fourohfourCell}>
          <p className={styles.fourohfourGoHome}>Page not found</p>
          <Link href='/'>
            <span className={styles.fourohfourButton}>
              <FontAwesomeIcon icon={['fas', 'home-alt']}/>
              <p>Go home</p>
            </span>
          </Link>
        </div>
      </div>
    </div>
  </>)
}

export default PageNotFound