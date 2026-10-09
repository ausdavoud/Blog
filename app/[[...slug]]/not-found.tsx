import Link from "next/link"
import Header from "../components/Header";

export const metadata = {
  title: "Page Not Found"
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col my-auto py-6 gap-6 mx-8 min-w-0 flex-1 max-w-screen-sm">
      <Header />
      <h1 className="text-4xl">Not Found !</h1>
      <h2 className="text-xl">Looks like the page you are looking for is not here</h2>
      <p>If you are a visitor then you can go back to home page using <Link className="text-sky-600 dark:text-sky-400" href={'/'}>this</Link> link.
      If you are the owner then check the file name and headers then try again.</p>
    </main>
  )
}
