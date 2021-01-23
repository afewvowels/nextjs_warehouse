import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Home() {
  
  
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
            <FontAwesomeIcon icon={['fas', 'hand-receiving']} size='6x'/>
            <h1>Welcome</h1>
          </div>
        </Link>
      </div>
    </>
  )
}
