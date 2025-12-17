
# Faba — Benchmark de Eficiencia Web

## Autor
- Autor: Fabián Catalán
- Github: https://github.com/fabocv
- LinkedIn: https://www.linkedin.com/in/fkatv

---

**¿Qué tan pesada es tu aplicación para el planeta y para el usuario?** Faba mide el costo técnico y digital de los frameworks modernos en su primera carga.

## **📖 Elige tu camino de lectura:**
- **¿Eres Diseñador, PM o curioso por la Sostenibilidad?** 👉 Lee nuestra [Guía Esencial (Sin tecnicismos)](docs/esencial.md)

  Aprende sobre el impacto ambiental de la web y por qué la eficiencia es el nuevo estándar del diseño.

- **¿Eres Desarrollador, Arquitecto o Auditor Técnico?** 👉 Explora la [Metodología Detallada](docs/methodology.md)
  
  Revisa nuestro rigor estadístico ($M=20$), el uso de APIs nativas y nuestra métrica de estabilidad FTTS.

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

Imaginemos que cada aplicación web tiene un "peso" invisible. Faba mide ese peso analizando:

- **Descarga**: Cuántos datos necesita bajar tu dispositivo para mostrar la página.
- **Esfuerzo**: Qué tanto trabajo le da al procesador de tu dispositivo.
- **Pausa**: Cuánto tiempo se queda "congelada" la pantalla antes de que puedas interactuar. Luego, compara estos datos para mostrar qué tecnologías son más ligeras y respetuosas con el usuario y el medio ambiente.

Faba busca **hacer visibles esas diferencias** de forma medible y comparable.

---

## ¿Qué hace Faba?

Faba ejecuta **aplicaciones equivalentes**, construidas con distintos frameworks, y mide:

- cuánto JavaScript descargan,
- cuánto tiempo ejecutan código,
- cuánto bloquean el hilo principal durante la carga inicial
- cuántas solicitudes de red realizan,
- cuánto tiempo tarda la interfaz en estar lista para ser usada sin interrupciones o bloqueos

Luego, compara esos resultados de manera **relativa y transparente**.

> **Imagina esto:** Si entrar a una web fuera un viaje, Faba mide cuánta gasolina gasta el vehículo, cuántas maletas carga y qué tan pesada es la ruta antes de llegar al destino"

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

### Resumido:

- ⚡️ Velocidad: Menos tiempo de espera para el usuario.
- 🔋 Batería: Menos esfuerzo del procesador del teléfono.
- 🌍 Planeta: Menor huella de carbono digital por cada visita.

La eficiencia front-end no se limita a rendimiento percibido o estética visual.
Cada decisión técnica —framework, librerías, arquitectura de render— tiene un costo computacional y energético real, especialmente durante el primer acceso de una aplicación web.

Reducir transferencia innecesaria de recursos, minimizar trabajo del navegador y evitar bloqueos del hilo principal no solo mejora la experiencia inicial, sino que también disminuye el consumo de recursos en contextos reales de uso.

En este sentido, Faba aborda la sostenibilidad desde la eficiencia técnica.
Los principios de Green UX emergen como consecuencia de decisiones de diseño y arquitectura más conscientes, no como un objetivo estético aislado.

---

## ¿Cómo se miden los resultados? (visión general)

Cada aplicación se mide a sí misma, ejecuta el mismo escenario 20 veces para eliminar variaciones aleatorias

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
