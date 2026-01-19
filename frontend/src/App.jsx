import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DocumentProvider } from './context/DocumentContext';
import Home from './pages/Home';
import DocumentWorkspace from './pages/DocumentWorkspace';
import Hero from './pages/Hero';


function App() {
  return (
    <DocumentProvider>
      <Router> 
        <Routes>
          <Route path = "/" element = {<Hero/>}/>
          <Route path="/home" element={<Home />} />
          <Route path="/document/:id" element={<DocumentWorkspace />} />
        </Routes>
      </Router>
    </DocumentProvider>
  );
}

export default App;
