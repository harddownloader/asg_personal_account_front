import Link from "next/link"
import Image from "next/image"

export const LogoSection = () => {
  return (
    <>
      <Link href="/">
        <Image
          priority={true}
          src="/img/logo/logo.png"
          alt="logo"
          width="145"
          height="40"
          sizes="100vw"
          className={"h-10"}
        />
      </Link>
    </>
  )
}

export default LogoSection
