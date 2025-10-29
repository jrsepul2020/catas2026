import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import CatarVino from "./CatarVino";

import MisCatas from "./MisCatas";

import Tandas from "./Tandas";

import Muestras from "./Muestras";

import Catadores from "./Catadores";

import Mesas from "./Mesas";

import Empresas from "./Empresas";

import Welcome from "./Welcome";

import Configuracion from "./Configuracion";

import ConfiguracionInicial from "./ConfiguracionInicial";

import DatosEjemplo from "./DatosEjemplo";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Welcome: Welcome,
    
    CatarVino: CatarVino,
    
    MisCatas: MisCatas,
    
    Tandas: Tandas,
    
    Muestras: Muestras,
    
    Catadores: Catadores,
    
    Mesas: Mesas,
    
    Empresas: Empresas,
    
    Configuracion: Configuracion,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Welcome />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/CatarVino" element={<CatarVino />} />
                
                <Route path="/MisCatas" element={<MisCatas />} />
                
                <Route path="/Tandas" element={<Tandas />} />
                
                <Route path="/Muestras" element={<Muestras />} />
                
                <Route path="/Catadores" element={<Catadores />} />
                
                <Route path="/Mesas" element={<Mesas />} />
                
                <Route path="/Empresas" element={<Empresas />} />
                
                <Route path="/Configuracion" element={<Configuracion />} />
                
                <Route path="/setup" element={<ConfiguracionInicial />} />
                
                <Route path="/datos-ejemplo" element={<DatosEjemplo />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}