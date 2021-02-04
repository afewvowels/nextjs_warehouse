import Title from '@templates/Title'
import Prototype from '@components/elements/Prototype'
import styles from '@styles/elements.module.css'
import React, { useLayoutEffect, useState, useCallback } from 'react'
import { useTrail, animated } from 'react-spring'
import { trailSet } from '@utils/springParams'

const Prototypes = ({prototypes, categories, tags, category}) => {
  let prototypesArr = []

  prototypes.map((prototype, index) => {
    if (category == 'all' || prototype.category_uuid == category) {
      prototypesArr.push(prototypes[index])
    }
  })

  const [trail] = useTrail(prototypesArr.length, () => ({
    config: trailSet.configSimple,
    from: trailSet.fromSimple,
    to: trailSet.endSimple
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Prototype prototype={prototypesArr[index]} categories={categories} tags={tags}/></animated.span>
    })}
  </div>)
}

const Prototypes1 = ({prototypes, categories, tags, category}) => {
  let prototypesArr = []

  prototypes.map((prototype, index) => {
    if (index % 2 == 0) {
      if (category == 'all' || prototype.category_uuid == category) {
        prototypesArr.push(prototypes[index])
      }
    }
  })

  const [trail] = useTrail(prototypesArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromLeft,
    to: trailSet.endLR
  }))

  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Prototype prototype={prototypesArr[index]} categories={categories} tags={tags}/></animated.span>
    })}
  </div>)
}

const Prototypes2 = ({prototypes, categories, tags, category}) => {
  let prototypesArr = []

  prototypes.map((prototype, index) => {
    if (index % 2 == 1) {
      if (category == 'all' || prototype.category_uuid == category) {
        prototypesArr.push(prototypes[index])
      }
    }
  })

  const [trail] = useTrail(prototypesArr.length, () => ({
    config: trailSet.configLR,
    from: trailSet.fromRight,
    to: trailSet.endLR
  }))


  return(<div className={styles.elementWrapperColumn}>
    {trail.map((props,index) => {
      return <animated.span style={props} key={index}><Prototype prototype={prototypesArr[index]} categories={categories} tags={tags}/></animated.span>
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

const Index = ({prototypes, categories, tags}) => {
  const [category, set_category] = useState('all')
  // const [tag, set_tag] = useState('all')
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

  // const tagsRef = useCallback(node => {
  //   if (node != null) {
  //     node.innerHTML = ''
  //     node.insertAdjacentHTML(`beforeend`,`<option value='all'>All</option>`)
  //     tags.map((tag, key) => {
  //       if (category == 'all' || tag.category_uuid == category) {
  //         node.insertAdjacentHTML(`beforeend`,`<option value=${tag.uuid}>${tag.name}</option>`)
  //       }
  //     })
  //   }
  // }, [category])

  return(<>
    <Title title='prototypes' addUrl='/prototype/add' />
    <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Category Select</h3>
        <select value={category}
          onChange={e => set_category(e.target.value)}
          ref={categoryRef}></select>
      </span>
    </section>
    {/* <section className={styles.elementSelectWrapper}>
      <span>
        <h3>Tag Select</h3>
        <select value={tag}
                onChange={e => set_tag(e.target.value)}
                ref={tagsRef}></select>
      </span>
    </section> */}
    <section className={styles.elementWrapper}>
      {(size > 666) ? <><Prototypes1 prototypes={prototypes} categories={categories} tags={tags} category={category} />
        <Prototypes2 prototypes={prototypes} categories={categories} tags={tags} category={category} /></> : <Prototypes prototypes={prototypes} categories={categories} tags={tags} category={category} />}
    </section>
  </>)
}

export async function getServerSideProps() {
  let prototypesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/prototype')
  let prototypes = await prototypesRes.json()

  let categoriesRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
  let categories = await categoriesRes.json()

  let tagsRes = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/tag')
  let tags = await tagsRes.json()

  return { props: { prototypes, categories, tags } }
}

export default Index