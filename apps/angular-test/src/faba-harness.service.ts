import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FabaHarness {
  // Inicializamos con el tiempo actual para evitar condiciones de carrera
  private lastLongTaskEnd: number = performance.now();
  private observer: PerformanceObserver | undefined;

  /**
   * Inicia la auditoría. Se debe llamar dentro de afterNextRender
   * para garantizar que Angular ya tocó el DOM.
   */
  startAuditory() {
    // 1. Monitor de Tareas Largas (Long Tasks)
    // Usamos 'buffered: true' para saber si el renderizado inicial bloqueó el hilo
    // ANTES de que este servicio arrancara.
    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Calculamos cuándo TERMINÓ la tarea larga
          const taskEnd = entry.startTime + entry.duration;
          if (taskEnd > this.lastLongTaskEnd) {
            this.lastLongTaskEnd = taskEnd;
          }
        }
      });
      this.observer.observe({ type: 'longtask', buffered: true });
    } catch (e) {
      console.warn('⚠️ Long Task API no soportada en este navegador.');
    }

    // 2. Bucle de Verificación de Estabilidad (Polling)
    // Verificamos cada 100ms si el hilo ha estado libre por 300ms
    const intervalId = setInterval(() => {
      const now = performance.now();
      const timeSinceLastActivity = now - this.lastLongTaskEnd;

      if (timeSinceLastActivity >= 300) {
        clearInterval(intervalId);
        this.finalizeBenchmark(now);
      }
    }, 100);
  }

  private finalizeBenchmark(endTime: number) {
    if (this.observer) {
      this.observer.disconnect();
    }

    // A. Métricas de Red
    // Filtramos para obtener JS y Total
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalTransfer = resources.reduce((acc, r) => acc + r.transferSize, 0);
    // Buscamos scripts (.js) o el bundle main generado por Angular
    const jsResources = resources.filter(r => r.initiatorType === 'script' || r.name.endsWith('.js'));
    const jsTransfer = jsResources.reduce((acc, r) => acc + r.transferSize, 0);

    // B. Métrica FCP (First Contentful Paint)
    // Buscamos en el historial de performance paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(p => p.name === 'first-contentful-paint');
    const fcpTime = fcpEntry ? fcpEntry.startTime : 0;

    // C. Memoria (Solo Chromium)
    const memory = (performance as any).memory;
    const jsHeapUsed = memory ? memory.usedJSHeapSize : 0;
    const jsHeapTotal = memory ? memory.totalJSHeapSize : 0;

    // D. Construcción del Objeto Final
    const metrics = {
      network: {
        totalTransferredKB: totalTransfer / 1024,
        jsBundleKB: jsTransfer / 1024,
        requests: resources.length
      },
      performance: {
        FCPms: fcpTime,
        // El FTTS es el momento exacto donde se confirmó la estabilidad
        // (Restamos el buffer de seguridad de 300ms si queremos ser estrictos con el "fin de actividad",
        // pero para Faba reportamos el momento de confirmación o el último task + buffer)
        FTTSms: endTime 
      },
      memory: {
        jsHeapUsedMB: jsHeapUsed / (1024 * 1024),
        jsHeapTotalMB: jsHeapTotal / (1024 * 1024),
        note: memory ? "Captured via Chromium Performance API" : "Not available"
      }
    };

    // E. Exponer a Window para Puppeteer
    (window as any).fabaRawMetrics = metrics;

    console.log("📊 Faba Benchmark Complete:", metrics);
  }
}