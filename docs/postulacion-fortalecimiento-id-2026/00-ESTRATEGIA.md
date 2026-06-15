# CARGA+EEG — Estrategia para el "Programa de Fortalecimiento de Proyectos en I+D 2026" (DIT/VRIIP UMAG)

> Documento de trabajo interno. Conecta la oportunidad de financiamiento con la hoja de ruta de producto de CARGA. No es parte del formulario — es el mapa para llenarlo.

---

## 1. La oportunidad, en una frase

DIT/VRIIP (financiado por ANID vía OTL220014 e InES I+D "Science-Hub Austral") abre un concurso para llevar proyectos **TRL2+** hacia un MVP/prototipo, con foco en **insumos de laboratorio** (hasta $3.500.000, 9 cupos), **equipamiento científico** (hasta $4.000.000, 2 cupos) y **repuestos** (hasta $2.500.000, 2 cupos). Postulación abierta hasta el **viernes 26 de junio de 2026** vía formulario Google. Hoy es 15 de junio → **quedan ~11 días**.

## 2. El problema: CARGA, tal cual existe, no es financiable aquí

Lee las exclusiones con cuidado:

- **Insumos**: no financia "licencias de software, suscripciones a plataformas digitales... ni equipamiento computacional de uso general".
- **Equipamiento**: no financia "equipos computacionales (tablets, laptops)... software o suscripciones a plataformas, dado que no constituyen un activo fijo".

CARGA es código. Una postulación de "denme plata para seguir programando CARGA" sería **inadmisible** — no calza en ninguna línea. Si queremos estos fondos, **el proyecto tiene que cambiar de forma**, no solo de discurso.

## 3. El giro: de "app de tests cognitivos" a "instrumento neurocognitivo portátil validado"

**La idea central — CARGA+EEG**: CARGA ya mide tiempos de reacción y precisión en 6 paradigmas clásicos (Stroop, Flanker, Go/No-Go, RT simple, Memoria de dígitos, Búsqueda visual). Lo que le falta para subir en la escala TRL es **validación neurofisiológica**: registrar EEG mientras se aplica la batería y demostrar que los efectos conductuales (efecto Stroop, efecto Flanker, etc.) se correlacionan con los marcadores electrofisiológicos ya descritos en la literatura (N200/ERN, N2pc, P3, theta frontal — ver Anexo Estado del Arte).

Esto convierte el proyecto en algo que **sí calza** en las líneas de financiamiento:

| Línea | Qué comprar | Por qué califica |
|---|---|---|
| **Equipamiento** ($4.000.000, prioridad 1) | Sistema EEG portátil de pocos canales (electrodos secos/semisecos, Bluetooth/USB, SDK abierto) | Es "instrumental científico necesario para la validación técnica de la propuesta" — un activo fijo, no es tablet/laptop ni software. |
| **Insumos** ($3.500.000, prioridad 2) | Electrodos, gel/pasta conductora, cables, impresión 3D para soportes/carcasas de terreno, maletín de transporte, baterías, microSD | "Material fungible de laboratorio" para construir el kit de campo. |
| **Repuestos** | — | No aplica (no hay equipo previo que reparar). |

Postulamos a **ambas líneas** (Equipamiento como prioridad 1, Insumos como prioridad 2) → potencial de hasta **$7.500.000 CLP** en activos + consumibles que hoy el proyecto no tiene.

## 4. Por qué esto es además *lo correcto* para el producto (no solo para el formulario)

En la revisión de producto que hicimos, la conclusión fue: CARGA recolecta datos ricos a nivel de ensayo pero no tiene **capa de salida** (reportes, normas, exportación) ni un **perfil cognitivo cruzado**. La base normativa era el "moat" de largo plazo.

CARGA+EEG no reemplaza ese plan — lo **multiplica**:

