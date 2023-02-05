export interface AuthLayoutProps {
  children?: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div className="align-middle flex flex-col flex-grow">{children}</div>
    </>
  )
}

export default AuthLayout
