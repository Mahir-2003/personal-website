import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import Home from './pages/Home';
import Navigation from './components/Navigation';
import { LoadingProvider, useLoading } from './hooks/useLoading';
import './App.css'
import About from './pages/About';
import Projects from './pages/Projects';
import TechStack from './pages/TechStack';
import Blog from './pages/Blog';

function AppContent() {
  const { isLoading, currentPath } = useLoading();

  return (
    <div className='min-h-screen text-white'>
      {/* Skip navigation link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-400 focus:text-black focus:rounded focus:font-bold"
      >
        Skip to main content
      </a>
      {/* The LoadingProvider now handles the loading screen and content visibility */}
      <Navigation />
      <main role="main" aria-label="Main content" id="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/personal-log' element={<About />} />
          <Route path='/projects' element={<Projects/>}/>
          <Route path='/tech-stack' element={<TechStack/>} />
          <Route path='/blog' element={<Blog/>}/>
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </Router>
  )
}

export default App