- La "base normativa regional" deja de ser solo percentiles de RT/precisión: pasa a ser la **primera base de datos psicofisiológica de cognición en adolescentes patagónicos/subantárticos**. Eso es publicable, es un activo único, y nadie más lo tiene.
- El "reporte individual" (Q1) ahora puede incluir, a futuro, marcadores EEG junto a los conductuales — un reporte mucho más defendible clínicamente.
- El "perfil cognitivo cruzado" (radar de dominios) es exactamente lo que el plan de capacitación obligatorio del programa llama **Integration Readiness Level (IRL)**: cuán bien se integran los componentes (software + hardware + protocolo) de un sistema. Literalmente nos están pidiendo que construyamos esto.
- El desarrollo de software (normas, reportes, exportación CSV) sigue siendo trabajo **interno, sin costo** — no requiere presupuesto del fondo, lo que además fortalece la postulación: "el equipo ya tiene la capacidad de software resuelta; el financiamiento es exclusivamente para la validación instrumental que falta".

**Conclusión**: seguimos con el roadmap Q1 (exportación, normas, reportes, perfil cruzado) en paralelo — es trabajo de software que no compite con este fondo. Este fondo nos da el **hardware y los datos** que hacen que ese roadmap sea científicamente serio.

## 5. Cómo maximiza la rúbrica (7 criterios, 1-3 c/u)

1. **Nivel de I+D**: ya hay prototipo funcional (CARGA) + problemática aplicada real → calza en nivel 2-3 directamente.
2. **Innovación y diferenciación**: kit EEG portátil de bajo costo para escuelas aisladas, normado en Patagonia/Subantártico — nadie más lo hace. Nivel 3.
3. **Impacto esperado**: educación + salud escolar regional (DAEM, CESFAM, JUNAEB), con potencial nacional. Nivel 2-3 si mostramos algo de vinculación previa (¿hay contacto con algún colegio o CESFAM? — revisar).
4. **Proyecciones PI/Transferencia**: registro de software, base de datos normativa, protocolo como know-how transferible vía OTL. Nivel 3 si se redacta bien.
5. **TRL**: declaramos TRL2 con evidencia (revisión de literatura, prototipo desplegado, esquema de integración). Nivel 2 sólido — subir a "3" sería sobre-declarar sin evidencia experimental, mejor ser honestos.
6. **Equipo multidisciplinario**: psicología (LAMP) + desarrollo de software + ingeniería biomédica/electrónica/neurociencia para la integración EEG = 3 disciplinas → Nivel 3 si conseguimos ese tercer perfil + estudiantes de pre/postgrado.
7. **Historial VRIIP 2023-2025**: si el/la líder NO ha recibido fondos VRIIP en ese período → Nivel 3 (criterio de desempate también).

## 6. Mapa de documentos de esta carpeta

- **`01-FORMULARIO.md`** — Respuestas borrador para cada campo del formulario, en español, respetando los límites de caracteres. Listo para copiar/pegar y editar.
- **`02-PRESUPUESTO.md`** — Lista de compras por categoría (Equipamiento + Insumos), con guía de cotización (Mercado Público, despacho a Punta Arenas).
- **`03-CARTAS.md`** — Borradores de carta de motivación, carta de compromiso (Anexo 2) y carta de apoyo de jefatura (Anexo 1).
- **`04-ESTADO-DEL-ARTE.md`** — Revisión de literatura sobre correlatos EEG de los 6 paradigmas de CARGA. Es evidencia TRL2 citable y un anexo técnico real.
- **`05-PENDIENTES.md`** — Checklist de todo lo que solo Hermán/el equipo puede completar (datos personales, cotizaciones reales, firmas, decisión de título).

## 7. Camino crítico (11 días)

| Día | Acción |
|---|---|
| Ahora | Revisar este paquete, decidir título y tercer perfil disciplinar |
| Día 1-3 | Conseguir cotizaciones formales (proveedores Mercado Público, despacho Punta Arenas) — **esto es lo que más demora** |
| Día 2-4 | Conseguir firma de carta de apoyo (jefatura del departamento) |
| Día 3-5 | Completar `Integrantes_equipo.xlsx` con el equipo real |
| Día 4-6 | Revisar/editar textos del formulario, ajustar a límites de caracteres reales del form |
| Día 7-10 | Enviar postulación (no dejar para el último día — el form pide adjuntar cotizaciones, cartas, etc.) |

## 8. Riesgo principal

**Las cotizaciones son excluyentes** y deben venir de proveedores chilenos inscritos en Mercado Público, con despacho a Punta Arenas incluido. Conseguir un proveedor nacional de equipos EEG/biosignal puede tomar días (son nichos poco comunes en Chile). **Esto debe partir HOY** — es el cuello de botella real, no el texto del formulario.
