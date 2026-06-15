# Borrador de respuestas — Formulario de postulación

> Copiar/pegar en el [formulario oficial](https://forms.gle/SoGEk6mM2GKUdBC3A). Todos los bloques de "máx. 1000 caracteres" fueron redactados y verificados para estar bajo el límite (ver conteo al final de cada bloque). **Revisar y personalizar antes de enviar** — especialmente cualquier dato que dependa de información real del equipo (marcado con `[...]`).

---

## Nombre del proyecto

**Opción recomendada:**

> CARGA+EEG: validación neurofisiológica de una batería cognitiva digital portátil para contextos educativos de la Patagonia y el Subantártico chileno

**Alternativas (más cortas):**

> - CARGA+EEG: instrumentación neurofisiológica de una batería cognitiva digital para escuelas patagónicas
> - CARGA Austral: hacia un instrumento cognitivo portátil validado neurofisiológicamente para población escolar subantártica

---

## 1. Carta de motivación

Ver `03-CARTAS.md` → sección "Carta de motivación". Se sube como documento adjunto.

---

## 2. Datos de académico/académica líder del proyecto

| Campo | Valor |
|---|---|
| Nombre completo | `[COMPLETAR]` |
| RUT | `[COMPLETAR]` |
| Departamento Asociado | `[COMPLETAR — el footer de la app dice "Psicología UMAG", probablemente "Departamento de Psicología" o la facultad que lo albergue; confirmar nombre oficial exacto]` |
| Laboratorio Asociado | Laboratorio Austral de Medición Psicosocial (LAMP) |
| Correo electrónico institucional | `[COMPLETAR — correo @umag.cl]` |

⚠️ Requisito: el/la líder debe estar a contrata o planta, mínimo media jornada.

---

## 3. Descripción del equipo

Completar `Integrantes_equipo.xlsx` (adjunto original) con al menos:

1. **Líder del proyecto** — Psicología / LAMP (académico/a, contrata o planta).
2. **Co-investigador/a o colaborador/a — desarrollo de software** — quien mantiene CARGA (puede ser honorarios, ayudante, o el propio líder si tiene este perfil).
3. **Co-investigador/a — ingeniería biomédica / electrónica / neurociencia** — para la integración EEG-software. Si no existe aún en el equipo, **es la pieza más importante a sumar**: sube el criterio "Equipo multidisciplinario" de 2/3 a 3/3 (rúbrica, criterio 6).
4. **Estudiante(s) de pregrado y/o postgrado** — tesista o ayudante de psicología (idealmente también uno de ingeniería). Aporta puntaje extra en el mismo criterio.

> Ver `05-PENDIENTES.md` para la estrategia de reclutamiento del perfil #3.

---

## 4. Carta de apoyo Jefatura

Ver `03-CARTAS.md` → Anexo 1 (Carta de apoyo Director de Departamento). Requiere firma de la jefatura directa de la unidad académica donde se aloja LAMP.

---

## Descripción del proyecto

### 1. Línea de investigación asociada

`[COMPLETAR — seleccionar de la lista oficial de líneas de investigación de UMAG]`. Candidatas más probables dado el enfoque:

- "Salud y Calidad de Vida" / "Salud Mental"
- "Educación y Desarrollo Humano"
- "Ciencias Sociales aplicadas al contexto austral / antártico-subantártico"

Si el formulario permite indicar más de una, priorizar la que combine **salud + contexto austral**, ya que conecta directamente con el InES I+D "Science-Hub Austral" que financia este programa.

### 2. Nombre del proyecto

Ver arriba.

### 3. Problemática u oportunidad a abordar con el proyecto (máx. 1000 caracteres)

> Los instrumentos de evaluación cognitiva disponibles en Chile son mayoritariamente importados, licenciados y normados en poblaciones del Chile central o del extranjero, lo que limita su validez y acceso en la Patagonia y el territorio Antártico/Subantártico. CARGA es una batería cognitiva digital (Stroop, Flanker, Go/No-Go, Tiempo de Reacción, Memoria de Dígitos, Búsqueda Visual) desarrollada por el LAMP-UMAG: gratuita, en español, optimizada para tablets y ya utilizada en contextos educativos regionales. Sus medidas conductuales carecen de validación neurofisiológica independiente y de normas poblacionales propias de adolescentes magallánicos. La oportunidad es incorporar registro EEG portátil durante la aplicación de la batería, generando el primer instrumento cognitivo digital validado neurofisiológicamente y normado en población escolar subantártica.

*(866 caracteres)*

### 4. Situación actual (máx. 1000 caracteres)

> CARGA cuenta con un prototipo funcional desplegado (GitHub Pages + Firestore), con las 6 pruebas operativas, interpretación automática de resultados y un panel de estadísticas para investigadores. El equipo del LAMP ha recolectado sesiones piloto con estudiantes secundarios, validando usabilidad y estabilidad técnica del software. No obstante, el proyecto no cuenta con: (1) hardware de registro fisiológico, (2) protocolo de sincronización entre estímulos y señales biológicas, (3) base de datos normativa regional y (4) reportes individuales con interpretación normativa. Se realizó una revisión del estado del arte sobre correlatos neurofisiológicos de cada paradigma (N200/ERN en Stroop y Flanker, P3 en Go/No-Go, N2pc en búsqueda visual), que respalda la viabilidad técnica (TRL2) de la integración propuesta, aunque esta integración no ha sido implementada ni probada experimentalmente.

*(894 caracteres)*

> ⚠️ Si el equipo NO ha recolectado sesiones piloto reales todavía, ajustar este párrafo — no declarar datos que no existen. Ver `05-PENDIENTES.md`.

### 5. Innovación y diferenciación de la propuesta (máx. 1000 caracteres)

> La mayoría de baterías cognitivas con validación fisiológica requieren laboratorios fijos y equipos de alto costo (gorros EEG de 32+ canales, salas aisladas), inviables para escuelas rurales o aisladas. CARGA+EEG propone un kit portátil de bajo costo (tablet + EEG de pocos canales con electrodos secos/semisecos) desplegable directamente en aulas de Magallanes, Tierra del Fuego y localidades subantárticas. Sería la primera batería cognitiva digital, gratuita y en español, normada específicamente en adolescentes patagónicos y validada con marcadores neurofisiológicos. A diferencia de instrumentos licenciados (WISC, D2, CPT), CARGA es de código abierto, sin costos de licencia recurrentes, y genera una base normativa regional que actualmente no existe, posicionando a UMAG como referente en evaluación cognitiva para contextos australes y antárticos.

*(856 caracteres)*

### 6. Resultados esperados: proyecciones de propiedad intelectual y transferencia tecnológica (máx. 1000 caracteres)

> Se proyectan resultados protegibles y transferibles: (1) registro de derecho de autor del software CARGA y de su módulo de integración EEG (protocolo de sincronización estímulo-señal); (2) un conjunto de datos normativo (percentiles conductuales y neurofisiológicos) para adolescentes de la región de Magallanes, con potencial de publicación científica; (3) un protocolo de aplicación estandarizado, documentable como know-how, transferible a equipos de psicología escolar y salud mental escolar (CESFAM, DAEM). A mediano plazo se evaluará junto a la OTL la viabilidad de un modelo de servicio de evaluación cognitiva para establecimientos educacionales de la región, y la postulación a fondos de continuidad (CORFO, ANID, FIA) para escalar la base normativa a otras regiones extremas de Chile.

*(794 caracteres)*

### 7. Industria del proyecto

`[COMPLETAR — seleccionar de la lista del formulario]`. Sugerencia: **Educación** (primaria) y/o **Salud** (si permite multi-selección).

### 8. Impacto en el sector productivo / potencial de desarrollo (máx. 1000 caracteres)

> El proyecto impacta directamente a los sectores Educación y Salud de la región de Magallanes: escuelas y liceos carecen de herramientas estandarizadas, validadas y gratuitas para la detección temprana de dificultades atencionales y de memoria de trabajo, factores clave en el rendimiento académico. Los equipos de psicología escolar (DAEM, JUNAEB) y de salud primaria (CESFAM) podrían adoptar CARGA+EEG como herramienta de screening de bajo costo y sin licencias. El desarrollo de un kit portátil de evaluación neurocognitiva es además replicable en otras zonas extremas o aisladas de Chile (Aysén, Atacama, Arica-Parinacota), y se alinea con los objetivos del proyecto InES I+D "Science-Hub Austral" de fortalecer capacidades de innovación en el contexto Antártico y Subantártico, abriendo una línea conjunta con ingeniería biomédica/electrónica.

*(847 caracteres)*

### 9. TRL actual de la propuesta (adjuntar evidencia)

> TRL declarado: TRL 2 (principios básicos estudiados, aplicaciones prácticas identificadas, sin prueba experimental del concepto integrado). Evidencia adjunta: (a) prototipo funcional de software desplegado y operativo (GitHub Pages, repositorio público); (b) revisión del estado del arte sobre correlatos neurofisiológicos de los 6 paradigmas implementados (Anexo Estado del Arte); (c) esquema conceptual de integración hardware-software (sincronización de marcas de tiempo EEG-estímulo); (d) datos preliminares de sesiones piloto conductuales recolectadas con el prototipo actual.

*(581 caracteres)*

Adjuntar como evidencia: enlace al repositorio/demo de CARGA + `04-ESTADO-DEL-ARTE.md` (exportado a PDF) + capturas de pantalla de la app.

---

## Plan de gastos

### 1. Selección de línea(s) de financiamiento (priorizar)

1. **Prioridad 1 — Equipamiento** ($4.000.000): sistema de adquisición EEG portátil (instrumental científico para validación técnica).
2. **Prioridad 2 — Insumos** ($3.500.000): electrodos, consumibles, materiales de impresión 3D y kit de campo.
3. Reparación: no aplica.

### 2. Cotizaciones

Ver `02-PRESUPUESTO.md` — checklist de qué cotizar, especificaciones sugeridas y restricciones de proveedor (Mercado Público + despacho Punta Arenas).

---

## Compromisos

### 1. Carta de compromiso del líder de equipo

Ver `03-CARTAS.md` → Anexo 2.

### 2. Declaración de aceptación de las bases concursables

Marcar/aceptar en el formulario (checkbox). Sin redacción adicional requerida.
