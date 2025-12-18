
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
