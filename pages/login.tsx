import { ReactElement } from "react"
import { Layout } from "@/components/Layout/Layout"

function LoginPage() {
    return (
     <>
        <h1>Login</h1>
     </>
    )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default LoginPage
