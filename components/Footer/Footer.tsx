import { memo } from 'react'
import { Copyright } from './Copyright'

export const Footer = memo(({}) => {

  return (
    <>
      <footer className={'w-full'}>
        <Copyright />
      </footer>
    </>
  )
})
