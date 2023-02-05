import { Navbar } from "@/components/Navbar"

export interface AccountLayoutProps {
  children?: React.ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="align-middle flex flex-col flex-grow">{children}</div>
    </>
  )
}

export default AccountLayout
