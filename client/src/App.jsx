// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<div className="p-20 text-center text-primary font-bold">Página de Servicios (En Construcción)</div>} />
          <Route path="/admin" element={<div className="p-20 text-center text-primary font-bold">Página Admin (En Construcción)</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;