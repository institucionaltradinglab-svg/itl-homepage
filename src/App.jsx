import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ComoTrabajamos from './components/ComoTrabajamos'
import ElPrograma from './components/ElPrograma'
import LoQueIncluye from './components/LoQueIncluye'
import MidCTA from './components/MidCTA'
import Testimonios from './components/Testimonios'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ComoTrabajamos />
        <ElPrograma />
        <LoQueIncluye />
        <MidCTA />
        <Testimonios />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
