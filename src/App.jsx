import Navbar from './components/Navbar'
import Hero from './components/hero'
import About from './components/About'
import ToolsSection from './components/ToolsSection'
import ServicesSection from './components/ServicesSection'
import ProjectsGallery from './components/ProjectsGallery'
import Contact from './components/Contact'

function App() {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 min-w-0">
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="tools">
          <ToolsSection />
        </section>
        <ServicesSection />
        <ProjectsGallery />
        <Contact />
      </main>
    </div>
  )
}

export default App
