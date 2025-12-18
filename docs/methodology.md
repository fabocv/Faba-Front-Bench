# Metodología de Medición y Benchmark – Faba v1.1

## 1. Estrategia general

Faba utiliza una estrategia de **benchmark técnico comparativo**, basada en medición **in-process**, ejecuciones repetidas y agregación estadística.  
Cada aplicación bajo prueba (framework en ambiente **headless** + variante UI) es responsable de medir su propio rendimiento utilizando exclusivamente **APIs nativas del navegador**, evitando dependencias externas que puedan interferir con los resultados. 

El objetivo no es certificar consumo energético absoluto, sino **comparar costos técnicos relativos** asociados a decisiones de framework y arquitectura frontend, bajo condiciones controladas y reproducibles.

 El objetivo acotado de este benchmark es medir el costo real de entrar por primera vez a una aplicación (cold start), aislando el costo inicial del framework y su ecosistema base *(Ver punto 5. Ciclo de Medición.)*  
 
---

## 2. Alcance

Faba mide exclusivamente el cold start de una aplicación web:

- Primera carga.
- Caché limpia.
- Sin interacciones de usuario.
- Sin dependencias de red externas.

El objetivo es aislar el costo impuesto por el framework y su ecosistema base.

### 2.1 Tipo de testeo

- **Tipo**: Benchmark comparativo de rendimiento frontend.
- **Nivel**: Aplicación completa (no micro-benchmark).
- **Contexto**: Render inicial y estabilización del hilo principal.
- **Enfoque**: Las métricas de red corresponden exclusivamente a la descarga inicial de recursos estáticos (JS, CSS, fuentes), no a tráfico dinámico de APIs.

### 2.2 Limitaciones de Headless

Aunque emplear Headless implica que en la app medida:

- no representa GPU real,
- no representa thermal throttling,
- no representa móviles.


>Asumo este trade-off consciente de usar hradless como baseline y adjudico los resultados de estas pruebas a un ambiente limitado y cerrado de rendimiento de dichas aplicaciones.
---

## 3. Limpieza metodológica

Para asegurar resultados comparables y limpios:

- No se utilizan librerías externas de medición (Lighthouse, Web Vitals, etc.).
- No hay analytics, tracking ni Service Workers.
- No existen caches compartidas entre ejecuciones.
- El controlador no inyecta lógica de medición en las aplicaciones evaluadas.
- Todas las métricas provienen del runtime real del navegador.

Esto reduce ruido, overhead artificial y sesgos introducidos por herramientas externas.

---

## 4. Decisión arquitectónica clave

### 4.1 Medición distribuida y control pasivo

Cada aplicación evaluada:
- Mide internamente su ejecución.
- Agrega resultados de múltiples iteraciones.
- Expone únicamente métricas agregadas.

La aplicación controladora:
- Orquesta las ejecuciones.
- Define parámetros globales (por ejemplo, número de iteraciones).
- Recopila resultados finales.
- Normaliza y genera reportes.

El controlador **no mide rendimiento** ni ejecuta lógica dentro del sistema bajo prueba.

### 4.2 Dataset

- Dataset estático local (users.json)
- Tamaño: 1000 registros
- Estructura idéntica para todas las apps
- Tipo de carga: Media (Medium Load)

> El dataset de 1000 registros representa una carga media típica de aplicaciones de gestión o visualización de datos. Faba no evalúa escalabilidad asintótica ni complejidad algorítmica en esta versión (v1.x).

### 4.3 Tabla de Frameworks y testeos

| Framework	|baseline-light	| design-system-heavy |
|-----------|---------------|---------------------|
| VanillaJS | CSS plano / utilitario | Material Web Components|
| React |	CSS plano / utilitario	 | Material UI (MUI) |
| Angular |	CSS plano / utilitario | 	Angular Material |
| Vue 3* |	CSS plano / utilitario	 | Vuetify |
| Svelte |	CSS plano / utilitario | 	Svelte Material UI |
| SolidJS* |	CSS plano / utilitario | 	Material Web Components |

> (*) Disponibles para la Versión 1.2
---

## 5. Ciclo de medición

