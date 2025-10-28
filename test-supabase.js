import { supabase } from './src/api/supabaseClient.js';

console.log('🔍 Probando conexión con Supabase...');

// Probar muestras
async function testMuestras() {
  try {
    console.log('📊 Probando tabla muestras...');
    const { data, error, count } = await supabase
      .from('muestras')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('❌ Error muestras:', error);
    } else {
      console.log('✅ Muestras encontradas:', count);
      console.log('📋 Primeras 3 muestras:', data?.slice(0, 3));
    }
  } catch (err) {
    console.error('💥 Error al probar muestras:', err);
  }
}

// Probar catadores
async function testCatadores() {
  try {
    console.log('👥 Probando tabla catadores...');
    const { data, error, count } = await supabase
      .from('catadores')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('❌ Error catadores:', error);
    } else {
      console.log('✅ Catadores encontrados:', count);
      console.log('📋 Primeros 3 catadores:', data?.slice(0, 3));
    }
  } catch (err) {
    console.error('💥 Error al probar catadores:', err);
  }
}

// Ejecutar pruebas
testMuestras();
testCatadores();