import React from 'react'
import styles from '@styles/templates.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Navbar = () => {
  const router = useRouter()
  return (
    <nav className={styles.navbarMain}>
      <ul>
        <Link href='/bin'>
          {router.pathname.includes('bin') ? <li style={{textDecoration: 'underline'}}>Bins</li> : <li>Bins</li>}
        </Link>
        <Link href='/prototype'>
          {router.pathname.includes('prototype') ? <li style={{textDecoration: 'underline'}}>Prototypes</li> : <li>Prototypes</li>}
        </Link>
        <Link href='/item'>
          {router.pathname.includes('item') ? <li style={{textDecoration: 'underline'}}>Items</li> : <li>Items</li>}
        </Link>
        <Link href='/group/category'>
          {router.pathname.includes('category') ? <li style={{textDecoration: 'underline'}}>Categories</li> : <li>Categories</li>}
        </Link>
        <Link href='/group/tag'>
          {router.pathname.includes('tag') ? <li style={{textDecoration: 'underline'}}>Tags</li> : <li>Tags</li>}
        </Link>
      </ul>
    </nav>)
}

export default Navbar