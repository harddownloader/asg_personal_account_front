import Link from "next/link"
import React from "react"

import { Navbar } from "@/components/Navbar"

function Custom404() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="py-10">
          <header className="mb-4">
            <div className="container px-8">Страница не найдена</div>
          </header>
          <main>
            <div className="container px-8">
              <Link href={"/"} passHref>
                Вернуться домой
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Custom404
