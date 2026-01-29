// client/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Admin from "./pages/Admin";
import { ConfigProvider } from "./context/configContext";

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/servicios"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
