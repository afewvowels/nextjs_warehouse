import Title from '@templates/Title'
import Category from '@components/elements/Category'
import urls from '@public/urls.json'

import styles from '@styles/elements.module.css'

const Index = ({categories, tags}) => {
  console.log('categories count: ' + categories.length)
  console.log('tags length: ' + tags.length)

  return(<>
    <Title title='categories' addUrl='/group/category/add' />
    <section className={styles.elementWrapper}>
      {categories.map((category, key) => (
        <Category category={category} tags={tags} key={key} />
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  let categoryRes = await fetch(urls.home + 'api/group/category')
  let categories = await categoryRes.json()

  let tagRes = await fetch(urls.home + 'api/group/tag')
  let tags = await tagRes.json()

  console.log('categories:')
  console.log(categories)
  console.log('tags:')
  console.log(tags)

  return { props: { categories, tags } }
}

export default Index