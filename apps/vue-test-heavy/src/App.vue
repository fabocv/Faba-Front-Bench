<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import usuariosData from './assets/users.json';

const usuarios = ref([]);

const finalizeBenchmark = (endTime) => {
  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(r => r.initiatorType === 'script' || r.name.endsWith('.js'));
  
  window.fabaRawMetrics = {
    network: {
      totalTransferredKB: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
      jsBundleKB: jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
      requests: resources.length
    },
    performance: {
      FCPms: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      FTTSms: endTime 
    },
    memory: {
      jsHeapUsedMB: (performance.memory?.usedJSHeapSize || 0) / (1024 * 1024)
    }
  };
  console.log("📊 Vue Heavy (Vuetify Custom UI) Complete", window.fabaRawMetrics);
};

onMounted(() => {
  usuarios.value = usuariosData['results'];

  let lastLongTaskEnd = performance.now();
  const observer = new PerformanceObserver((list) => {
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

  const intervalId = setInterval(() => {
    const now = performance.now();
    if (now - lastLongTaskEnd >= 300) {
      clearInterval(intervalId);
      observer.disconnect();
      finalizeBenchmark(now);
    }
  }, 100);
});
</script>

<template>
  <v-app >
    <div class="bg"></div>
    
    <div class="content">
      <h1>Usuarios Vuetify ({{ usuarios.length }})</h1>
      
      <div class="container">
        <v-card 
          v-for="(user, index) in usuarios" 
          :key="user.id?.value || index"
          class="card"
          flat
        >
          <div class="avatar">
            {{ user.name.first[0] }}{{ user.name.last[0] }}
          </div>
          
          <div class="info">
            <h3>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</h3>
            <p>{{ user.email }}</p>
            <p>{{ user.cell }}</p>
          </div>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<style>

html {
  height:100%;
}

body {
  margin:0;
}


.bg {
  background-image: linear-gradient(-60deg, #6c3 50%, #09f 50%);
  bottom:0;
  left:-50%;
  opacity:.5;
  position:fixed;
  right:-50%;
  top:0;
  z-index:-1;
}

.container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1em;
}

/* Agregamos un Media Query para que sea responsiva */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .container {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.content {
  background-color: rgba(255, 255, 255, .8);
  border-radius: .25em;
  box-shadow: 0 0 .25em rgba(0, 0, 0, .25);
  box-sizing: border-box;
  padding: 2rem; 
  text-align: center;
  overflow-y: auto;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 2%;
}

h1,h3, p {
  font-family:monospace;
}

p{
  font-size: small;
  text-overflow: ellipsis;
}

.card {
  background-color: azure;
  border-top: 6px solid #09f;
  border-radius: 8px;
  border-bottom-right-radius: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;            
  box-sizing: border-box; 
  margin: 0;              
  padding: 1.5rem;
}

.info {
  display: flex;
  flex-direction: column;
  color: black;
}

.avatar {
  display: flex;
  height: 120px;
  width: 120px;
  border-radius: 100%;
  font-size: xx-large;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  background-color: #6c3;
}
</style>