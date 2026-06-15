# Anexo de respaldo técnico — Estado del arte: correlatos neurofisiológicos de los paradigmas de CARGA

> **Propósito**: evidencia TRL2 requerida por las bases ("revisiones del estado del arte... que validen el nivel de madurez declarado"). Es una revisión narrativa orientativa basada en hallazgos consolidados de la literatura de neurociencia cognitiva/ERP. **Antes de adjuntar como anexo final, verificar referencias exactas (DOI, volumen/páginas) y, si el equipo cuenta con un perfil de neurociencia/psicofisiología, revisar y ampliar.**

---

## 1. Resumen por paradigma

Para cada test de CARGA: la medida conductual actual, el correlato neurofisiológico establecido en la literatura, y qué demostraría su presencia (validación).

| Paradigma CARGA | Medida conductual actual | Correlato EEG/fisiológico esperado | Qué valida |
|---|---|---|---|
| **Stroop** | Efecto Stroop = RT incongruente − RT congruente | Negatividad fronto-central ~350-450 ms ("N450"/conflict negativity), mayor en ensayos incongruentes; aumento de potencia theta frontomedial durante el conflicto (Hanslmayr et al., 2008; West & Alain, 2000) | Que el efecto conductual tiene una huella electrofisiológica de detección de conflicto (vinculada a corteza cingulada anterior, ACC) |
| **Flanker (Eriksen)** | Efecto Flanker = RT incongruente − RT congruente | Componente N2 fronto-central, mayor amplitud en ensayos incongruentes (Kopp et al., 1996; van Veen & Carter, 2002); ERN (error-related negativity) en ensayos incorrectos (Gehring et al., 1993) | Monitoreo de conflicto y detección de error como mecanismo común a Stroop y Flanker |
| **Go/No-Go** | Tasa de falsas alarmas, hits, RT en hits | Complejo N2/P3 fronto-central de mayor amplitud en ensayos No-Go ("No-Go N2", "No-Go P3"), asociado a inhibición de respuesta (Falkenstein et al., 1999; Bokura et al., 2001) | Que la inhibición exitosa/fallida tiene un marcador electrofisiológico distinguible, útil para detectar perfiles de control inhibitorio atípico |
| **Tiempo de Reacción simple** | Media, mínimo, máximo y DE de RT | Latencia del componente P300/P3 como índice de velocidad de procesamiento (Polich, 2007); variación contingente negativa (CNV) durante la anticipación del estímulo (Walter et al., 1964) | Que la velocidad de procesamiento conductual se corresponde con tiempos de procesamiento neural medibles |
| **Memoria de Dígitos (Digit Span)** | Span máximo alcanzado | Aumento de potencia theta frontomedial con la carga de memoria de trabajo durante codificación/mantenimiento (Jensen & Tesche, 2002); modulación de potencia alfa parietal con la carga (Jensen et al., 2002) | Que el límite de span conductual se relaciona con el costo de carga sobre memoria de trabajo medible en EEG |
| **Búsqueda Visual** | Ventaja "pop-out" = RT conjunción − RT característica única | Componente N2pc (negatividad posterior contralateral, ~200-300 ms), de latencia más temprana/amplitud distinta en búsqueda por característica (paralela) vs. búsqueda por conjunción (serial) (Luck & Hillyard, 1994; Eimer, 1996), consistente con la Teoría de Integración de Características (Treisman & Gelade, 1980) | Que la diferencia conductual entre búsqueda paralela y serial tiene un correlato de selección atencional temprana medible |

---

## 2. Arquitectura conceptual de integración (esquema TRL2 → MVP)

```mermaid
flowchart LR
    subgraph Tablet["Tablet — CARGA (navegador, JS)"]
        A[Presentación de estímulo] -->|performance.now()| B[Registro de trial:\nRT, precisión, condición]
        A -->|marca de evento| C[Trigger / timestamp\nsincronización]
    end

    subgraph Sensor["Dispositivo EEG/bioseñal portátil"]
        D[Adquisición continua\nEEG / EDA / FC] --> E[Stream de datos\n+ marcas de evento]
    end

    C -.Bluetooth / Web Bluetooth API / LSL.-> E

    B --> F[(Datos conductuales\nlocalStorage + Firestore)]
    E --> G[(Datos fisiológicos\nsegmentados por ensayo)]

    F --> H[Pipeline de análisis\n(Python / MNE)]
    G --> H

    H --> I[Componentes ERP por\ncondición: N2, N2pc,\nP3, theta frontal]
    H --> J[Correlación con\nefectos conductuales\n(Stroop, Flanker, etc.)]

    I --> K[Base normativa regional\nconductual + fisiológica]
    J --> K
    K --> L[Reportes individuales\ncon interpretación normativa]
```

