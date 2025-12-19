
# Faba — Benchmark de Eficiencia Web

## Autor
### Fabián Catalán
- Github: https://github.com/fabocv
- LinkedIn: https://www.linkedin.com/in/fkatv

---

**¿Por qué una aplicación construida con la misma lógica pesa el doble en un framework que en otro?** Faba no es solo un benchmark de velocidad; es una balanza para medir el costo digital, técnico y ambiental que tus decisiones de arquitectura le imponen al usuario final.

## **📖 Elige tu nivel de profundidad:**
- **¿Eres Diseñador, PM o curioso por la Sostenibilidad?** 👉 Lee nuestra [Guía Esencial (Sin tecnicismos)](docs/esencial.md)

  Descubre cómo el "equipaje digital" afecta la batería de tus dispositivos y al planeta.

- **¿Eres Desarrollador, Arquitecto o Auditor Técnico?** 👉 Explora la [Metodología Detallada](docs/methodology.md)
  
  Rigor estadístico ($M=20$), auditoría de Long Tasks y el cálculo del Índice de Eficiencia Relativa.

---

## El Desafío: El "Sesgo de la Fibra Óptica"
La mayoría de las aplicaciones modernas se diseñan en entornos ideales: procesadores potentes y conexiones ultrarrápidas. Esto oculta la Causa Raíz del problema: el Impuesto Tecnológico.

Cada framework añade una capa de "costo de entrada" (descarga de JS, tiempo de ejecución y bloqueo del hilo principal) que el usuario paga antes de poder interactuar. Faba hace visible este costo invisible.

---

## ¿Por qué Faba ahora? 
El rendimiento siempre ha importado, pero hoy el escenario ha cambiado:

1) **Responsabilidad Ambiental**: La eficiencia digital es ahora un pilar de la sostenibilidad corporativa (Green UX).

2) **Saturación de Dispositivos**: El hardware de gama media/baja ya no puede seguir el ritmo del crecimiento exponencial del JavaScript.

3) **Madurez Técnica**: Por primera vez, existen alternativas reales (Astro, Svelte, Qwik, Vanilla) para cuestionar el statu quo de las SPAs pesadas.

--- 

## ¿Qué hace Faba exactamente? 

Faba se especializa en el Cold Start (Carga en frío). No medimos navegación de larga duración, sino el Costo de Entrada.

Bajo un entorno **Headless controlado**, ejecutamos aplicaciones funcionalmente idénticas (1000 registros de datos estáticos) para auditar:

- **Equipaje (Red):** Datos transferidos y conteo de peticiones.

- **Esfuerzo (CPU):** Tiempo de ejecución de JS y saturación del hilo principal.

- **Estabilidad (FTTS):** Nuestra métrica propia, el *Faba Time To Stability*, que detecta cuándo la app es realmente usable tras 300ms de calma total en el procesador.

---

## Rigurosidad

Para garantizar que los resultados sean indiscutibles, aplicamos:

- **Aislamiento Total**: Sin librerías externas de medición, solo APIs nativas del navegador.
- **Estabilidad Estadística**: Cada escenario se repite 20 veces ($M=20$) con limpieza total de caché entre turnos para eliminar el ruido.
- **Línea Base Vanilla**: Comparamos todo contra una versión en Vanilla JS para conocer el costo mínimo inevitable del navegador.

| Framework	|baseline-light	| design-system-heavy |
|-----------|---------------|---------------------|
| VanillaJS | CSS plano / utilitario | Material Web Components|
| React |	CSS plano / utilitario	 | Material UI (MUI) |
| Angular |	CSS plano / utilitario | 	Angular Material |
| Vue 3* |	CSS plano / utilitario	 | Vuetify |
| Svelte |	CSS plano / utilitario | 	Svelte Material UI |
| SolidJS* |	CSS plano / utilitario | 	Material Web Components |

> (*) Disponibles para la Versión 1.2

## Medimos la primera impresión de los frameworks

Si tu equipo ya invierte en accesibilidad y diseño responsable, Faba es el validador técnico de esos valores. No buscamos "frameworks ganadores", sino decisiones informadas.

*"Faba mide costos técnicos reales del frontend moderno utilizando prácticas estándar de benchmarking de sistemas, priorizando comparabilidad y transparencia."*

---

## Documentación adicional

- 📄 Metodología completa: [`methodology.md`](docs/methodology.md)
- 📊 Ejemplos de resultados: carpeta `/results`
- 🧪 Apps evaluadas: carpeta `/apps`

---

# Faba Benchmark v1.1 - Guía de Instalación y Uso

Este monorepositorio contiene un entorno de pruebas automatizado para medir la eficiencia de renderizado en aplicaciones Angular (Versión Ligera vs. Angular Material).

## 📋 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:

- Node.js (Versión 18 o superior recomendada)
- Angular CLI (npm install -g @angular/cli)
- Google Chrome (Puppeteer lo utilizará para las pruebas)

## 🛠️ Instalación
1. Clonar el proyecto y entrar en la raíz:

```
cd Faba-Front-Bench/
```
2. Instalar las dependencias globales del proyecto: Desde la raíz, instala el orquestador y las utilidades de limpieza:

```
npm install
```

3. Instalar dependencias de cada aplicación: Debes instalar los módulos de cada carpeta para que puedan ejecutarse:
```
# Angular Light
cd apps/angular-test && npm install && cd ../..

# Angular Heavy
cd apps/angular-test-heavy && npm install && cd ../..

# Controlador
cd apps/controller-vanillajs && npm install && cd ../..
```

## Uso del Benchmark

### 1. Iniciar el Entorno
Para levantar las dos aplicaciones de Angular y el controlador simultáneamente, ejecuta en la raíz:

```
npm run start:all
```
- Angular Light: Se ejecutará en http://localhost:4201
- Angular Heavy: Se ejecutará en http://localhost:4202
- Controlador: Se abrirá automáticamente en http://localhost:3000

### 2. Ejecutar las Pruebas
1. Una vez abierto el panel en el navegador, asegúrate de no tener otras pestañas pesadas abiertas.

2. Haz clic en "Testear Angular Light". El sistema realizará 20 iteraciones automáticas.

3. Al finalizar, haz clic en "Testear Angular Material".

4. Al obtener ambos resultados, se generará una Tabla Comparativa automática con el impacto porcentual.

### 3. Exportar Resultados
Haz clic en el botón "Descargar Reporte CSV" para obtener un archivo con todas las métricas de rendimiento (FCP, FTTS, Memoria y Bundle) para tu análisis de tesis.

### Limpieza y Errores
Si al intentar iniciar el proyecto recibes un error de "Puerto en uso" o quieres cerrar todo rápidamente, ejecuta:

```
npm run clean
```

## Metodología de Medición (Faba v1.1)
- **Warm-up:** Se recomienda ignorar la primera corrida si el ruido ($\sigma$) es > 100ms.
- **Muestreo:** Cada test consta de 20 muestras promediadas.
- **Estabilidad ($\sigma$):** Se busca una desviación estándar inferior a ±50ms para considerar la prueba válida.

## Pantallas v1.1

![Benchmark](./docs/img/main1.1.png)
Primer prototipo funcional de Faba - Angular test

![Resultado Benchmark](./docs/img/tabla-angular1.1.png)
Resultados comparativos de Angular sin design system (light) y con MUI (heavy)