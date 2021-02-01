import React from 'react'
import SimpleTitle from '@templates/SimpleTitle'
import styles from '@styles/elements.module.css'
import Category from '@components/elements/Category'
import Tag from '@components/elements/Tag'

const Index = ({categories, tags}) => {
  return(<>
    <SimpleTitle title='groups' link='group' />
    <SimpleTitle title='categories' link='group/category'/>
    <section className={styles.elementWrapper}>
      {categories.map((category, key) => (
        <Category category={category} tags={tags} key={key} />
      ))}
    </section>
    <SimpleTitle title='tags' link='group/tag'/>
    <section className={styles.elementWrapper}>
      {tags.map((tag, key) => (
        <Tag tag={tag} categories={categories} key={key} />
      ))}
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