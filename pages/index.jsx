import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useSpring, animated} from 'react-spring'

export default function Home() {
  const iconProps = useSpring({from: {opacity: 0, transform: 'scale(0.5)'}, to: {opacity: 1, transform: 'scale(1.0)'}})
  const welcomeProps = useSpring({from: {opacity: 0, transform: 'translateY(0) scale(0.9)'}, to: {opacity: 1, transform: 'translateY(0) scale(1)'}, delay: 450})
  
  return (
    <>
      <style jsx>{`
        .wrapper {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 3fr 1fr;
          height: 100vh;
          width: 100%;
          align-items: center;
          justify-items: center;
        }
        .contentWrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 12rem;
          height: 100%;
          cursor: pointer;
        }
        .contentWrapper > h1 {
          font-size: 2.65rem;
          margin: 0.75rem 0 0 0;
          font-weight: 500;
        }
      `}</style>
      <div className='wrapper'>
        <Link href='/bin'>
          <div className='contentWrapper'>
            <animated.span style={iconProps}>
              <FontAwesomeIcon icon={['fas', 'hand-receiving']} size='6x'/>
            </animated.span>
            <animated.h1 style={welcomeProps}>Welcome</animated.h1>
          </div>
        </Link>
      </div>
    </>
  )
}
