# Faba-Green-UX-Tool
> ## Autor: Fabián Catalán | Diciembre 2025

## ¿Qué es Faba?

Faba es un proyecto de benchmark de eficiencia front-end que permite comparar diferentes frameworks de desarrollo web bajo condiciones controladas y reproducibles.  Esta eficiencia computada tiene el propósito de dar un apoyo al staff de desarrollo y diseño, alineando dichos resultados  con prácticas de Green UX  y enfoques afines*. En este proyecto teórico-práctico, viviré la experiencia del desarrollo sostenible y demostrar qué tanto impacto benéfico genera al cliente usando varias herramientas y módulos para medir variables de usabilidad, de rendimiento y consumo proxy de energía.

## Enfoque Green UX y corrientes afines aplicados al Frontend

> “No optimizar solo para el ahora, sino para la continuidad del sistema.”

### ¿Qué es Green UX y por qué importa?

Green UX (o diseño UX sostenible) es un enfoque que combina la experiencia de usuario (UX) tradicional con criterios de eficiencia energética, menor consumo de recursos y menor huella ambiental en productos digitales. En la práctica, se traduce en interfaces optimizadas, menos datos transferidos y navegación más sencilla, lo cual reduce el consumo de energía tanto en servidores como en dispositivos finales. ([B12](https://www.b12.io/glossary-of-web-design-terms/green-ux-sustainable-web-design))

Este enfoque toma en cuenta que cada clic, carga de página o consulta a la red implica consumo de energía y, por ende, emisiones. Aplicarlo de manera consciente puede minimizar dicho impacto sin sacrificar la calidad de la experiencia. ([B12](https://www.b12.io/glossary-of-web-design-terms/green-ux-sustainable-web-design))

Este enfoque se relaciona directamente con la **accesibilidad**, ya que interfaces más livianas, simples y eficientes favorecen a usuarios con dispositivos de bajo rendimiento, conexiones limitadas o necesidades especiales. Al reducir complejidad visual, peso de recursos y carga cognitiva, Green UX contribuye también a la inclusión digital, ampliando el acceso a experiencias funcionales para contextos sociales, económicos y tecnológicos diversos.

En un nivel más amplio, Green UX se alinea con el **Life-Centered Design**, al considerar no solo al usuario inmediato, sino también los efectos del diseño digital sobre la infraestructura, el entorno energético y las generaciones futuras. Desde esta perspectiva, el impacto del diseño se evalúa en términos de sostenibilidad y continuidad del sistema, no solo de eficiencia o conversión.

Finalmente, el **Performance Frontend** actúa como el medio técnico que hace posible este enfoque: optimización del uso de JavaScript, reducción de transferencia de datos, eficiencia en renderizado y control del consumo de recursos. Así, Green UX, accesibilidad e inclusión dejan de ser principios abstractos y se materializan en prácticas técnicas medibles y sostenibles.


## Efectividad de Green UX

### 1. Reduce consumo de recursos y emisiones digitales ([B12](https://www.b12.io/glossary-of-web-design-terms/green-ux-sustainable-web-design))

Green UX guía a diseñadores y desarrolladores a:

* comprimir recursos (imágenes, scripts),
* minimizar peticiones innecesarias,
* simplificar estructuras de navegación y contenido,
* y optimizar la carga de componentes para que la UI sea más “liviana”.

Estas prácticas reducen el trabajo del navegador, la red y los centros de datos, disminuyendo así el consumo de energía usado para servir y mostrar contenido al usuario. 

2. Mejora la experiencia y el rendimiento [(Solve)](https://solve.co.uk/ethical-business/benefits-of-sustainable-web-design/)

La sostenibilidad digital no solo beneficia al medio ambiente, sino que también mejora métricas de experiencia de usuario:

* menor tiempo de carga,
* mayor rapidez en interacción,
* menor tasa de abandono,
* mejor accesibilidad para conexiones lentas o dispositivos de gama baja.

Esto es coherente con los objetivos tradicionales de UX y permite que la sostenibilidad se convierta en una ventaja competitiva para plataformas digitales. 

3. Contribuye a accesibilidad e inclusión [(Hapy Design)](https://hapy.design/journal/importance-of-sustainable-ux-ui-design)

Diseños más simples y eficientes tienden a ser:

* más accesibles (menos distracciones, mejor legibilidad),
* más intuitivos (navegación clara),
* más inclusivos para usuarios con limitaciones técnicas o cognitivas.

Esto se debe a que se prioriza contenido esencial y rutas rápidas para alcanzar tareas, lo cual también minimiza la energía requerida para completar acciones. 

4. Beneficios para negocio y reputación [(Solve)](https://solve.co.uk/ethical-business/benefits-of-sustainable-web-design)

Además del impacto ambiental, hay beneficios directos para las organizaciones:

* Posicionamiento SEO mejorado gracias a páginas más rápidas.
* Reducción de costos operativos, al requerir menos ancho de banda y procesamiento. 
* Reputación de marca, al mostrar compromiso con la sostenibilidad.

Esto convierte a Green UX en algo relevante no solo para diseñadores y desarrolladores, sino también para equipos de producto y negocios.

### Qué estrategias son realmente efectivas 

#### Más efectivas

- Minimizar el peso del JS (el recurso más costoso en CPU).

- Aplicar imágenes responsivas, compresión y formatos modernos (WebP/AVIF).

- Lazy loading inteligente de componentes y recursos.

- Reducir complejidad de la UI y del árbol DOM.

- Evitar librerías pesadas si no son esenciales.

- Reducir llamadas redundantes a APIs.

- Priorizar frameworks más eficientes o builds optimizados.

#### Menos efectivas (pero positivas)

- cambiar tipografías o colores

- reducir animaciones

- ajustar pequeños detalles del layout

### Relación entre Green UX, Accesibilidad, inclusión y mantenibilidad [(Hapy Design)](https://hapy.design/journal/importance-of-sustainable-ux-ui-design)

#### Accesibilidad e Inclusión:

* facilita cumplimiento de WCAG (contraste, legibilidad, navegación clara).

* Se benefician del minimalismo, pero no dependen exclusivamente de él.

* Menor carga cognitiva y mejora de experiencia 'universal' (adultos mayores, usuarios analfabetistos, discapacidad visual)

* Mejoran si reduces ruido, peso y complejidad visual.

* Aseguran que productos “verdes” funcionen para todos, incluidos usuarios vulnerables.


#### Mantenibilidad:

* Es alta porque requiere ajustes constantes, auditorías, pruebas y estándares estrictos.

* No es técnicamente más difícil, pero sí más demandante en términos de gobernanza y control de calidad.


## Qué respaldan las fuentes

Las publicaciones especializadas en diseño sostenible señalan que:

* La web tiene un impacto ambiental considerable — incluso emisiones comparables a industrias intensivas en energía si se multiplica por miles de millones de usuarios. 
[(Green the web)](https://greentheweb.com/)

* El diseño sustentable se traduce en usabilidad y menor consumo de recursos, impactando positivamente la experiencia y sostenibilidad de los productos digitales. 
[(Hapy Design)](https://hapy.design/journal/importance-of-sustainable-ux-ui-design/)

* Reducir código innecesario y simplificar interfaces mejora tanto la experiencia de usuario como la eficiencia energética. 
[(B12)](https://www.b12.io/glossary-of-web-design-terms/green-ux-sustainable-web-design)

### 1) Cifras de impacto global de la tecnología digital

Por ejemplo, estimaciones recientes indican que el uso de internet y servicios digitales representa una proporción notable de emisiones globales (cerca de 3–4% en informes de sostenibilidad digital). 
[(wideagency.es)](https://www.wideagency.es/articles/la-alianza-entre-ux-y-ecologia-el-green-ux)

### 2) Casos reales de optimización

Hay casos de estudio reales que confirman que los principios del Green UX ofrecen ahorros ecológicos mesurables y mejoras para los usuarios, en especial para los dispositivos móviles [(eInfoChip)](https://www.einfochips.com/blog/design-for-sustainability-creating-a-greener-digital-world/). Green UX admite una amplia accesibilidad resultando sitios más livianos, inclusivos y esenciales para celulares de baja gama, antiguos o con baja cobertura.
[(Sovereign Magazine)](https://www.sovereignmagazine.com/business/green-ux-design-sets-new-standard-for-sustainable-digital-practices)

### 3) Herramientas de medición
Herramientas como Google Lighthouse, Website Carbon u otras especializadas permiten cuantificar mejoras en performance y, por ende, sostenibilidad de manera objetiva. Acá una lista enumerada por [marmelab (2022)](https://marmelab.com/blog/2022/04/05/greenframe-compare.html).

* GreenIT Analysis
* Website Carbon
* Digital Beacon
* GreenFrame (our tool)
* Ecograder
* PageSpeed Insight

### 4) Relación con accesibilidad e inclusión
Crear interfaces cn Green UX es pensar en accesibilidad como consecuencia del cumplimiento de WCAG, implicando interfaces inclusivas y para gran espectro de público. [(Hapy Design)](https://hapy.design/journal/importance-of-sustainable-ux-ui-design)

---

# Descripción general del proyecto Faba

Este proyecto explora el impacto del **framework frontend** y de las **librerías de UI** en el consumo de recursos digitales, desde una perspectiva de **Green UX, performance y sostenibilidad digital**.

A través de una comparación controlada entre distintas aplicaciones web equivalentes —construidas en diferentes frameworks— se busca medir y contrastar el costo técnico asociado a la carga, renderizado e interacción inicial de interfaces web modernas.

El foco no está en la experiencia de usuario percibida únicamente, sino en el **consumo subyacente de recursos**: transferencia de datos, ejecución de JavaScript, uso de CPU y memoria, los cuales influyen indirectamente en el consumo energético y la huella ambiental del software.

---

## Qué pretende hacer el proyecto

- Comparar el costo técnico de distintos frameworks frontend bajo condiciones equivalentes.
- Evaluar el impacto de usar **librerías UI pesadas vs livianas**.
- Medir cómo decisiones de arquitectura frontend afectan:
  - performance
  - consumo de recursos
  - eficiencia digital
- Proveer resultados reproducibles y comparables.
- Contribuir a la discusión técnica sobre **Green UX y sostenibilidad digital** desde datos medibles.

---

## Qué no cubre el proyecto

- Medición directa de consumo eléctrico.
- Impacto del backend o infraestructura.
- Emisiones exactas de CO₂.
- Experiencia de usuario subjetiva.
- Escenarios complejos de autenticación o estado global.

El enfoque es **frontend, comparativo y técnico**, orientado a concientizar y medir, no a certificar.

---

## Cómo lo hace

El proyecto consiste en **n+1 aplicaciones web independientes**:

- **n aplicaciones**: una por framework (React, Vue, Svelte, etc.)
- **1 aplicación master**: controlador y documentación del benchmark

Cada aplicación:
- implementa la misma funcionalidad
- presenta la misma UI (estructura y layout)
- consume el mismo volumen de datos
- se construye en modo producción
- se ejecuta de forma aislada

No se utilizan microfrontends para evitar contaminación de métricas por recursos compartidos.

---

## Metodología de medición

### Principios metodológicos

- Misma funcionalidad, mismo volumen de datos.
- Sin caches compartidas.
- Sin Service Workers.
- Sin analytics ni tracking.
- Medición desde APIs nativas del navegador.
- Ejecuciones repetidas para reducir ruido.
- Resultados expresados como promedio.

### Escenario base

- Consumo de una API pública (RandomUser).
- Renderizado de `n` usuarios en una grilla de 4 columnas.
- Control centralizado del valor `n`.
- UI equivalente en todos los frameworks.

---

## Qué métricas se miden

### Métricas de red
- Total transferido (KB)
- Número de requests
- Tamaño de bundles JS y CSS

### Métricas de performance
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time To Interactive (TTI)

### Métricas de ejecución
- JavaScript ejecutado
- Long Tasks (>50 ms)
- Main Thread Blocking Time

### Métricas de memoria
- Heap utilizado post-render (cuando está disponible)

Estas métricas se obtienen mediante:
- Performance API
- PerformanceObserver
- Resource Timing API
- Long Tasks API
- Memory API (Chrome)

---

## Método por framework

### React
- Build: Vite + React (production)
- UI:
  - Caso pesado: Material UI
  - Caso liviano: Chakra UI
- Consideraciones:
  - StrictMode desactivado para evitar doble render
  - Importaciones selectivas
- Interés técnico:
  - Overhead de reconciliación
  - Runtime y hooks

---

### Vue 3
- Build: Vite + Vue 3 (production)
- UI:
  - Caso pesado: Vuetify
  - Caso liviano: componentes base
- Consideraciones:
  - Composition API
  - Reactividad nativa
- Interés técnico:
  - Balance entre expresividad y runtime

---

### Svelte / SvelteKit
- Build: SvelteKit (adapter-static)
- UI:
  - Caso pesado: Svelte Material UI
  - Caso liviano: componentes nativos + CSS
- Consideraciones:
  - Lógica compilada
  - Mínimo runtime
- Interés técnico:
  - Reducción de JS ejecutado
  - Menor uso de CPU

---

## Resultados esperados

Los resultados se presentan como reportes comparativos en Markdown, incluyendo:

- Tablas de métricas
- Diferencias relativas entre frameworks
- Observaciones técnicas

Ejemplo de hallazgos esperables:
- Frameworks con menor runtime ejecutan menos JS.
- Librerías UI pesadas incrementan significativamente el consumo.
- Menor JS suele correlacionar con menor bloqueo del hilo principal.
- Diferencias pequeñas a nivel individual, pero relevantes a escala.

---

## Justificación técnica

Este proyecto se justifica porque:

- El frontend moderno representa una porción creciente del consumo digital.
- Las decisiones de framework y UI tienen impacto acumulativo en energía y red.
- Green UX no puede evaluarse solo desde la estética o la intención, sino desde métricas.
- La accesibilidad e inclusión se ven favorecidas por interfaces más livianas.
- La sostenibilidad digital requiere datos comparables y reproducibles.

Este benchmark no pretende declarar un “framework ganador”, sino **hacer visibles los costos técnicos invisibles** de decisiones comunes en el desarrollo frontend.

---



# 8. Ejemplo de Reporte Comparativo

**Benchmark Front-End – Carga de 200 Usuarios – UI Pesada (Material UI)**
Fecha: 2025-xx-xx
Repeticiones por modo: 20

---

## Resumen Ejecutivo

Svelte muestra mayor eficiencia en tamaño de bundle, menor JS blocking y mejor Time To Interactive (TTI). React entrega mayor estabilidad gráfica bajo alta carga, pero con un mayor costo de CPU y memoria.

---

## 1. Métricas Técnicas

### 1.1 Tamaño Transferido

| Framework | Bundle JS (KB) | Total Transferido (KB) |
| --------- | -------------- | ---------------------- |
| React     | 732 KB         | 890 KB                 |
| Svelte    | 284 KB         | 410 KB                 |

---

### 1.2 Tiempos de Carga (Promedio Cold Start)

| Métrica | React  | Svelte |
| ------- | ------ | ------ |
| FCP     | 1.21 s | 0.87 s |
| LCP     | 1.94 s | 1.42 s |
| TTI     | 2.41 s | 1.63 s |

---

### 1.3 CPU – Main Thread

| Métrica                   | React  | Svelte |
| ------------------------- | ------ | ------ |
| Long Tasks (>50 ms)       | 12     | 5      |
| Main-thread Blocking Time | 318 ms | 129 ms |

---

### 1.4 Memoria

| Métrica               | React | Svelte |
| --------------------- | ----- | ------ |
| Heap Used Post-Render | 92 MB | 54 MB  |

---

## 2. Interpretación

1. **Svelte requiere menos transferencia y ejecuta menos JavaScript**, reduciendo el bloqueo del hilo principal.
2. La diferencia en memoria sugiere menor overhead estructural en Svelte.
3. React mantiene mayor consistencia de render bajo estrés, a costa de mayor consumo de CPU.
4. Para escenarios móviles y enfoques de Green UX, **Svelte resulta más eficiente**.
5. Bajo una UI pesada (Material UI), ambos frameworks incrementan su consumo, pero Svelte mantiene una ventaja relativa.

---

## 3. Conclusión Técnica

Bajo condiciones equivalentes de UI, data y lógica, **Svelte presenta un menor costo computacional total**, reflejado en:

* menor peso de transferencia
* menor uso de CPU
* menor consumo de memoria
* interacción más rápida

React ofrece mayor madurez de ecosistema y robustez, pero con un costo de ejecución superior en este escenario de prueba.
