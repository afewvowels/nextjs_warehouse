import Head from 'next/head'
import Link from 'next/link'

const PageNotFound = () => {
  return(<>
    <Head>
      <title>404 | Page not found</title>
    </Head>
    <div>
      <p>404</p>
      <p>Page not found</p>
      <Link href='/'>
        <p>Go home</p>
      </Link>
    </div>
  </>)
}

export default PageNotFound