# Neumotoxicidad por fármacos — sesión clínica

Sesión de Neumología (20 min) sobre neumotoxicidad por fármacos en el
paciente hematológico: bleomicina, metotrexato, CAR-T e inhibidores de
checkpoint. Página web autocontenida, sin build ni dependencias externas,
pensada para proyectarse sin conexión a internet.

## Ver la sesión

**https://montalvosanchezdavid-pixel.github.io/neumo-toxicidad-sesion-clinica/**

## Estructura del proyecto

```
index.html              página principal
assets/css/style.css    todos los estilos
assets/js/main.js       toda la interactividad (sin librerías externas)
fonts/                  Fraunces, Inter e IBM Plex Mono descargadas en local
images/                 imágenes clínicas ya recortadas y listas para usar
```

## Cómo se navega

- **Scroll normal**: la página se desliza como cualquier web larga, con
  animaciones de entrada por sección.
- **Modo presentación** (botón arriba a la izquierda): convierte cada
  sección en una pantalla completa con snap-scroll, para proyectar con las
  flechas ← → del teclado.
- **Cronómetro** (junto al botón de modo presentación): pulsa para
  arrancar/pausar una cuenta atrás de 20 minutos.
- Los puntos de la derecha son el índice de secciones; clic para saltar.
- Cualquier imagen clínica se puede pulsar para verla a pantalla completa;
  clic fuera o Esc para cerrarla.

## Desplegar en GitHub Pages

1. Sube todo el contenido de esta carpeta (excepto lo que ignora
   `.gitignore`) a un repositorio de GitHub.
2. En GitHub → Settings → Pages, elige la rama `master` (o `main`) y la
   carpeta raíz `/`.
3. La URL queda como `https://<usuario>.github.io/<repositorio>/`.

No hace falta ningún paso de build: es HTML/CSS/JS plano.

## Sustituir una imagen

Cada `<img>` de `index.html` apunta a un archivo dentro de `images/`. Para
cambiarla:

1. Guarda la nueva imagen en `images/` con el mismo nombre que la que
   quieres sustituir (o cambia también el `src` en `index.html`).
2. Si el archivo no existe todavía, la página lo detecta sola y muestra un
   aviso "Hueco para vuestra imagen" con el nombre exacto que espera —
   así sabes qué guardar y dónde.

Pendiente actualmente, marcado en el propio texto de la página:
- `img/caso3.jpg` y `img/caso4.jpg` — imagen real de los casos 3 (CAR-T) y
  4 (checkpoint). Guárdalas con ese nombre y esa ruta (carpeta `img/`, no
  `images/`) para que sustituyan automáticamente al aviso de hueco.

Además, al pasar el ratón (o tocar en móvil) sobre los puntos de colores
de los esquemas de mecanismo aparece una explicación breve de ese hallazgo.

## Añadir o corregir una cita

Los marcadores `[PENDIENTE]` (en ámbar) señalan afirmaciones —sobre todo
las tarjetas de "Interacción" de cada caso— que necesitan una cita real.
Para añadirla:

1. Añade la referencia en la sección final "Referencias" de
   `index.html`, dentro de `<div class="ref-list">`, siguiendo el formato
   de las que ya tienen número.
2. Sustituye el `<span class="cite">[PENDIENTE]</span>` correspondiente
   por un superíndice enlazado, p. ej. `<sup class="cite"><a
   href="#ref-6">6</a></sup>`.

## Editar contenido (casos, tarjetas, quiz)

Todo el contenido clínico vive directamente en `index.html`, organizado en
`<section class="slide" id="caso...">` por caso — una sección para la
presentación del caso y otra para su mecanismo. Cada componente reusable
(tarjeta de dato, acordeón, pregunta) sigue siempre el mismo patrón HTML;
copia un bloque existente para añadir uno nuevo.

## Editar estilos o interactividad

- Colores, tipografía y todos los componentes visuales: `assets/css/style.css`.
- Acordeones, quiz, animaciones al hacer scroll, modo presentación,
  cronómetro, tabla comparativa y tarjetas de reverso: `assets/js/main.js`.

Ninguno de los dos depende de librerías externas ni CDN: todo funciona
sin conexión una vez cargada la página la primera vez.
