import { ReactElement, useEffect } from "react"
import { AccountLayout } from '@/components/Layout'
import user from "@/stores/userStore"
import { useRouter } from "next/router"


function Home() {
  const router = useRouter()
  useEffect(() => {
    checkUser()
  })

  const checkUser = async () => {
    const isUserAuth = await user.checkUserAuth()
    if (!isUserAuth) {
      await router.push("/login")
    }

    return
  }

  return (
    <>
      <p>Home</p>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default Home