1. La aplicación inicia la medición inmediatamente antes del render inicial.
2. Se ejecuta el render inicial utilizando un dataset JSON local y determinista de 1000 registros, previamente disponible en la aplicación.
3. Durante el proceso se observan métricas mediante APIs nativas del navegador.
4. Se espera a que el navegador procese al menos un frame posterior al render inicial, detectado mediante requestAnimationFrame (rAF).
   > Esto evita cerrar la medición antes de que ocurra un paint efectivo o mientras aún exista trabajo de reconciliación pendiente.
5. La medición finaliza cuando no se detectan Long Tasks en el hilo principal durante una ventana continua de 300 ms (idleWindowMs).
6. El proceso se repite **M veces** bajo las mismas condiciones.
   > El número de iteraciones (M) es un parámetro definido por la aplicación controladora.
Cada aplicación evaluada ejecuta una única medición por invocación y no recibe información sobre el número total de iteraciones.

   >Para los resultados oficiales de Faba, se utiliza un valor fijo de M = 20, garantizando comparabilidad y estabilidad estadística.

7. Se calculan estadísticas agregadas a partir de las ejecuciones.
8. Los resultados finales se exponen a la aplicación controladora.

> Nota: requestAnimationFrame no se utiliza como métrica temporal en este proyecto, sino como una señal de sincronización con el pipeline de render del navegador.
---

### 5.1 Aislamiento de iteraciones y caché

Cada iteración de medición se ejecuta en un entorno completamente limpio, sin reutilización de caché ni estado previo.

Esto incluye la eliminación de caché HTTP, almacenamiento local, service workers y cualquier estado persistente del navegador.  
El objetivo es medir la experiencia de un usuario que accede a la aplicación por primera vez (cold start), aislando el costo inicial del framework y su ecosistema base.

### 5.2 Métricas medidas

#### Consideraciones sobre memoria

La métrica de memoria (performance.memory.usedJSHeapSize) se incluye solo como referencia secundaria y no forma parte del índice principal de eficiencia, debido a:

- Dependencia de motor (solo Chromium).
- Redondeo intencional por seguridad.
- Interferencia del Garbage Collector.

---

## 6. Iteraciones (M)

- Cada aplicación ejecuta **M iteraciones completas** del escenario definido.
- Valor por defecto: **M = 20**.
- `M` es un parámetro definido y manejado por la aplicación controladora.
- Los resultados reportados corresponden a valores **promediados**, con posibilidad de incluir desviación estándar.

Esto permite reducir variabilidad y capturar comportamientos consistentes.

> La desviación estándar se utiliza como indicador de estabilidad, no como criterio de exclusión de resultados.

---

## 7. Qué se envía al controlador

Cada aplicación envía **solo resultados agregados**, estructurados en un JSON normalizado:

- Metadata de la ejecución.
- Contexto del entorno.
- Métricas agregadas (mean, opcionalmente std).
- Indicadores derivados.
- Índice de eficiencia relativo.

No se envían resultados crudos de cada iteración por defecto.

---

## 8. Qué se maneja internamente en cada app

Internamente, cada aplicación:

- Almacena resultados individuales de cada iteración.
- Calcula estadísticas (promedio, desviación).
- Normaliza unidades.
- Deriva indicadores secundarios.

Estos datos pueden persistirse localmente (memoria, IndexedDB) solo con fines de auditoría o depuración, pero no forman parte de la salida estándar.

---

## 9. Métricas medidas

Todas las métricas se obtienen mediante **APIs nativas del navegador**, sin dependencias externas.

### Tabla de métricas

| Métrica | Qué mide / Importancia | Unidad | Cómo se mide y calcula |
|------|------------------------|--------|------------------------|
| Total Transferred | Volumen total de datos transferidos. Impacta red y energía | KB | Suma de `transferSize` desde Resource Timing |
| Requests Count | Número de solicitudes de red. Overhead de conexión | Cantidad | Conteo de entradas `resource` |
| JS Bundle Size | Peso total de JS descargado | KB | Filtrado por tipo `script` |
| CSS Bundle Size | Peso total de CSS descargado | KB | Filtrado por tipo `link` |
| FCP | Tiempo hasta primer contenido visible | ms | Performance Paint Timing |
| LCP | Tiempo hasta mayor contenido visible | ms | Largest Contentful Paint API |
| FTTS | Tiempo hasta interacción estable | ms | Derivado desde tareas largas + eventos |
| JS Execution Time | Tiempo total ejecutando JS | ms | Suma de ejecución de scripts |
| Long Tasks Count | Bloqueos del main thread >50 ms | Cantidad | Long Tasks API |
| Total Blocking Time | Tiempo total bloqueando el hilo principal | ms | Suma de long tasks |
| Max Long Task | Mayor bloqueo individual | ms | Máximo valor observado |
| Heap Used | Memoria JS utilizada post-render | MB | `performance.memory` (Chrome) |


