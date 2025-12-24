<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
// Importamos el JSON local (Vite lo resuelve automáticamente)
import usuariosData from './assets/users.json';

// Estado reactivo (Equivalente a useState)
const usuarios = ref([]);

// Lógica del Benchmark (Equivalente a useEffect)
let intervalId = null;
let observer = null;

const finalizeBenchmark = (endTime) => {
  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(r => r.initiatorType === 'script' || r.name.endsWith('.js'));
  
  const metrics = {
    network: {
      totalTransferredKB: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
      jsBundleKB: jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
      requests: resources.length
    },
    performance: {
      // En Vue, el FCP se captura igual via Performance API
      FCPms: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      FTTSms: endTime 
    },
    memory: {
      jsHeapUsedMB: (performance.memory?.usedJSHeapSize || 0) / (1024 * 1024),
      jsHeapTotalMB: (performance.memory?.totalJSHeapSize || 0) / (1024 * 1024)
    }
  };

  // Exponemos para Puppeteer (Dashboard de Faba)
  window.fabaRawMetrics = metrics;
  console.log("Vue 3 Benchmark (JSON Local) Complete:", metrics);
};

onMounted(() => {
  // 1. Carga de datos
  usuarios.value = usuariosData['results'];

  // 2. Harness Logics
  let lastLongTaskEnd = performance.now();
  
  observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const taskEnd = entry.startTime + entry.duration;
      if (taskEnd > lastLongTaskEnd) lastLongTaskEnd = taskEnd;
    }
  });
  
  try {
    observer.observe({ type: 'longtask', buffered: true });
  } catch (e) {
    console.warn('Long Task API no soportada');
  }

  // Polling de estabilidad
  intervalId = setInterval(() => {
    const now = performance.now();
    if (now - lastLongTaskEnd >= 300) {
      clearInterval(intervalId);
      observer.disconnect();
      finalizeBenchmark(now);
    }
  }, 100);
});

// Limpieza de memoria (Equivalente al return de useEffect)
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="bg"></div>
  <div class="content">
    <h1>Usuarios ({{ usuarios.length }})</h1>
    
    <div class="container">
      <div 
        v-for="(user, index) in usuarios" 
        :key="user.id?.value || index" 
        class="card"
      >
        <div class="avatar">
          {{ user.name.first[0] }}{{ user.name.last[0] }}
        </div>
        <div class="info">
          <h3>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</h3>
          <p>{{ user.email }}</p>
          <p>{{ user.cell }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Aquí irían los mismos estilos de tu versión de React.
   'scoped' garantiza que el CSS no manche otros componentes.
*/
</style>