import Title from '@templates/Title'
import Category from '@components/elements/Category'
import Head from 'next/head'
import { useLayoutEffect, useState } from 'react'

import styles from '@styles/elements.module.css'

const Categories = ({categories, tags}) => {
  return(<><div className={styles.elementWrapperColumn}>
    {categories.map((category, key) => (
      (key <= Math.floor(categories.length/2)) ? <Category category={category} tags={tags} key={key} /> : null
    ))}
  </div><div className={styles.elementWrapperColumn}>
    {categories.map((category, key) => (
      (key > Math.floor(categories.length/2)) ? <Category category={category} tags={tags} key={key} /> : null
    ))}
  </div></>)
}

const Categories1 = ({categories, tags}) => {
  return(<div className={styles.elementWrapperColumn}>
    {categories.map((category, key) => (
      (key % 2 == 0) ? <Category category={category} tags={tags} key={key} /> : null
    ))}
  </div>)
}

const Categories2 = ({categories, tags}) => {
  return(<div className={styles.elementWrapperColumn}>
    {categories.map((category, key) => (
      (key % 2 == 1) ? <Category category={category} tags={tags} key={key} /> : null
    ))}
  </div>)
}

function useSize() {
  const [size, set_size] = useState([0])

  useLayoutEffect(() => {
    function updateWindowSize() {
      set_size([window.innerWidth])
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()
    return () => window.removeEventListener('resize', updateWindowSize)
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

export async function getStaticProps() {
  let categoryRes = await fetch(process.env.URL + 'api/group/category')
  let categories = await categoryRes.json()

  let tagRes = await fetch(process.env.URL + 'api/group/tag')
  let tags = await tagRes.json()

  return { props: { categories, tags }, revalidate: 5 }
}

export default Index