FTTS (Faba Time To Stability) Tiempo transcurrido desde el inicio de la aplicación hasta que el render inicial se completa y el hilo principal permanece libre de Long Tasks durante un umbral continuo de 300 ms.

> Nota: FTTS es una métrica propia de Faba y no es equivalente al TTI definido por Lighthouse.
---

## 10. Métricas derivadas

A partir de las métricas base se calculan indicadores comparativos:

- **JS por registro renderizado**  
  `JS Bundle Size / número de elementos`
- **Tiempo de ejecución JS por registro**  
  `JS Execution Time / número de elementos`
- **Requests por registro**  
  `Requests Count / número de elementos`

Estos indicadores permiten evaluar **escalabilidad y costo marginal**.

---

## 11. Métricas derivadas

### Ocupación del hilo principal

La Main Thread Occupancy representa el porcentaje del tiempo total de medición durante el cual el hilo principal estuvo activo (scripting o rendering) frente a tiempo idle. Permite detectar saturación sostenida incluso sin Long Tasks individuales. 

Main Thread Occupancy es una métrica diagnóstica avanzada.
No participa en el cálculo del índice de eficiencia y no debe interpretarse como señal directa de costo energético.

## 12. Navegadores y motores

- Baseline oficial: Chromium (V8)
- Validación opcional: Firefox (Gecko)

La ejecución en Firefox permite validar que la eficiencia observada responde a decisiones arquitectónicas del framework y no a optimizaciones específicas de V8.

## 13. Línea base Vanilla JS

    Faba incluye una implementación en Vanilla JavaScript (DOM directo) como línea base técnica. Esta no compite en el ranking, sino que define el costo mínimo observable impuesto por el navegador.
---

## 14. Índice de eficiencia relativo

Se calcula un **índice compuesto y normalizado**, basado en métricas clave de red y ejecución.  
El índice es **relativo al conjunto comparado** y se utiliza exclusivamente para facilitar análisis comparativos, no como medida absoluta de eficiencia energética.

---

## 15. Qué no aborda esta metodología

- Medición directa de consumo eléctrico.
- Cálculo exacto de emisiones de CO₂.
- Impacto del backend o infraestructura.
- Experiencia de usuario subjetiva.
- Comportamiento en escenarios complejos de estado global o autenticación.

No se trata de pruebas sintéticas aisladas, sino de **escenarios funcionales equivalentes** ejecutados en condiciones homogéneas.

 > Los resultados de Faba representan el rendimiento del frontend en un entorno controlado (headless) y no pretenden replicar todas las variaciones del render visual en dispositivos reales.
 
 > Este enfoque aislado no pretende representar escenarios de uso recurrente ni sesiones prolongadas.

El foco es **frontend, técnico, comparativo y reproducible**.

---

## 16. Principio rector

> *Faba mide costos técnicos reales del frontend moderno utilizando prácticas estándar de benchmarking de sistemas, priorizando comparabilidad, transparencia y mínima interferencia.*

# Script de Normalización y Análisis Post-Proceso

### Rol del script en la arquitectura de Faba

El script de normalización es una herramienta de **análisis post-proceso**, ejecutada fuera del runtime de las aplicaciones evaluadas.  
Su función es **procesar, comparar y normalizar** los resultados agregados generados por cada aplicación medida, sin intervenir en la medición ni alterar los datos de origen.

Este script forma parte de la etapa de **análisis**, no de medición.

Apps medidas → JSON agregados → Controlador → Script de normalización → Reportes

---

### Principios metodológicos

El diseño del script sigue principios clásicos de benchmarking de sistemas:

- Separación estricta entre **sistema bajo prueba** y **herramientas de análisis**.
- Procesamiento offline de resultados.
- Normalización explícita y reproducible.
- Cálculo de métricas comparativas sin inferencias no documentadas.

El script **no ejecuta pruebas**, **no mide rendimiento** y **no introduce lógica adicional** en las aplicaciones evaluadas.

---

### Entradas del script

El script recibe como entrada un conjunto de archivos JSON, uno por cada aplicación evaluada, con métricas ya agregadas internamente tras **M iteraciones**.

