import Navbar from '@templates/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from '@styles/templates.module.css';

const Header = () => {
  return (
    <header className={styles.headerMain}>
      <div className={styles.headerTitle}>
        <FontAwesomeIcon icon={['fas', 'warehouse']}/>
        <h1>Inventory</h1>
      </div>
      <Navbar/>
    </header>)
}

export default Header