**Lectura del esquema**: CARGA ya resuelve la mitad izquierda (presentación de estímulos, registro conductual, timestamps de alta precisión). Lo que falta —y lo que financia este programa— es el dispositivo de la mitad derecha (adquisición fisiológica) y el puente de sincronización entre ambos. El pipeline de análisis y la base normativa son desarrollo de software interno (sin costo para el fondo), alineado con la hoja de ruta de producto ya en curso.

---

## 3. Protocolo de validación propuesto (primera iteración)

1. **Sincronización**: al inicio de cada ensayo, CARGA emite una marca de evento (vía Web Bluetooth/Serial o un pulso registrado por el dispositivo EEG) simultánea al `performance.now()` ya registrado en el trial.
2. **Segmentación**: para cada ensayo, extraer una ventana de señal fisiológica de -200 a +800 ms alrededor del estímulo (suficiente para capturar N2/N2pc/P3 según el paradigma).
3. **Promediado por condición**: promediar las ventanas por condición (congruente/incongruente, go/no-go, feature/conjunction) para obtener formas de onda promedio (ERP) por participante.
4. **Comparación con literatura**: verificar la presencia/ausencia de los componentes esperados (Sección 1) y su relación con el efecto conductual individual (p.ej., ¿una mayor amplitud de N2 se asocia a un menor efecto Flanker conductual, como predice la literatura de monitoreo de conflicto?).
5. **Iteración**: ajustar el protocolo (duración de bloques, número de ensayos, calidad de señal en contexto escolar real) según los resultados piloto.

Este protocolo es deliberadamente simple — apropiado para TRL2→3 (primera prueba de concepto), no para un estudio confirmatorio.

---

## 4. Referencias (verificar antes de enviar)

- Bokura, H., Yamaguchi, S., & Kobayashi, S. (2001). Electrophysiological correlates for response inhibition in a Go/NoGo task. *Clinical Neurophysiology*, 112(12), 2224-2232.
- Eimer, M. (1996). The N2pc component as an indicator of attentional selectivity. *Electroencephalography and Clinical Neurophysiology*, 99(3), 225-234.
- Falkenstein, M., Hoormann, J., & Hohnsbein, J. (1999). ERP components in Go/Nogo tasks and their relation to inhibition. *Acta Psychologica*, 101(2-3), 267-291.
- Gehring, W. J., Goss, B., Coles, M. G. H., Meyer, D. E., & Donchin, E. (1993). A neural system for error detection and compensation. *Psychological Science*, 4(6), 385-390.
- Hanslmayr, S., Pastötter, B., Bäuml, K. H., Gruber, S., Wimber, M., & Klimesch, W. (2008). The electrophysiological dynamics of interference during the Stroop task. *Journal of Cognitive Neuroscience*, 20(2), 215-225.
- Jensen, O., & Tesche, C. D. (2002). Frontal theta activity in humans increases with memory load in a working memory task. *European Journal of Neuroscience*, 15(8), 1395-1399.
- Kopp, B., Rist, F., & Mattler, U. (1996). N200 in the flanker task as a neurobehavioral tool for investigating executive control. *Psychophysiology*, 33(3), 282-294.
- Luck, S. J., & Hillyard, S. A. (1994). Electrophysiological correlates of feature analysis during visual search. *Psychophysiology*, 31(3), 291-308.
- Polich, J. (2007). Updating P300: an integrative theory of P3a and P3b. *Clinical Neurophysiology*, 118(10), 2128-2148.
- Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. *Cognitive Psychology*, 12(1), 97-136.
- van Veen, V., & Carter, C. S. (2002). The anterior cingulate as a conflict monitor: fMRI and ERP studies. *Physiology & Behavior*, 77(4-5), 477-482.
- Walter, W. G., Cooper, R., Aldridge, V. J., McCallum, W. C., & Winter, A. L. (1964). Contingent negative variation: an electric sign of sensori-motor association and expectancy in the human brain. *Nature*, 203, 380-384.
- West, R., & Alain, C. (2000). Effects of task context and fluctuations of attention on neural activity supporting performance of the Stroop task. *Brain Research*, 873(1), 102-111.