Ejemplo de estructura de entrada:

```
/results
-  react-light.json
-  react-heavy.json
-  vue-light.json
-  vue-heavy.json
-  svelte-light.json
-  angular-heavy.json
```

Cada archivo debe cumplir el contrato de salida definido por Faba.

---

### Validación previa

Antes de realizar cualquier comparación, el script valida que:

- Todas las aplicaciones reporten el mismo escenario (`recordsRendered`, layout).
- El número de iteraciones coincida con el valor esperado (`M`).
- La condición de término de la medición sea idéntica.
- Las métricas base requeridas estén presentes.

Si una ejecución no cumple estos criterios, **se excluye del análisis**.

---

### Métricas utilizadas para normalización

El script utiliza únicamente métricas directamente asociadas al consumo de recursos:

- Tamaño total de JavaScript descargado (KB)
- Tiempo total de ejecución de JavaScript (ms)
- Total Blocking Time (ms)
- Número total de requests de red

Estas métricas se extraen desde los valores **promedio** reportados por cada aplicación.

---

### Normalización de métricas

Cada métrica se normaliza respecto al **peor caso observado** dentro del conjunto comparado, utilizando la siguiente fórmula:
```
m_norm = m_app / max(m_all_apps)
```

Esto produce valores en el rango `[0,1]`, donde:
- `1` representa el mayor costo relativo observado,
- valores menores indican mejor eficiencia relativa.

La normalización se realiza **por métrica**, de forma independiente.

---

### Cálculo del Relative Efficiency Index

El **Relative Efficiency Index** es un índice compuesto y ponderado, calculado a partir de las métricas normalizadas. Se considera como un **índice comparativo, y no absoluto**, por lo que un valor bajo no implica mala performance, solo menor eficiencia relativa dentro del grupo medido, dicho de otras palabras, un framework con menor puntaje puede ser perfectamente adecuado en términos absolutos. 

Pesos definidos:

- JavaScript descargado (KB): 0.30
- Tiempo de ejecución de JavaScript: 0.30
- Total Blocking Time: 0.25
- Número de requests: 0.15

> Estos pesos por defectos representan un perfil promedio hipotético con futuros ajustes y perfiles alternativos

Fórmula:
```
index =
JS_kb_norm * 0.30 +
JS_exec_norm * 0.30 +
TBT_norm * 0.25 +
REQ_norm * 0.15
```

El resultado es un valor entre `0` y `1`, donde **un valor menor indica mayor eficiencia relativa**, siempre dentro del conjunto comparado.

Este índice **no representa eficiencia energética absoluta**.

### Nota Editorial

> La ponderación del índice prioriza el impacto del JavaScript (descarga y ejecución) por considerarlo el principal factor de costo computacional y energético en el frontend moderno. Esta decisión puede favorecer arquitecturas que minimizan el trabajo en el cliente y penalizar SPAs tradicionales, lo cual es consistente con el objetivo de eficiencia técnica del benchmark.

> Diferentes contextos de uso podrían justificar ponderaciones distintas, lo cual queda fuera del alcance de esta versión.
---

### Métricas derivadas

Además del índice, el script calcula métricas derivadas no normalizadas, utilizadas para análisis e interpretación:

- JavaScript por elemento renderizado (KB/elemento)
- Tiempo de ejecución JS por elemento (ms/elemento)
- Requests por elemento

Estas métricas permiten evaluar **escalabilidad y costo marginal**, pero no influyen en el índice.

---

### Salidas del script

El script genera los siguientes artefactos:

- JSON normalizado por aplicación
- Tablas comparativas en formato Markdown
- Exportaciones opcionales en CSV

Estos resultados son utilizados para documentación, análisis técnico y comparación entre frameworks.

---

### Qué no hace el script

El script de normalización **no**:

- Mide rendimiento.
- Recolecta métricas desde el navegador.
- Modifica resultados originales.
- Ajusta pesos o métricas según resultados observados.
- Realiza inferencias directas sobre consumo energético o emisiones.

---

### Nota metodológica

> *El script de normalización de Faba aplica técnicas estándar de benchmarking de sistemas para facilitar la comparación relativa entre aplicaciones frontend. Todas las decisiones de normalización, ponderación y agregación están explícitamente documentadas y versionadas.*


---

## Limitaciones y sesgos conocidos

