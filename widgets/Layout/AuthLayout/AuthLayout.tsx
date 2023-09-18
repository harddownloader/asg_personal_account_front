import { ReactNode } from 'react'

export interface AuthLayoutProps {
  children?: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div className="align-middle flex flex-col flex-grow">{children}</div>
    </>
  )
}
