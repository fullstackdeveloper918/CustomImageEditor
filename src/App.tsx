import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ImageEditor from './ImageEditor';
import Cart from './Cart';

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
