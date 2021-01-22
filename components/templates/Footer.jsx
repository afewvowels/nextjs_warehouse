import { randomSet } from '@components/modules/random/palette/palette'
import styles from '@styles/templates.module.css'

const Footer = () => {
  return(
    <footer className={styles.footerMain}>
      {/* <h6>Footer content</h6> */}
      <button onClick={randomSet}>Palette swap</button>
    </footer>
    )
}

export default Footer