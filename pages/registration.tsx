import { ReactElement } from "react"
import { Layout } from "@/components/Layout/Layout"

function RegistrationPage() {
    return (
        <>
            <h1>Registration</h1>
        </>
    )
}

RegistrationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default RegistrationPage
