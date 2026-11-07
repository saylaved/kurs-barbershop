import { About } from "@/components/site/about"
import { Contacts } from "@/components/site/contacts"
import { Gallery } from "@/components/site/gallery"
import { Header } from "@/components/site/header"
import { Hero } from "@/components/site/hero"
import { Services } from "@/components/site/services"
import { Team } from "@/components/site/team"

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex flex-col">
        <Hero />
        <About />
        <Services />
        <Team />
        <Gallery />
        <Contacts />
      </main>
    </>
  )
}
