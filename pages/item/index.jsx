import Title from '@templates/Title'
import urls from '@public/urls.json'
import styles from '@styles/elements.module.css'
import Item from '@components/elements/Item'

const Index = ({items}) => {
  return(<>
    <Title title='items' addUrl='/item/add' />
    <section className={styles.elementWrapper}>
      {items.map((item, key) => (
        <Item item={item} key={key}/>
      ))}
    </section>
  </>)
}

export async function getServerSideProps() {
  let itemsRes = await fetch(urls.home + 'api/item')
  let items = await itemsRes.json()

  let prototypesRes = await fetch(urls.home + 'api/prototype')
  let prototypes = await prototypesRes.json()

  let binsRes = await fetch(urls.home + 'api/bin')
  let bins = await binsRes.json()

  items.forEach((item) => {
    prototypes.forEach((prototype) => {
      if (prototype.uuid == item.prototype_uuid) {
        item.prototype_name = prototype.name
        item.prototype_image_uuid = prototype.image_uuid
        item.prototype_icon = prototype.icon
        return
      }
    })

    bins.forEach((bin) => {
      if (bin.uuid == item.bin_uuid) {
        item.bin_name = bin.name
        item.bin_image_uuid = bin.image_uuid
        item.bin_icon = bin.icon
        return
      }
    })
  })

  return { props: { items } }
}

export default Index