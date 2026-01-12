# Faba — Benchmark: Comparativa de Frameworks y Eficiencia Digital
> Cuantificando el impacto real del stack tecnológico en la inclusión digital y la sostenibilidad.

<p align="left">
  <img src="https://img.shields.io/badge/version-1.2.0--stable-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Security-Policy_Enabled-success?style=for-the-badge&logo=github-security" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Runtime-Node.js_20+-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/Engine-Puppeteer-00D1B2?style=for-the-badge&logo=puppeteer&logoColor=white">
</p>

## Objetivo

Faba hace visible el **costo tecnológico** que debe pagar el usuario al ejecutar una app web creada con las últimas tecnologías Frontend. Esta auditoría se especializa en el **Cold Start (Carga en frío)** bajo un entorno Headless controlado (Chromium Headless - V8) Su propósito es mesurar, tanto en escenarios puros (Light) como con librerías de componentes (Heavy), los tiempos de ejecución, pesos de transferencia y el tiempo real de habilitación operativa mediante el **FTTS (Faba Time To Stability.)**

## Métricas Core
- **Equipaje (Red):** Datos transferidos y conteo de peticiones.
- **Esfuerzo (CPU):** Tiempo de ejecución de JS y saturación del hilo principal.
- **Estabilidad (FTTS):** *Faba Time To Stability*, detecta cuándo la app es realmente usable tras 300ms de calma total en el procesador.

- ### FTTS — Faba Time To Stability
  - FTTS mide el tiempo transcurrido desde el inicio de la aplicación hasta que:
      1. El render inicial se completa, y
      2. El hilo principal permanece libre de Long Tasks (>50 ms)
   durante una ventana continua de 300 ms.

- *FTTS busca capturar el momento en que la aplicación sea visible y operacionalmente estable.*

## Estabilidad

En Faba, la estabilidad se define como la desviación estadística de las métricas
observadas a lo largo de múltiples iteraciones del mismo escenario.

Una baja desviación indica un comportamiento consistente y predecible del stack
frontend bajo condiciones equivalentes. Una alta desviación sugiere sensibilidad
a factores como recolección de basura, scheduling del runtime o carga inicial.

## Agregación de resultados

Cada escenario (**light**: sin librerías, **heavy**: librería de material design) se ejecuta **N = 20 veces**.
Los valores reportados corresponden a la **media**.
La desviación estándar se conserva como métrica de estabilidad
y no se descartan ejecuciones atípicas.

## Protocolo de Rigor

- **Aislamiento Total:** Cada iteración se ejecuta con caché limpia, sin Service Workers ni persistencia previa para medir el Cold Start real.

- **Medición In-Process:** No usamos herramientas externas; los datos provienen de APIs nativas del navegador para evitar el "ruido de observación".

- **Estabilidad Estadística (M=20):** Los resultados son la media de 20 ejecuciones independientes, conservando la desviación estándar para medir la previsibilidad del stack.

## Ética del Benchmark (Anti-Framework War)

[!NOTE] Faba no es una competencia para declarar "el mejor framework".

Siguiendo nuestra metodología, este benchmark es técnico, comparativo y relativo. Los resultados reflejan el costo de entrada bajo un escenario de carga media (1000 registros) en un entorno controlado.

- **No es un juicio absoluto**: Un framework con un índice de eficiencia menor puede ser la opción óptima en escenarios de larga duración o complejidad de estado que Faba no evalúa en esta versión.

- **Transparencia de Datos:** "Los resultados presentados son métricas crudas extraídas directamente del motor V8 a través de APIs nativas, garantizando que el framework evaluado no interfiera en la normalización de sus propios resultados".

## 🏁 Estado de la Versión 1.2
Se han completado satisfactoriamente los tests de:
| Framework | Versión | Librería Material Design (escenario heavy) |
|-----------|---------|-------------------------|
| **Angular**|21| @angular/material|
| **React** | 19 | @mui/material |
| **Vue 3 - Vite 7** | 3 | vuetify|
| **Svelte 5 - Vite 7**| 5 | smui-theme |

> [!IMPORTANT]
> **Nota de Versión:** El desarrollo de las implementaciones para **VanillaJS, SolidJS, Qwik y Astro** queda oficialmente **suspendido** hasta una futura versión 1.3. El proyecto entra en fase de mantenimiento estable en la v1.2.

## Screenshots v1.2

![principal](./docs/img/main1.2.png)

![test corriendo v1.2](./docs/img/runtest1.2.png)

![resumen de test v1.2](./docs/img/report1.2.png)


## 🚀 Instalación Rápida
1. Si tienes node, registra tu versión  (Ej: 20.10) porque el script siguiente **actualizará a la fuerza a la última versión LTS (v22+)**.
2. `chmod +x setup.sh && source setup.sh`
      - Instala automáticamente nvm con el último node/npm y prepara proyectos node. 
      > Nota para Windows: Ejecutar preferiblemente en Git Bash o WSL.
3. `npm run start:all` 
      - *Accede al dashboard en http://localhost:3000*

> Si deseas volver a tu version de node ejecuta 
```
nvm install <tu_version_node_original>
nvm alias default <tu_version_node_original>
```
---
*Faba: El rendimiento no es un lujo, es una condición necesaria para la inclusión digital.*