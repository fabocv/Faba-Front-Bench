# Faba-Green-UX-Tool
> ### Autor: Fabián Catalán | Diciembre 2025

> Estado: En desarrollo (Q1 2026)

## ¿Qué es Faba?

Faba es un proyecto de benchmark de eficiencia front-end basado en principios de  [Green UX](docs/green-ux.md) que permite comparar diferentes frameworks de desarrollo web bajo condiciones controladas y reproducibles. Los resultados están orientados a equipos de desarrollo y diseño UI/UX, y buscan cuantificar tanto la eficiencia de cada framework como el esfuerzo requerido para implementar soluciones sostenibles. Esta información se utiliza como apoyo en decisiones de arquitectura y diseño frontend, así como para generar consciencia sobre el impacto ambiental del software.

---

## Público objetivo

Desarrolladores frontend, equipos UX/UI y perfiles técnicos interesados en performance, sostenibilidad digital y Green UX basado en métricas.


# Descripción general del proyecto 

## Qué pretende hacer el proyecto

- Comparar el costo técnico de distintos frameworks frontend bajo condiciones equivalentes.
- Evaluar el impacto de usar **librerías UI pesadas vs livianas**.
- Medir cómo decisiones de arquitectura frontend afectan:
  - performance
  - consumo de recursos
  - eficiencia digital
- Proveer resultados reproducibles y comparables.
- Contribuir a la discusión técnica sobre **Green UX y sostenibilidad digital** desde datos medibles usando [estos criterios](docs/criterios-green-ux.md).

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

El proyecto consiste en **2n+1 aplicaciones web independientes**:

- **2n aplicaciones**: una libreria pesada y otra liviana por cada framework (React, Vue, Svelte, etc.)
- **1 aplicación master**: controlador y documentación del benchmark

Cada aplicación:
- implementa la misma funcionalidad
- usa una determinada librería liviana y otra pesada para cada framework
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
- UI equivalente en todos los frameworks, es significativo que sea equivalente para medir una misma tarea congruente para todos los casos

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
- Heap utilizado post-render (solo en Chrome)

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

### Vanilla JS / Web Components
 - por considerar. (Enero - Febrero 2026)

---

## Consideraciones técnicas
Para efectos de buen benchmark de frameworks en el proyecto, se considera: 

1) Un solo proveedor de hosting (no es carbono neutral)
2) Una sola región
3) Una sola CDN
4) Dominios separados
5) Frameworks distintos
6) Mismo contenido funcional
7) Mismas métricas
8) Documentación explícita de las limitaciones

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
- *¿**Qué tan difícil** es aplicar principios Green UX a cada framework? - Linea de código, documentación, funciones, percepción de complejidad, configuraciones extra, librerías extra.

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
