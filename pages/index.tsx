import { ReactElement } from "react"
import Head from 'next/head'
import { Layout } from '@/components/Layout'

function Home() {
  return (
    <>
      <p>Home</p>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
