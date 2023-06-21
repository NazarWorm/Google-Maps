import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Index from './assets/pages/Index';
import Main from './assets/pages/Main';
import About from './assets/pages/About';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<><Index/></>} />
          <Route path='/main' element={<><Main/></>}/>
          <Route path='/about' element={<><About/></>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
