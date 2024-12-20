import React from 'react';
import {Route, Routes } from 'react-router-dom';
import './App.css';
import ImageEditor from './Components/ImageEditor';
import Cart from './Components/Cart';

function App() {
  return (
    // <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ImageEditor />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    // </BrowserRouter>
  );
}

export default App;
