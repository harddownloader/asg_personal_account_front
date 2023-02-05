import clsx from "clsx"
import { HTMLAttributes } from "react"

export type ButtonProps = Pick<HTMLAttributes<{}>, "className" | "onClick" | "children">

export function Button({ className, ...rest }: ButtonProps) {
  /* eslint react/button-has-type: off */
  return <button className={clsx("btn-primary", className)} {...rest} />
}
