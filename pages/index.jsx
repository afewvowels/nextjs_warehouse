import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/index.module.css'
import { useTransition, animated } from 'react-spring'
import React, { useState } from 'react'

export default function Home() {
  const [clicked, set_clicked] = useState(false)

  const iconTransitions = useTransition(clicked, null, {
    from: { position: 'absolute', opacity: 0, transform: 'scale(0.7)' },
    enter: { opacity: 1, transform: 'scale(1.0)' },
    leave: { opacity: 0, transform: 'scale(0.1)' },
  })

  const transitions = useTransition(clicked, null, {
    from: { position: 'absolute', opacity: 0, transform: 'translateY(-15px) scale(1)' },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    leave: { opacity: 0, transform: 'translateY(-5px) scale(0.1)' },
  })

  return (
    <>
      <Head>
        <title>Launch | Inventory</title>
      </Head>
      <div className={styles.wrapper}>
        <Link href='/bin'>
          <div className={styles.contentWrapper} onClick={() => set_clicked(true)}>
            <span className={styles.iconTopWrapper}>
              {iconTransitions.map(({item, key, props}) => (
                item ?
                  <animated.span key={key} className={`${styles.iconWrapperOut}`} style={props}>
                    <FontAwesomeIcon icon={['fas', 'asterisk']} />
                  </animated.span> :
                  <animated.span key={key} className={`${styles.iconWrapper}`} style={props}>
                    <FontAwesomeIcon icon={['fas', 'hand-receiving']} />
                  </animated.span>
              ))}
            </span>
            <span>
              {transitions.map(({item, key, props}) => (
                item ?
                  <animated.h1 key={key} style={props}>Loading</animated.h1> :
                  <animated.h1 key={key} style={props}>Welcome</animated.h1>
              ))}
            </span>
          </div>
        </Link>
      </div>
    </>
  )
}
