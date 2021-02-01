import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from '@styles/titles.module.css'

const Title = ({title, addUrl}) => {
  return(
    <div className={styles.titleWrapper}>
      <h2>{title}</h2>
      <Link href={addUrl}>
        <span className={styles.incrementWrapper}>
          <FontAwesomeIcon icon={['fas', 'plus']}/>
          <FontAwesomeIcon icon={['fas', 'plus']}/>
        </span>
      </Link>
    </div>)
}

export default Title