import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import CatarVino from "./CatarVino";

import MisCatas from "./MisCatas";

import Tandas from "./Tandas";

import Muestras from "./Muestras";

import Configuracion from "./Configuracion";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    CatarVino: CatarVino,
    
    MisCatas: MisCatas,
    
    Tandas: Tandas,
    
    Muestras: Muestras,
    
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
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CatarVino" element={<CatarVino />} />
                
                <Route path="/MisCatas" element={<MisCatas />} />
                
                <Route path="/Tandas" element={<Tandas />} />
                
                <Route path="/Muestras" element={<Muestras />} />
                
                <Route path="/Configuracion" element={<Configuracion />} />
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