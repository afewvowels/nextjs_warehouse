import Title from '@templates/Title'
import Category from '@components/elements/Category'
import Head from 'next/head'

import styles from '@styles/elements.module.css'

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

const Index = ({categories, tags}) => {
  return(<>
    <Head>
      <title>Categories | Inventory</title>
    </Head>
    <Title title='categories' addUrl='/group/category/add' />
    <section className={styles.elementWrapper}>
      <Categories1 categories={categories} tags={tags} />
      <Categories2 categories={categories} tags={tags} />
    </section>
  </>)
}

export async function getServerSideProps() {
  let categoryRes = await fetch(process.env.URL + 'api/group/category')
  let categories = await categoryRes.json()

  let tagRes = await fetch(process.env.URL + 'api/group/tag')
  let tags = await tagRes.json()

  return { props: { categories, tags } }
}

export default Index