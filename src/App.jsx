import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TerrainDetail } from './MainPage/TerrainDetail';
import { MainPage } from './MainPage';
import { CompareProvider } from './context/CompareContext';
import { CompareBar } from './componentes/CompareBar';
import { Layout } from './layouts/LayoutMain';

function App() {
  return (

    <BrowserRouter>

        <div className="min-h-screen pb-16"> {/* Add padding bottom for CompareBar */}
          <Routes>
            <Route path="/" element={
              <Layout>
                <MainPage />
              </Layout>
            } />
            <Route path="/terreno/:id" element={
              <Layout>
                <TerrainDetail />
              </Layout>
            } />
            {/* <Route path="/account" element={
              <Layout>
                <Account />
              </Layout>
            } /> */}
            {/* ...otras rutas... */}
          </Routes>
        </div>

    </BrowserRouter>

  );
}

export default App;