import React, { useLayoutEffect, useState, useCallback } from 'react'
import Title from '@templates/Title'
import Tag from '@components/elements/Tag'
import styles from '@styles/elements.module.css'
import { useTrail, animated } from 'react-spring'
import { trailSet } from '@utils/springParams'

const Tags = ({tags, categories, category}) => {
  let tagsArr = []

  tags.map((tag, index) => {
    if (category == 'all' || tag.category_uuid == category) {
      tagsArr.push(tags[index])
    }
  })

  const [trail] = useTrail(tagsArr.length, () => ({
    config: trailSet.configSimple,
    from: trailSet.fromSimple,
    to: trailSet.endSimple
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Tag tag={tagsArr[index]} categories={categories} /></animated.span>
    })}
  </div>)
}

const Tags1 = ({tags, categories, category}) => {
  let tagsArr = []

  tags.map((tag, index) => {
    if (index % 2 == 0) {
      if (category == 'all' || tag.category_uuid == category) {
        tagsArr.push(tags[index])
      }
    }
  })

  const [trail] = useTrail(tagsArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromLeft,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Tag tag={tagsArr[index]} categories={categories} /></animated.span>
    })}
  </div>)
}

const Tags2 = ({tags, categories, category}) => {
  let tagsArr = []

  tags.map((tag, index) => {
    if (index % 2 == 1) {
      if (category == 'all' || tag.category_uuid == category) {
        tagsArr.push(tags[index])
      }
    }
  })

  const [trail] = useTrail(tagsArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromRight,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Tag tag={tagsArr[index]} categories={categories} /></animated.span>
    })}
  </div>)
}

function useSize() {
  const [size, set_size] = useState([0])

  useLayoutEffect(() => {
    function updateWindowSize() {
      set_size([window.innerWidth])
    }
    window.addEventListener('resize', updateWindowSize)
    window.addEventListener('orientationchange', updateWindowSize)
    updateWindowSize()
    return () => {
      window.removeEventListener('resize', updateWindowSize)
      window.removeEventListener('orientationchange', updateWindowSize)
    }
  }, [])
  return size
}

const Index = ({categories, tags}) => {
  const [category, set_category] = useState('all')
  const [size] = useSize()

  const categoryRef = useCallback(node => {
    if (node != null) {
      node.innerHTML = ''
      node.insertAdjacentHTML('beforeend','<option value="all">All</option>')
      categories.forEach(category => {
        node.insertAdjacentHTML('beforeend',`<option value=${category.uuid}>${category.name}</option>`)
      })
    }
  }, [categories])

  return (<>
    <Title title='tags' addUrl='/group/tag/add' />
    <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Category Select</h3>
        <select
          value={category}
          onChange={e => set_category(e.target.value)}
          ref={categoryRef}></select>
      </span>
    </section>
    <section className={styles.elementWrapper}>
      {(size > 666) ? <><Tags1 tags={tags} categories={categories} category={category} />
        <Tags2 tags={tags} categories={categories} category={category} /></> : <Tags tags={tags} categories={categories} category={category} />}
    </section>
  </>)
}

export async function getServerSideProps() {
  let categoryRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
  let categories = await categoryRes.json()

  let tagRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/tag')
  let tags = await tagRes.json()

  return { props: { categories, tags } }
}

export default Index