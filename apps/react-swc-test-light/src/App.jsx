import { useEffect, useState } from 'react';
// Importamos el JSON local para que no haya latencia de red externa
import usuariosData from './assets/users.json'; 

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // 1. Carga de datos desde el JSON importado
    // Esto garantiza que React procesa exactamente lo mismo que Angular
    setUsuarios(usuariosData['results']);

    // 2. Lógica del HARNESS (Basada en faba-harness.service.ts)
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

    // Polling de estabilidad (300ms de silencio en el hilo principal)
    const intervalId = setInterval(() => {
      const now = performance.now();
      if (now - lastLongTaskEnd >= 300) {
        clearInterval(intervalId);
        observer.disconnect();
        finalizeBenchmark(now);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  const finalizeBenchmark = (endTime) => {
    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(r => r.initiatorType === 'script' || r.name.endsWith('.js'));
    
    // Calculamos métricas de red y memoria
    const metrics = {
      network: {
        totalTransferredKB: resources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
        jsBundleKB: jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0) / 1024,
        requests: resources.length
      },
      performance: {
        FCPms: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        FTTSms: endTime // Tiempo de "Silla Armada"
      },
      memory: {
        jsHeapUsedMB: (performance.memory?.usedJSHeapSize || 0) / (1024 * 1024),
        jsHeapTotalMB: (performance.memory?.totalJSHeapSize || 0) / (1024 * 1024)
      }
    };

    // Exponemos para el servidor de Puppeteer
    window.fabaRawMetrics = metrics;
    console.log("📊 React Benchmark (JSON Local) Complete:", metrics);
  };

  return (
    <>
      <div className="bg"></div>
      <div className="content">
        <h1>Usuarios ({usuarios.length})</h1>
        <div className="container">
          {usuarios.map((user, index) => (
            <div key={user.id || index} className="card">
              <div className="avatar">
                {user.name.first[0]}{user.name.last[0]}
              </div>
              <div className="info">
                <h3>{user.name.title} {user.name.first} {user.name.last}</h3>
                <p>{user.email}</p>
                <p>{user.cell}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;