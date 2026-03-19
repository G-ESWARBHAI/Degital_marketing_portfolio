import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ToolsSection from './components/ToolsSection';
import ServicesSection from './components/ServicesSection';
import ProjectsGallery from './components/ProjectsGallery';
import Contact from './components/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const HomeLayout = () => (
  <div className="flex min-h-screen">
    <Navbar />
    <main className="flex-1 min-w-0">
      <section id="home"><Hero /></section>
      <section id="about"><About /></section>
      <section id="tools"><ToolsSection /></section>
      <ServicesSection />
      <ProjectsGallery />
      <Contact />
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
