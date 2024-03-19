import React from 'react'
import Link from "next/link";

const Not_found = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
      <h1 className="font-bold text-light-red-1 dark:text-dark-red-1">Whoops, the requested page could not be found...</h1>
      <Link href="/" className="text-light-blue-1 dark:text-blue-1 hover:underline">Go back to Home</Link>
    </div>
  )
}

export default Not_found
