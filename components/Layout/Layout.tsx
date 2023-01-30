import { Navbar } from "../Navbar"

export interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <div className="align-middle flex flex-col flex-grow">{children}</div>
    </>
  )
}

export default Layout
