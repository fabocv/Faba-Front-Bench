# 🌿 Guía Esencial: Entendiendo el "Costo Digital"
Si no eres programador, esta guía te ayudará a entender por qué las decisiones técnicas afectan directamente la experiencia del usuario y al planeta.

## El Problema: Los 4 Modelos de Logística (Couriers)
Imagina que vendes **Sillas Gamer**. Para que tu negocio funcione, el cliente debe recibir la silla y poder usarla rápido. El **Framework** (la tecnología) es el courier que eliges para el envío:

- **Modelo Integral (SPA Tradicional)**: Envía la silla con todo el taller de ensamblaje y manuales de otros modelos "por si acaso". Es robusto, pero el paquete es enorme.

- **Modelo Directo (Vanilla/Compilados)**: Envía solo lo esencial. El paquete es mínimo, pero requiere un trabajo más artesanal de tu parte.

- **Modelo por Piezas (Islands/Resumability**): Envía el asiento primero y las luces RGB solo cuando el usuario decide conectarlas.

- **Modelo con Refuerzo (UI Libraries)**: Añade capas de estética y protección (como Material UI). Se ve increíble al abrirlo, pero el desembalaje es más complejo.

## Qué medimos en este "Laboratorio"?
En Faba, no solo nos importa que el camión llegue; nos importa que el usuario pueda sentarse a jugar:

- **FCP (El Camión llega)**: El cliente ve la caja en su puerta. Sabe que la silla llegó, pero aún no puede usarla.

- **FTTS (Silla Armada)**: El momento clave. El cliente terminó de atornillar y **por fin se sentó**. Su esfuerzo (CPU) ha terminado.

- **Impuesto de Embalaje (JS Bundle)**: Todo el cartón y plástico (código) que el cliente debe procesar y desechar. Mucho embalaje es igual a más contaminación energética.

## El Desafío: El "Sesgo del Entorno Ideal"
Los desarrolladores suelen trabajar en computadoras potentes, lo que crea un espejismo: "A mí me funciona bien". **Faba elimina ese sesgo**. Probamos las tecnologías en un entorno neutro para exponer el **Impuesto Tecnológico** real que pagará un usuario con un teléfono modesto o una conexión lenta.

## ¿Cómo leer los resultados?
En nuestras tablas comparativas, fíjate en la columna de Impacto:

- **Impacto Bajo (Verde)**: La tecnología es eficiente. Ideal para máxima inclusión y bajo impacto ambiental.

- **Impacto Alto (Rojo)**: El "costo de entrada" es elevado. La tecnología exige mucho esfuerzo al dispositivo del usuario.

## 5. Sostenibilidad y Futuro
Elegir un framework eficiente es la decisión de **Green UX** más profunda: es optimizar la fuente misma de la energía digital para que la web sea perdurable y accesible para todas y todos.

## Glosario Rápido: El Diccionario del Courier
Para leer nuestros resultados, solo necesitas entender estos tres conceptos clave:

- **JS Bundle (El Peso del Paquete)**: Es la cantidad total de cartón, plástico y manuales que el courier te envía. Mientras más pesado, más lento viaja y más basura genera (**Inestabilidad Ambiental**).

- **FCP (La Llegada del Camión)**: Es cuando ves el paquete en tu puerta. Te da alivio saber que llegó, pero la silla aún está dentro de la caja y no puedes usarla (**Percepción de Velocidad**).

- **FTTS (La Silla Armada)**: Es nuestra métrica estrella. Es el momento en que terminas de atornillar la silla y por fin te sientas. Indica que el dispositivo del usuario ya no está bajo esfuerzo y la aplicación es 100% funcional (**Estabilidad Real**).

### 💡 ¿Quieres saber más?

- Si quieres ver los detalles técnicos y matemáticos, puedes leer nuestra [Metodología Completa.](methodology.md)
- Si quieres probar el test benchmark, puedes leer los pasos a seguir en el [README principal](../README.MD)