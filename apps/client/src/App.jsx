// client/src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import { ConfigProvider } from "./context/ConfigContext";

const Services = lazy(() => import("./pages/Services"));
const Admin = lazy(() => import("./pages/Admin"));

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
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Layout>
                  <Services />
                </Layout>
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Admin />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
