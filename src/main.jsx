import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { orientationUtils } from '@/utils/orientationUtils.js'

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
      })
      .catch((error) => {
        console.log('❌ Service Worker falló:', error);
      });
  });
}

// Inicializar utilidades de orientación para Android
orientationUtils.initializePWA();

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 