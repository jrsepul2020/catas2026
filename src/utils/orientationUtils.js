// Utilidades para manejo de orientación en Android
export const orientationUtils = {
  isAndroid: () => /Android/i.test(navigator.userAgent),
  
  isMobile: () => /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  
  isLandscape: () => window.screen.orientation 
    ? window.screen.orientation.angle !== 0 
    : window.orientation !== 0,
  
  lockLandscape: async () => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape-primary');
        console.log('🔒 Orientación bloqueada en landscape');
        return true;
      }
    } catch (error) {
      console.warn('⚠️ No se pudo bloquear la orientación:', error.message);
    }
    return false;
  },
  
  requestFullscreen: async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      console.log('🖥️ Pantalla completa activada');
      return true;
    } catch (error) {
      console.warn('⚠️ No se pudo activar pantalla completa:', error.message);
    }
    return false;
  },
  
  setupOrientationHandling: () => {
    // Handler para cambios de orientación
    const handleOrientationChange = () => {
      const isLandscape = orientationUtils.isLandscape();
      const isAndroid = orientationUtils.isAndroid();
      
      console.log(`📱 Orientación cambiada - Landscape: ${isLandscape}, Android: ${isAndroid}`);
      
      if (isAndroid && !isLandscape) {
        // Mostrar mensaje para rotar en Android
        orientationUtils.showRotateMessage();
      } else {
        orientationUtils.hideRotateMessage();
      }
      
      // Ajustar viewport
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    };
    
    // Listeners para diferentes eventos de orientación
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Check inicial
    setTimeout(handleOrientationChange, 100);
  },
  
  showRotateMessage: () => {
    let rotateMsg = document.getElementById('rotate-message');
    if (!rotateMsg) {
      rotateMsg = document.createElement('div');
      rotateMsg.id = 'rotate-message';
      rotateMsg.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #333951;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="font-size: 48px; margin-bottom: 20px;">📱➡️</div>
          <h2 style="font-size: 24px; margin-bottom: 10px; text-align: center;">Rota tu dispositivo</h2>
          <p style="font-size: 16px; text-align: center; opacity: 0.8;">
            Esta aplicación está optimizada para<br>
            orientación horizontal (landscape)
          </p>
        </div>
      `;
      document.body.appendChild(rotateMsg);
    }
    rotateMsg.style.display = 'block';
  },
  
  hideRotateMessage: () => {
    const rotateMsg = document.getElementById('rotate-message');
    if (rotateMsg) {
      rotateMsg.style.display = 'none';
    }
  },
  
  initializePWA: async () => {
    console.log('🚀 Inicializando PWA para Android...');
    
    const isAndroid = orientationUtils.isAndroid();
    const isMobile = orientationUtils.isMobile();
    
    if (isAndroid || isMobile) {
      // Configurar orientación
      orientationUtils.setupOrientationHandling();
      
      // Intentar bloquear orientación
      setTimeout(() => {
        orientationUtils.lockLandscape();
      }, 1000);
      
      // Prevenir comportamientos por defecto en Android
      document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
          e.preventDefault();
        }
      }, { passive: false });
      
      // Prevenir zoom con gestos
      document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
      });
      
      document.addEventListener('gesturechange', (e) => {
        e.preventDefault();
      });
      
      document.addEventListener('gestureend', (e) => {
        e.preventDefault();
      });
      
      console.log('✅ PWA configurado para Android');
    }
  },
  
  // Función para mostrar botón de instalación PWA
  setupInstallPrompt: () => {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('💾 PWA puede ser instalado');
      e.preventDefault();
      deferredPrompt = e;
      
      // Mostrar botón de instalación personalizado
      const installButton = document.getElementById('install-pwa-button');
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`🎯 Usuario ${outcome} la instalación`);
            deferredPrompt = null;
            installButton.style.display = 'none';
          }
        });
      }
    });
    
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA instalado exitosamente');
      deferredPrompt = null;
    });
  }
};

// Auto-inicializar cuando se carga el módulo
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    orientationUtils.initializePWA();
    orientationUtils.setupInstallPrompt();
  });
  
  // Si el DOM ya está cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', orientationUtils.initializePWA);
  } else {
    orientationUtils.initializePWA();
  }
}