import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useSpring, animated} from 'react-spring'
import styles from '@styles/index.module.css'

export default function Home() {
  const iconProps = useSpring({from: {opacity: 0, transform: 'scale(0.5)'}, to: {opacity: 1, transform: 'scale(1.0)'}})
  const welcomeProps = useSpring({from: {opacity: 0, transform: 'translateY(0) scale(0.9)'}, to: {opacity: 1, transform: 'translateY(0) scale(1)'}, delay: 450})
  
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
          <div className={styles.contentWrapper}>
            <animated.span className={styles.iconWrapper} style={iconProps}>
              <FontAwesomeIcon icon={['fas', 'hand-receiving']} />
            </animated.span>
            <animated.h1 style={welcomeProps}>Welcome</animated.h1>
          </div>
        </Link>
      </div>
    </>
  )
}
