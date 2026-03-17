# ELOHIM RAYMI — Sistema de Diseño Landing Page v2
## Lanzamiento Oficial | 28.03.2026 | Cusco

---

## 1. Arquetipo de Marca y Dirección Visual

**Arquetipos:** El Gobernante + El Creador — Poder, exclusividad, visión, control del futuro.
**Moodboard:** Cinematográfico, Exclusivo, Visionario, Aspiracional.
**Filosofía visual:** Estética oscura profunda con acentos dorados (lujo clásico) y turquesas (innovación/futuro). Sensación de luxury real estate meets gala de lanzamiento.

---

## 2. Paleta de Colores

| Token CSS              | Hex        | Uso principal                                          |
|------------------------|------------|--------------------------------------------------------|
| `--bg-deep`            | `#061417`  | Fondo Hero, Footer, secciones oscuras                  |
| `--bg-petrol`          | `#0B2328`  | Cards, FAQs, secciones alternas                        |
| `--gold-premium`       | `#D4A62A`  | CTAs principales, highlights, precios, eyebrows        |
| `--gold-dark`          | `#A97A12`  | Hover de CTAs dorados, gradientes                      |
| `--cyan-bright`        | `#14D9E6`  | CTAs secundarios, bordes, glow de acento, bullets      |
| `--cyan-dark`          | `#0E8F99`  | Apoyo en gradientes                                    |
| `--glow-green`         | `#56F27A`  | Solo highlights de éxito (uso restringido)             |
| `--text-primary`       | `#FFFFFF`  | Headings, títulos                                      |
| `--text-secondary`     | `#D6E2E5`  | Body copy, párrafos                                    |
| `--text-muted`         | `#8FA7AD`  | Microcopy, notas, helpers                              |
| `--glass-border`       | `rgba(255,255,255,0.10)` | Bordes glassmorphism                   |
| `--glass-bg`           | `rgba(11,35,40,0.7)`     | Fondo de glass cards                   |

---

## 3. Tipografía (Google Fonts)

| Rol       | Fuente | Peso             | Tracking       | Línea         |
|-----------|--------|------------------|----------------|---------------|
| Headings  | Sora   | 600–800          | -0.02em (tight)| 1.15          |
| Body      | Inter  | 300–400          | normal         | 1.6 (relaxed) |
| Eyebrows  | Sora   | 700              | 0.2em          | —             |

---

## 4. Componentes Globales

### Botón Primario (CTA Principal)
- Background: `linear-gradient(135deg, #D4A62A, #A97A12)`
- Color texto: `#000000`
- Radius: `12px`
- Sombra: `0 10px 30px rgba(212,166,42, 0.2)`
- Hover: `translateY(-3px) scale(1.02)`, sombra mayor
- Texto: `RESERVAR MI ENTRADA`

### Botón Secundario (CTA Secundario)
- Background: transparente
- Borde: `2px solid #14D9E6`
- Color texto: `#FFFFFF`
- Glow: `0 0 20px rgba(20,217,230, 0.1)`
- Hover: `bg rgba(20,217,230, 0.1)`
- Texto: `SOLICITAR ACCESO A PRESENTACIÓN PRIVADA`

### Glass Card
- Background: `rgba(11,35,40, 0.7)` con `backdrop-blur(25px)`
- Borde: `1px solid rgba(255,255,255, 0.08)`
- Radius: `24px`
- Sombra: `0 20px 50px rgba(0,0,0,0.3)`

### Badge Prioritario
- Background: `rgba(212,166,42, 0.1)`
- Borde: `1px solid rgba(212,166,42, 0.3)`
- Color: `#D4A62A`
- Radius: `50px`
- Tracking: `0.1em`, peso `700`

### Texto Destacado (Blockquote)
- Borde izquierdo: `3px solid #D4A62A`
- Padding izquierdo: `1.5rem`
- Color: `#FFFFFF`, peso `700`

---

## 5. Efectos

- **Glassmorphism:** `backdrop-blur(25px)`, borde translúcido
- **Reveal on scroll:** Elementos entran con `opacity 0→1` y `translateY(40px→0)` al hacer viewport intersection
- **Hover en cards:** `translateY(-4px)`, glow turquesa sutil
- **Glow dorado en precio:** `animate-pulse shadow(0 0 20px #D4A62A)`
- **Gradientes radiales** en fondos de secciones para profundidad

---

## 6. Imágenes del Proyecto

| Archivo                                            | Descripción                         |
|----------------------------------------------------|-------------------------------------|
| `WhatsApp Image 2026-03-09 at 13.27.42.jpeg`       | Render aéreo nocturno del hotel     |
| `image copy.png`                                   | Mapa Valle Sagrado / ubicación      |
| `image.png`                                        | Render aéreo diurno del hotel       |
| `WhatsApp Image 2026-03-09 at 14.13.30.jpeg`       | Logo león Invictus                  |

---

## 7. Estructura de Secciones (12 en total)

1. **Hero + Formulario** — Eyebrow, headline, subheadline, precio, bullets, form con badge
2. **Lo que vivirás** — Grid de 5 glass cards (experiencias del evento)
3. **Para quién es** — Lista de bullets con cierre emocional
4. **Por qué despierta interés** — Dos columnas de copy con pregunta poderosa
5. **Sueño y visión de futuro** — Imagínate... con frase destacada
6. **Formalidad y libro de acciones** — Copy centrado con frase de cierre
7. **Contexto y credibilidad** — Dos columnas con imagen del proyecto
8. **Precio y urgencia** — Pricing card con glow dorado
9. **Bonus por registro** — Card compacta con sorteos
10. **Presentación privada** — Glass card con CTA secundario
11. **FAQ** — Acordeón con 11 preguntas
12. **Cierre final** — Call-to-action final con ambos CTAs

---

## 8. Responsive Breakpoints

| Breakpoint | Comportamiento                                    |
|------------|---------------------------------------------------|
| `> 1100px` | Grid hero 2 columnas, cards en grid multi-col     |
| `≤ 1100px` | Hero single column, form debajo del copy          |
| `≤ 768px`  | Reducción de padding, botones full-width, h1 menor|

---

## 9. Header Sticky

- `position: fixed`, transparente al inicio
- Al scroll > 50px: fondo `rgba(6,20,23, 0.95)` con `backdrop-blur(15px)`
- Contiene logo "ELOHIM RAYMI" y botón CTA principal

---

## 10. Footer

- Fondo `--bg-deep`, borde superior `--glass-border`
- Logo ELOHIM RAYMI + copyright + "Impulsado por Invictus Grupo Inmobiliario"

---

**Nota:** Este documento sirve como referencia para mantener coherencia visual en cualquier actualización futura del landing.
