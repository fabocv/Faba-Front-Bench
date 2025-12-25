# Faba — Benchmark: Comparativa de Frameworks y Eficiencia Digital
> Cuantificando el impacto real del stack tecnológico en la inclusión digital y la sostenibilidad.

[![version](https://img.shields.io/badge/version-1.2.0--stable-blue?style=for-the-badge)](https://github.com/fabocv/Faba-Front-Bench)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

## 🎯 Objetivo
Faba mide el **"Impuesto Tecnológico"**: el costo invisible que los usuarios pagan con batería, tiempo y procesamiento al usar apps modernas. Se especializa en la auditoría de **Cold Start (Carga en frío)** bajo un entorno Headless controlado.

## 📊 Métricas Core
- **Equipaje (Red):** Datos transferidos y conteo de peticiones.
- **Esfuerzo (CPU):** Tiempo de ejecución de JS y saturación del hilo principal.
- **Estabilidad (FTTS):** *Faba Time To Stability*, detecta cuándo la app es realmente usable tras 300ms de calma total en el procesador.

## 🏁 Estado de la Versión 1.2
Se han completado satisfactoriamente los tests de:
- **Angular** (v1.1)
- **React** (v1.1)
- **Vue 3** (v1.2)
- **Svelte 5** (v1.2)

> [!IMPORTANT]
> **Nota de Versión:** El desarrollo de las implementaciones para **VanillaJS, SolidJS, Qwik y Astro** queda oficialmente **suspendido** hasta una futura versión 1.3. El proyecto entra en fase de mantenimiento estable en la v1.2.

## 🚀 Instalación Rápida
1. `npm install` (Raíz)
2. `chmod +x setup.sh && ./setup.sh` (Instalar apps)
3. `npm run start:all` (Lanzar Dashboard en puerto 3000)

---
*Faba: El rendimiento no es un lujo, es una condición necesaria para la inclusión digital.*