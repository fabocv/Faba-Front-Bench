
# Faba — Benchmark headless de eficiencia front-end

## Autor
- Autor: Fabián Catalán
- Github: https://github.com/fabocv
- LinkedIn: https://www.linkedin.com/in/fkatv

## Estado:
En construcción del benchmark práctico (apps web) bajo la metodología Faba v1.1

## ¿Qué es Faba?

Faba es un proyecto de **benchmark comparativo** que evalúa la eficiencia técnica de aplicaciones web desarrolladas con distintos frameworks frontend modernos en su primera carga.

Su objetivo es ayudar a diseñadores UI/UX y equipos de desarrollo a evaluar decisiones tecnológicas desde una perspectiva de costo digital —transferencia inicial de recursos, ejecución de JavaScript, carga de procesamiento y estabilidad del hilo principal— midiendo el costo real de acceder por primera vez a una aplicación web.

Faba no busca determinar un framework “ganador”, sino ofrecer una base técnica objetiva para tomar mejores decisiones de arquitectura y diseño.


---

## ¿Qué problema aborda Faba?

En el desarrollo frontend moderno:

- Distintos frameworks pueden ofrecer resultados visuales similares,
- pero con **costos técnicos muy diferentes**.
- Esos costos impactan directamente en:
  - consumo de energía,
  - rendimiento percibido,
  - huella digital,
  - accesibilidad en contextos de baja conectividad.

Faba busca **hacer visibles esas diferencias** de forma medible y comparable.

---

## ¿Qué hace Faba?

Faba ejecuta **aplicaciones equivalentes**, construidas con distintos frameworks, y mide:

- cuánto JavaScript descargan,
- cuánto tiempo ejecutan código,
- cuánto bloquean el hilo principal durante la carga inicial
- cuántas solicitudes de red realizan,
- cuán estables son durante el render inicial.

Luego, compara esos resultados de manera **relativa y transparente**.

---

## ¿Para quién está pensado?

Faba está orientado a:

- Diseñadores UI/UX interesados en Green UX.
- Desarrolladores frontend y fullstack.
- Equipos técnicos tomando decisiones de arquitectura.
- Estudiantes y docentes.
- Personas interesadas en sostenibilidad digital.

No es necesario conocer internamente cada framework para interpretar los resultados.

---

## ¿Qué NO hace Faba?

Es importante aclarar qué **no** aborda el proyecto:

- No mide consumo eléctrico directo.
- No calcula emisiones de CO₂ exactas.
- No evalúa backend ni infraestructura.
- No mide experiencia subjetiva del usuario.
- No declara “frameworks ganadores absolutos”.

Los resultados son **comparativos y contextuales**, no absolutos.

---

## ¿Por qué eficiencia front-end?

La eficiencia front-end no se limita a rendimiento percibido o estética visual.
Cada decisión técnica —framework, librerías, arquitectura de render— tiene un costo computacional y energético real, especialmente durante el primer acceso de una aplicación web.

Reducir transferencia innecesaria de recursos, minimizar trabajo del navegador y evitar bloqueos del hilo principal no solo mejora la experiencia inicial, sino que también disminuye el consumo de recursos en contextos reales de uso.

En este sentido, Faba aborda la sostenibilidad desde la eficiencia técnica.
Los principios de Green UX emergen como consecuencia de decisiones de diseño y arquitectura más conscientes, no como un objetivo estético aislado.

---

## ¿Cómo se miden los resultados? (visión general)

Cada aplicación:

- se mide a sí misma usando APIs nativas del navegador,
- ejecuta el mismo escenario varias veces,
- promedia sus resultados,
- y entrega métricas agregadas.

Un proceso posterior normaliza los datos y genera comparaciones claras.

> Los detalles técnicos completos están documentados en  
> [`methodology.md`](docs/methodology.md)

---

## ¿Qué tipo de resultados entrega?

Faba produce:

- métricas claras de rendimiento y costo técnico,
- indicadores por elemento renderizado,
- un **índice de eficiencia relativa** para facilitar comparación,
- tablas y reportes fáciles de leer.

Esto permite responder preguntas como:

- ¿Qué framework ejecuta menos JavaScript para el mismo resultado?
- ¿Cuál bloquea menos el navegador?
- ¿Cuál escala mejor al aumentar datos?
- ¿Qué decisiones técnicas tienen menor costo digital?

---

## Estado del proyecto

Faba es un proyecto experimental, pero metodológicamente riguroso.  
Está diseñado para ser:

- reproducible,
- transparente,
- extensible a nuevos frameworks y escenarios.

---

## Documentación adicional

- 📄 Metodología completa: [`methodology.md`](docs/methodology.md)
- 📊 Ejemplos de resultados: carpeta `/results`
- 🧪 Apps evaluadas: carpeta `/apps`

---

## Principio rector

> *Faba no busca optimizar frameworks, sino ayudar a tomar decisiones frontend más conscientes, informadas y sostenibles.*
