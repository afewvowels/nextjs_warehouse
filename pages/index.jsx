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
      <style jsx>{`
      `}</style>
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
