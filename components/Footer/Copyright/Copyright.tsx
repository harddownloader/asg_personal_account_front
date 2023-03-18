import { memo } from 'react'
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import { WEBSITE_NAME } from "@/lib/const"

const Copyright = (props: any) => {
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        className={"mt-8 mb-4"}
        {...props}
      >
        {'Copyright © '}
        <Link color="inherit" href="/">
          { WEBSITE_NAME }
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </>
  )
}

Copyright.displayName = 'Copyright'

export const CopyrightMemoized = memo(Copyright)
