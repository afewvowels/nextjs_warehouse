import React from 'react'
import { useTransition, animated } from 'react-spring'
import styles from '@styles/templates.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Loading = ({loading}) => {
  const transitions = useTransition(loading, null, {
    from: { opacity: 0, transform: 'translateX(40px) scale(1.0)' },
    enter: { opacity: 1, transform: 'translateX(0px) scale(1.0)' },
    leave: { opacity: 0, transform: 'translateX(40px) scale(1.0)' },
  })

  return(<>
    {transitions.map(({item, key, props}) => (item &&
      <animated.span key={key} className={`${styles.loadingWrapper}`} style={props}>
        <FontAwesomeIcon icon={['fas', 'asterisk']} />
      </animated.span>
    ))}
  </>)
}

export default Loading