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
        {/* Hero is sticky — next section slides up over it */}
        <div style={{ position: 'sticky', top: 0, zIndex: 0 }}>
          <Hero />
        </div>
        <div style={{ position: 'relative', zIndex: 1, background: '#000' }}>
          <ComoTrabajamos />
          <ElPrograma />
          <LoQueIncluye />
          <MidCTA />
          <Testimonios />
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  )
}
