

import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Wine, LayoutDashboard, ClipboardList, LogOut, Download, Menu, Layers, Package, Settings, Users, MapPin, Home } from "lucide-react";
import PropTypes from 'prop-types';
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Inicio",
    url: createPageUrl("Welcome"),
    icon: Home,
  },
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Catar Vino",
    url: createPageUrl("CatarVino"),
    icon: Wine,
  },
  {
    title: "Mis Catas",
    url: createPageUrl("MisCatas"),
    icon: ClipboardList,
  },
  {
    title: "Tandas",
    url: createPageUrl("Tandas"),
    icon: Layers,
  },
  {
    title: "Muestras",
    url: createPageUrl("Muestras"),
    icon: Package,
  },
  {
    title: "Catadores",
    url: createPageUrl("Catadores"),
    icon: Users,
  },
  {
    title: "Mesas",
    url: createPageUrl("Mesas"),
    icon: MapPin,
  },
  {
    title: "Configuración",
    url: createPageUrl("Configuracion"),
    icon: Settings,
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const { catador, signOut } = useAuth();

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('La instalación PWA no está disponible en este momento. Asegúrate de estar usando HTTPS y que la app cumpla los requisitos de PWA.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      alert('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  const getUserInitials = () => {
    // Catador structure
    const displayName = catador?.nombre || catador?.email;
    if (!displayName) return "C";
    
    if (displayName.includes("@")) {
      // If it's an email, use first letter + first letter after @
      const [before, after] = displayName.split("@");
      return (before[0] + (after[0] || "")).toUpperCase();
    }
    
    // If it's a name, use first letters of words
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <style>{`
          :root {
            --primary: 33 27% 46%;
            --primary-foreground: 0 0% 100%;
          }
          
          /* Forzar colores del sidebar */
          [data-sidebar="sidebar"] {
            background-color: #333951 !important;
            border-right: 1px solid #4a5568 !important;
          }
          
          [data-sidebar="sidebar"] * {
            color: white !important;
          }
          
          [data-sidebar="sidebar"] [data-sidebar="menu-button"] {
            color: #d1d5db !important;
          }
          
          [data-sidebar="sidebar"] [data-sidebar="menu-button"]:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: white !important;
          }
          
          [data-sidebar="sidebar"] [data-sidebar="menu-button"][data-active="true"] {
            background-color: rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            border-left: 4px solid white !important;
          }
          
          @media (display-mode: standalone) {
            body {
              -webkit-user-select: none;
              user-select: none;
            }
          }
        `}</style>
        
        <Sidebar className="border-r border-gray-700 bg-[#333951]">
          <SidebarHeader className="border-b border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Wine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">VIRTUS</h2>
                <p className="text-xs text-gray-300">Sistema de Gestión</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`transition-all duration-300 rounded-lg mb-1 ${
                          location.pathname === item.url 
                            ? 'bg-white/20 text-white border-l-4 border-white' 
                            : 'hover:bg-white/10 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-700 p-4 space-y-3">
            {/* Botón de instalación PWA - siempre visible */}
            {showInstallButton && (
              <Button
                onClick={handleInstallClick}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Instalar App
              </Button>
            )}

            {/* Perfil de usuario */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <Avatar className="w-10 h-10 border-2 border-white/20">
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {catador?.nombre || catador?.email || "Catador"}
                </p>
                <p className="text-xs text-gray-300 truncate">{catador?.email || ""}</p>
              </div>
            </div>

            {/* Botón de cerrar sesión */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full !text-white !border-white/20 hover:!bg-white/10 hover:!text-white flex items-center justify-center gap-2 border"
              style={{
                color: 'white !important',
                borderColor: 'rgba(255, 255, 255, 0.2) !important'
              }}
            >
              <LogOut className="w-4 h-4" style={{ color: 'white' }} />
              <span style={{ color: 'white' }}>Cerrar Sesión</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gray-50">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
            <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200">
              <Menu className="w-5 h-5 text-[#333951]" />
            </SidebarTrigger>
            <h1 className="text-xl font-bold text-[#333951]">VIRTUS</h1>
            <span className="text-sm text-gray-500">Sistema de Gestión de Catas</span>
          </header>

          <div className="flex-1 overflow-auto p-0">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

