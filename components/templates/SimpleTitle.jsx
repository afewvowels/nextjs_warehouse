import React from 'react'
import Link from 'next/link'
import styles from '@styles/titles.module.css'

const SimpleTitle = ({title, link}) => {
  const url = '/' + link
  return(
    <div className={`${styles.titleWrapper} ${styles.titleHeadingLink}`}>
      <Link href={url}>
        <h2>{title}</h2>
      </Link>
    </div>
  )
}

export default SimpleTitle