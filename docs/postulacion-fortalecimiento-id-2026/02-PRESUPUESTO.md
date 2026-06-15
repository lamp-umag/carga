# Presupuesto y plan de cotizaciones — CARGA+EEG

> Las cotizaciones son **requisito excluyente**. Sin cotizaciones formales válidas, la propuesta queda fuera de concurso aunque el resto esté perfecto. Esto es lo más urgente del paquete completo — partir hoy.

## Reglas de cotización (de las bases, numeral 9)

- Solo proveedores **nacionales inscritos y vigentes en [Mercado Público](https://proveedor.mercadopublico.cl/busqueda)**.
- La cotización debe incluir **obligatoriamente despacho a Punta Arenas** (si no lo incluye, se rechaza completa).
- Debe detallar: nombre de la empresa, RUT, giro, contacto.
- **Compras de 0 a 3 UTM** (compra directa): el proveedor debe aceptar orden de compra con **pago a 30 días**.
- **Compras sobre 3 UTM**: el proveedor debe participar en proceso de compra ágil/licitación (estar inscrito y vigente en ChileCompra).
- No se aceptan: pantallazos, cotizaciones incompletas, proveedores internacionales, ni compras desde Mercado Libre / Amazon / AliExpress / Yapo.
- Cotizar a nombre de: **Universidad de Magallanes, Avenida Bulnes 01855, RUT 71.133.700**.
- Despacho solicitado a: **Centro Asistencial Docente CADI, Avenida Los Flamencos 01364, Punta Arenas**.
- Máximo **3 procesos de compra por línea** de financiamiento (se puede dividir el presupuesto en 1-3 proveedores).

---

## Línea 1 — Equipamiento (prioridad 1, hasta $4.000.000 CLP)

### Qué se necesita (especificación funcional, no marca específica)

Sistema de adquisición de señales bioeléctricas (EEG) portátil para investigación en cognición:

- **Canales**: mínimo 1-8 canales EEG.
- **Electrodos**: secos o semisecos, reutilizables (evita logística de gel/pasta en cada sesión escolar).
- **Muestreo**: ≥ 250 Hz, resolución ADC ≥ 12-24 bit (necesario para resolver componentes ERP de 100-300 ms como N200, N2pc, P3 — ver `04-ESTADO-DEL-ARTE.md`).
- **Conectividad**: Bluetooth/BLE o USB, con SDK/protocolo documentado (idealmente compatible con Lab Streaming Layer — LSL, o Web Bluetooth API para integrar directo con CARGA, que es JS en el navegador).
- **Marcado de eventos**: capacidad de recibir/registrar triggers o timestamps sincronizados con los estímulos de la app.
- Software de monitoreo de calidad/impedancia de señal.

### Dónde buscar

Buscar en Mercado Público y en distribuidores chilenos de equipamiento científico/educativo términos como:

- "electroencefalógrafo" / "sistema EEG"
- "sistema de adquisición de bioseñales" / "biofeedback"
- "diadema EEG" / "EEG portátil de investigación"
- Marcas conocidas en investigación de bajo costo (verificar distribuidor chileno con despacho a Punta Arenas): **OpenBCI** (Cyton/Ganglion + headset), **g.tec** (Unicorn), **Muse** (research), **Emotiv** (EPOC/Insight), sensores **PASCO/Vernier** de biofeedback para ciencia educativa.

### Plan de compra

| Ítem | Estimado | Notas |
|---|---|---|
| Sistema EEG portátil + electrodos + headset | $3.200.000 - $4.000.000 (incl. despacho) | Compra principal (1 proceso) |
| Accesorios adicionales (cables extra, electrodos de repuesto del mismo sistema) | resto del presupuesto si sobra | Hasta 2 procesos adicionales, opcional |

⚠️ **Si no se logra una cotización válida de un sistema EEG completo dentro de plazo**, alternativa de respaldo: un sistema de **biofeedback multimodal** (GSR/EDA + frecuencia cardíaca, p.ej. tipo Shimmer/BITalino o equivalente educativo PASCO/Vernier) — sigue siendo "instrumental científico para validación técnica" y tiene mejor disponibilidad en distribuidores educativos chilenos. Ajustar `04-ESTADO-DEL-ARTE.md` y los textos del formulario de "EEG" a "registro psicofisiológico" si se toma esta ruta (los correlatos de EDA/FC para Go/No-Go y Stroop también están bien documentados).

---

## Línea 2 — Insumos y materiales (prioridad 2, hasta $3.500.000 CLP)

Consumibles/fungibles no inventariables para construir el **kit de campo** (CARGA + sensor + tablet, transportable a escuelas rurales).

| Ítem | Cantidad sugerida | Estimado referencial CLP* |
|---|---|---|
| Electrodos EEG desechables Ag/AgCl (caja x100) | 2-3 cajas | $150.000–250.000 |
| Gel/pasta conductora electrolítica | 3-5 unidades | $60.000–120.000 |
| Toallitas/gel abrasivo de preparación de piel | 5-10 unidades | $40.000–80.000 |
| Alcohol isopropílico + gasas/algodón | varios | $30.000–50.000 |
| Cables, adaptadores, conectores, extensiones | varios | $100.000–200.000 |
| Filamento de impresión 3D (PLA/PETG, varios colores) | 4-6 kg | $200.000–350.000 |
| Soporte/atril ajustable para tablet (uso en terreno) | 2-3 unidades | $150.000–300.000 |
| Maletín rígido de transporte con espuma recortable | 1-2 unidades | $150.000–300.000 |
| Baterías recargables + power bank + cargadores | varios | $80.000–150.000 |
| Tarjetas microSD / pendrives de respaldo | varios | $40.000–80.000 |
| Gorro/banda elástica de fijación de electrodos (tela técnica, velcro) | varios | $80.000–150.000 |
| Material fungible de protocolo (etiquetas, fundas, cinta, fichas de registro) | varios | $50.000–100.000 |

*Estimados gruesos para dimensionar — **deben reemplazarse por cotizaciones reales**. Total referencial ≈ $1.000.000–$2.100.000, dejando margen para ajustar cantidades o sumar ítems (p.ej. más filamento/impresión para fabricar varios kits) hasta acercarse al tope de $3.500.000 si conviene.

### Dónde buscar

- Insumos de electrodos/gel/preparación de piel: distribuidores médicos/biomédicos chilenos (buscar "electrodos EEG desechables", "pasta Ten20", "gel Nuprep" en Mercado Público).
- Impresión 3D, cables, soportes, maletines: ferreterías/tiendas de electrónica e insumos industriales inscritas en Mercado Público (despacho a Punta Arenas).

---

## Checklist de acción inmediata

- [ ] Identificar 1-2 distribuidores chilenos de equipos EEG/biofeedback de investigación, inscritos en Mercado Público, que despachen a Punta Arenas.
- [ ] Solicitar cotización formal (PDF, con RUT/giro/contacto, despacho incluido) — **plazo realista: 3-5 días hábiles de ida y vuelta**.
- [ ] En paralelo, cotizar insumos (más fácil de conseguir, menos nicho).
- [ ] Si a 3 días del cierre no hay cotización de EEG, activar plan B (biofeedback multimodal) y ajustar textos.
