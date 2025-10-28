import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// PWA Orientation Management
if ('serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches) {
  // Intentar forzar orientación horizontal
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(err => {
      console.log('No se pudo forzar orientación horizontal:', err);
    });
  }
  
  // Escuchar cambios de orientación
  window.addEventListener('orientationchange', () => {
    // Pequeño delay para que el cambio de orientación se complete
    setTimeout(() => {
      if (window.orientation === 90 || window.orientation === -90) {
        // Landscape - optimal
        document.body.classList.add('landscape-mode');
        document.body.classList.remove('portrait-mode');
      } else {
        // Portrait - mostrar sugerencia
        document.body.classList.add('portrait-mode');
        document.body.classList.remove('landscape-mode');
      }
    }, 100);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 