import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/index.module.css'
import { useSpring, useTransition, animated } from 'react-spring'
import { useState } from 'react'

export default function Home() {
  const [clicked, set_clicked] = useState(false)

  const iconProps = useSpring({from: {opacity: 0, transform: 'scale(0.5)'}, to: {opacity: 1, transform: 'scale(1.0)'}})

  const transitions = useTransition(clicked, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })


  return (
    <>
      <Head>
        <title>Launch | Inventory</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="HandheldFriendly" content="true"/>
        <meta name="MobileOptimized" content="width"/>

        <link rel="apple-touch-icon" type="image/png" href={require('../public/icons/apple-touch-icon.png')}/>
        <link rel="icon" type="image/png" sizes="32x32" href={require('../public/icons/favicon-32x32.png')} />
        <link rel="manifest" href='/manifest.json'/>
      </Head>
      <div className={styles.wrapper}>
        <Link href='/bin'>
          <div className={styles.contentWrapper} onClick={() => set_clicked(clicked => true)}>
            <animated.span className={styles.iconWrapper} style={iconProps}>
              <FontAwesomeIcon icon={['fas', 'hand-receiving']} />
            </animated.span>
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
