import { memo } from 'react'
import { CopyrightMemoized } from './Copyright'

const Footer = ({}) => {
  return (
    <>
      <footer className={'w-full'}>
        <CopyrightMemoized />
      </footer>
    </>
  )
}

Footer.displayName = 'Footer'

export const FooterMemoized = memo(Footer)
