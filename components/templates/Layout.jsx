export default function Layout({children}) {
  return(<>
    <header><p>Header</p></header>
    <main>{children}</main>
    <footer></footer>
  </>)
}