import Title from '@templates/Title'
import Category from '@components/elements/Category'
import Head from 'next/head'

import styles from '@styles/elements.module.css'

const Index = ({categories, tags}) => {
  return(<>
    <Head>
      <title>Categories | Inventory</title>
    </Head>
    <Title title='categories' addUrl='/group/category/add' />
    <section className={styles.elementWrapper}>
      {categories.map((category, key) => (
        <Category category={category} tags={tags} key={key} />
      ))}
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