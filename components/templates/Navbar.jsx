import styles from '@styles/templates.module.css'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className={styles.navbarMain}>
      <ul>
        <Link href='/bin'>
        <li>Bins</li>
        </Link>
        <Link href='/prototype'>
        <li>Prototypes</li>
        </Link>
        <Link href='/item'>
        <li>Items</li>
        </Link>
        <Link href='/group'>
        <li>Groups</li>
        </Link>
      </ul>
    </nav>)
}

export default Navbar