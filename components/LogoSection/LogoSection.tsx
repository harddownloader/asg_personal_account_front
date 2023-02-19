import Link from "next/link"

export const LogoSection = () => {
  return (
    <>
      <Link href="/">
        <img
          src="/img/logo/logo.png"
          alt="logo"
          className={"h-10"}
        />
      </Link>
    </>
  )
}

export default LogoSection