### Enfoque en Cold Start
- Faba mide exclusivamente el costo del primer acceso a una aplicación con caché limpia. No evalúa la eficiencia de navegación interna ni escenarios warm, lo que puede favorecer frameworks optimizados para cargas iniciales livianas y penalizar aquellos que optimizan interacciones posteriores.

### Índice de eficiencia relativo
- El Relative Efficiency Index es un indicador comparativo dentro del conjunto medido. Un puntaje bajo no implica bajo rendimiento absoluto, sino menor eficiencia relativa frente a otros frameworks del mismo experimento.

### Entorno Headless
- Las mediciones se realizan en navegadores headless para garantizar reproducibilidad y control. Este entorno no representa completamente el comportamiento de GPU, recolección de basura o restricciones térmicas presentes en dispositivos reales, especialmente móviles.

### Ponderación de métricas
- El índice compuesto utiliza pesos fijos documentados que representan un perfil de uso promedio. Diferentes contextos de usuario podrían priorizar métricas distintas (por ejemplo, bloqueo del hilo principal vs. tamaño de descarga).

### Conteo de requests

- El conteo de requests se utiliza como señal de complejidad de carga y gestión de recursos, no como estimación directa de latencia de red. En entornos HTTP/2+, su peso relativo podría ajustarse en versiones futuras.

# Ejemplo de salida JSON
```
{
  "meta": {
    "benchmark": "faba",
    "benchmarkVersion": "1.1.0",
    "framework": "react",
    "frameworkVersion": "18.3.0",
    "uiLibrary": "chakra-ui",
    "uiLibraryVersion": "2.8.0",
    "buildTool": "vite",
    "buildMode": "production",
    "appVariant": "light",
    "runs": 20,
    "coldStart": true,
    "runTimestamp": "2025-12-15T22:40:00Z"
  },

  "environment": {
    "browser": "Chromium",
    "browserVersion": "121.0",
    "engine": "v8",
    "mode": "headless",
    "platform": "Linux x86_64",
    "hardwareConcurrency": 8,
    "deviceMemoryGB": 16
  },

  "scenario": {
    "dataSource": "local-static-json",
    "description": "Dataset JSON local, estático y determinista, empaquetado con la aplicación",
    "recordsRendered": 1000,
    "layout": "grid-4-columns",
    "measurementEndCondition": "initial-render-complete-and-main-thread-idle-for-300ms"
  },

  "network": {
    "note": "Network metrics reflect bundle transfer only. No external network requests are performed.",
    "totalTransferredKB": {
      "mean": 342,
      "std": 18
    },
    "requests": {
      "mean": 26,
      "std": 2
    },
    "jsBundleKB": {
      "mean": 198,
      "std": 9
    },
    "cssBundleKB": {
      "mean": 44,
      "std": 4
    }
  },

  "performance": {
    "FCPms": {
      "mean": 912,
      "std": 47
    },
    "LCPms": {
      "mean": 1340,
      "std": 62
    }
  },

  "diagnostics": {
    "mainThreadOccupancyPct": {
      "mean": 67.4,
      "std": 3.2
    }
  },

  "execution": {
    "jsExecutionTimeMs": {
      "mean": 412,
      "std": 26
    },
    "longTasks": {
      "count": {
        "mean": 6,
        "std": 1
      },
      "totalBlockingTimeMs": {
        "mean": 284,
        "std": 21
      },
      "maxLongTaskMs": {
        "mean": 92,
        "std": 8
      }
    },
  },

  "memory": {
    "jsHeapUsedMB": {
      "mean": 46.2,
      "std": 3.1
    },
    "note": "Memory metrics are secondary and available only on Chromium-based browsers"
  },

  "derivedMetrics": {
    "jsPerRecordKB": 0.198,
    "jsExecutionPerRecordMs": 0.412,
    "requestsPerRecord": 0.026
  },

  "summary": {
    "relativeEfficiencyIndex": {
      "value": 0.42,
      "method": "weighted-normalized-index",
      "lowerIsBetter": true,
      "scope": "comparative-only"
    },
    "statistics": {
      "runs": 20,
      "aggregation": "mean",
      "includesStdDeviation": true
    }
  },

  "limitations": [
    "cold-start-only",
    "headless-environment",
    "no-internal-navigation-measured",
    "memory-metric-chromium-only",
    "relative-index-not-absolute"
  ]
}

```