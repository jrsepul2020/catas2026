import React, { useState, useEffect } from 'react';
import { Save, Palette, Type, Layout, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const Configuracion = () => {
  const [config, setConfig] = useState({
    // Colores principales
    primaryColor: '#333951',
    backgroundColor: '#f9fafb',
    textColor: '#333951',
    accentColor: '#ffffff',
    
    // Tipografía
    fontSize: '14',
    fontFamily: 'Inter',
    fontWeight: '400',
    
    // Layout
    sidebarWidth: '256',
    headerHeight: '64',
    borderRadius: '8',
    
    // Aplicación
    appName: 'VIRTUS',
    appSubtitle: 'Sistema de Gestión',
    companyName: 'Virtus Wine'
  });

  const [saved, setSaved] = useState(false);

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('virtus-config');
    if (savedConfig) {
      setConfig({ ...config, ...JSON.parse(savedConfig) });
    }
  }, []);

  // Aplicar estilos CSS personalizados
  useEffect(() => {
    const style = document.getElementById('dynamic-styles') || document.createElement('style');
    style.id = 'dynamic-styles';
    
    style.textContent = `
      :root {
        --primary-color: ${config.primaryColor};
        --background-color: ${config.backgroundColor};
        --text-color: ${config.textColor};
        --accent-color: ${config.accentColor};
        --font-size: ${config.fontSize}px;
        --font-family: ${config.fontFamily};
        --font-weight: ${config.fontWeight};
        --sidebar-width: ${config.sidebarWidth}px;
        --header-height: ${config.headerHeight}px;
        --border-radius: ${config.borderRadius}px;
      }
      
      .sidebar-custom {
        background-color: var(--primary-color) !important;
        width: var(--sidebar-width) !important;
      }
      
      .main-content {
        background-color: var(--background-color) !important;
        color: var(--text-color) !important;
        font-family: var(--font-family) !important;
        font-size: var(--font-size) !important;
        font-weight: var(--font-weight) !important;
      }
      
      .header-custom {
        height: var(--header-height) !important;
        background-color: var(--accent-color) !important;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .card-custom {
        border-radius: var(--border-radius) !important;
      }
      
      .text-primary-custom {
        color: var(--primary-color) !important;
      }
    `;
    
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
  }, [config]);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('virtus-config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Recargar la página para aplicar cambios
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleReset = () => {
    const defaultConfig = {
      primaryColor: '#333951',
      backgroundColor: '#f9fafb',
      textColor: '#333951',
      accentColor: '#ffffff',
      fontSize: '14',
      fontFamily: 'Inter',
      fontWeight: '400',
      sidebarWidth: '256',
      headerHeight: '64',
      borderRadius: '8',
      appName: 'VIRTUS',
      appSubtitle: 'Sistema de Gestión',
      companyName: 'Virtus Wine'
    };
    setConfig(defaultConfig);
    setSaved(false);
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333951] mb-2">Configuración</h1>
        <p className="text-gray-600">Personaliza la apariencia y configuración de la aplicación</p>
      </div>

      {/* Colores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#333951]">
            <Palette className="w-5 h-5" />
            Esquema de Colores
          </CardTitle>
          <CardDescription>
            Personaliza los colores principales de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Color Primario</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="backgroundColor">Color de Fondo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={config.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="textColor">Color de Texto</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={config.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={config.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="accentColor">Color de Acento</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={config.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipografía */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#333951]">
            <Type className="w-5 h-5" />
            Tipografía
          </CardTitle>
          <CardDescription>
            Configura la apariencia del texto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fontSize">Tamaño de Fuente (px)</Label>
              <Input
                id="fontSize"
                type="number"
                min="10"
                max="24"
                value={config.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="fontFamily">Familia de Fuente</Label>
              <select
                id="fontFamily"
                value={config.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333951]"
              >
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="fontWeight">Peso de Fuente</Label>
              <select
                id="fontWeight"
                value={config.fontWeight}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333951]"
              >
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#333951]">
            <Layout className="w-5 h-5" />
            Diseño y Layout
          </CardTitle>
          <CardDescription>
            Ajusta las dimensiones y espaciado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sidebarWidth">Ancho Sidebar (px)</Label>
              <Input
                id="sidebarWidth"
                type="number"
                min="200"
                max="400"
                value={config.sidebarWidth}
                onChange={(e) => handleChange('sidebarWidth', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="headerHeight">Alto Header (px)</Label>
              <Input
                id="headerHeight"
                type="number"
                min="48"
                max="100"
                value={config.headerHeight}
                onChange={(e) => handleChange('headerHeight', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="borderRadius">Radio de Bordes (px)</Label>
              <Input
                id="borderRadius"
                type="number"
                min="0"
                max="20"
                value={config.borderRadius}
                onChange={(e) => handleChange('borderRadius', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la App */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#333951]">
            <Monitor className="w-5 h-5" />
            Información de la Aplicación
          </CardTitle>
          <CardDescription>
            Personaliza los textos de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appName">Nombre de la App</Label>
              <Input
                id="appName"
                value={config.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="appSubtitle">Subtítulo</Label>
              <Input
                id="appSubtitle"
                value={config.appSubtitle}
                onChange={(e) => handleChange('appSubtitle', e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                id="companyName"
                value={config.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-gray-300 text-[#333951] hover:bg-gray-50"
        >
          Restablecer
        </Button>
        
        <Button
          onClick={handleSave}
          className="bg-[#333951] text-white hover:bg-[#2a2f42] flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Guardado ✓' : 'Guardar Cambios'}
        </Button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✓ Configuración guardada correctamente
          </p>
          <p className="text-green-600 text-sm mt-1">
            La página se recargará automáticamente para aplicar los cambios...
          </p>
        </div>
      )}
    </div>
  );
};

export default Configuracion;