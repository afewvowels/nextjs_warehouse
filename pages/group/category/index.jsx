import Title from '@templates/Title'
import Category from '@components/elements/Category'
import Head from 'next/head'
import React, { useLayoutEffect, useState } from 'react'
import { useTrail, animated } from 'react-spring'
import { trailSet } from '@utils/springParams'

import styles from '@styles/elements.module.css'

const Categories = ({categories, tags}) => {
  const [trail] = useTrail(categories.length, () => ({
    config: trailSet.configSimple,
    from: trailSet.fromSimple,
    to: trailSet.endSimple
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Category category={categories[index]} tags={tags} /></animated.span>
    })}
  </div>)
}

const Categories1 = ({categories, tags}) => {
  let categoriesArr = []

  categories.map((category, index) => {
    if (index % 2 == 0) {
      categoriesArr.push(category)
    }
  })

  const [trail] = useTrail(categoriesArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromLeft,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Category category={categoriesArr[index]} tags={tags} /></animated.span>
    })}
  </div>)
}

const Categories2 = ({categories, tags}) => {
  let categoriesArr = []

  categories.map((category, index) => {
    if (index % 2 == 1) {
      categoriesArr.push(category)
    }
  })

  const [trail] = useTrail(categoriesArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromRight,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Category category={categoriesArr[index]} tags={tags} /></animated.span>
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
  const [size] = useSize()
  return(<>
    <Head>
      <title>Categories | Inventory</title>
    </Head>
    <Title title='categories' addUrl='/group/category/add' />
    <section className={styles.elementWrapper}>
      {(size > 666) ? <><Categories1 categories={categories} tags={tags} /><Categories2 categories={categories} tags={tags} /></> : <Categories categories={categories} tags={tags} />}
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