import '../scss/grid.scss'
import '../scss/styles.scss'
import Head from 'next/head'

export default function MyApp({ Component, pageProps, data }) {
  return (
  <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Component {...pageProps} />
  </>
  )
}

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}
