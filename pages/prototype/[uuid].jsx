import React from 'react'
import SimpleTitle from '@templates/SimpleTitle'
import Prototype from '@components/elements/Prototype'

import styles from '@styles/elements.module.css'

const Index = ({prototype, categories, tags}) => {
  return (<>
    <SimpleTitle title='View Prototype'/>
    <section className={styles.elementWrapper}>
      <Prototype prototype={prototype} categories={categories} tags={tags} startOpen={true}/>
    </section>
  </>)
}

export async function getServerSideProps({params}) {
  let res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/prototype/' + params.uuid)
  let prototype = await res.json()

  res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/category')
  let categories = await res.json()

  res = await fetch(process.env.NEXT_PUBLIC_URL + 'api/group/tag')
  let tags = await res.json()

  return { props: { prototype, categories, tags } }
}

export default Index