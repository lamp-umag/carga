# CARGA — Panel de Pruebas Cognitivas

**Cognitive Assessment Research Gamified Application**

Herramienta web de exploración cognitiva diseñada para demostraciones educativas en ferias de ciencias y clases de psicología. Desarrollada en el **Laboratorio de Aprendizaje y Motivación (LAMP)**, Universidad de Magallanes.

---

## ¿Qué es?

Una suite de 6 pruebas cognitivas clásicas, adaptadas para tablet y ejecutadas directamente en el navegador — sin instalación, sin servidores, sin cuentas. Los datos se guardan localmente y pueden enviarse a Firebase Firestore cuando esté configurado.

---

## Pruebas incluidas

| Prueba | Qué mide | Origen |
|--------|----------|--------|
| **Test de Stroop** | Interferencia cognitiva / control inhibitorio | Stroop (1935) |
| **Tiempo de Reacción** | Velocidad de procesamiento | Donders (1869), Wundt (1879) |
| **Span de Dígitos** | Memoria de trabajo verbal | Jacobs (1887), Miller (1956) |
| **Flanker de Eriksen** | Atención selectiva | Eriksen & Eriksen (1974) |
| **Go / No-Go** | Control inhibitorio impulsivo | Donders (1869) |
| **Búsqueda Visual** | Atención visual / pop-out | Treisman (1980) |

---

## ¿Está basado en código externo?

No. El código fue escrito desde cero para este proyecto. El diseño experimental sigue los paradigmas originales descritos en la literatura citada arriba. No se usa jsPsych ni ninguna otra librería de psicología experimental — la medición de tiempos de reacción se realiza con `performance.now()`, que ofrece precisión equivalente.

---

## Stack técnico

- HTML5 + CSS personalizado (sin framework CSS)
- JavaScript vanilla (ES Modules nativos, sin build step)
- Firebase Firestore (opcional, para guardar datos)
- Alojado en GitHub Pages (100% client-side)

---

## Cómo usar

1. Abre la aplicación en un tablet o computador.
2. Completa el registro rápido (apodo, edad, curso, género).
3. En el panel principal, selecciona una prueba y sigue las instrucciones.
4. Al finalizar cada prueba verás tus resultados con interpretación y contexto histórico.
5. Puedes hacer todas las pruebas o solo algunas. El botón **Reiniciar** en la parte superior permite comenzar una nueva sesión para otro participante.

---

## Configurar Firebase (opcional)

Ver el [README en inglés](README.md) para instrucciones detalladas de configuración de Firebase y despliegue en GitHub Pages.

---

## Privacidad

- No se recopilan nombres reales ni datos identificables (se usa apodo/emoji).
- Los datos se guardan de forma anónima con un ID de sesión generado automáticamente.
- Sin registro, sin cookies de terceros.

---

## Créditos

Desarrollado para el LAMP — Laboratorio de Aprendizaje y Motivación, Universidad de Magallanes.

Paradigmas experimentales basados en:
- Stroop, J. R. (1935). *Studies of interference in serial verbal reactions.* Journal of Experimental Psychology, 18(6), 643–662.
- Donders, F. C. (1869). *On the speed of mental processes.* Acta Psychologica, 30, 412–431.
- Miller, G. A. (1956). *The magical number seven, plus or minus two.* Psychological Review, 63(2), 81–97.
- Eriksen, B. A., & Eriksen, C. W. (1974). *Effects of noise letters upon the identification of a target letter.* Perception & Psychophysics, 16(1), 143–149.
- Treisman, A. M., & Gelade, G. (1980). *A feature-integration theory of attention.* Cognitive Psychology, 12(1), 97–136.

---

## Licencia

MIT — libre uso y adaptación con atribución.
