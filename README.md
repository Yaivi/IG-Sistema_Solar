# IG-Sistema_Solar
Modelo 3D interactivo del Sistema Solar

**ENLACE AL CÓDIGO**: [https://codesandbox.io/p/sandbox/entrega-s6-s7-jjfqyg](https://codesandbox.io/p/sandbox/entrega-s6-s7-jjfqyg)

**ENLACE AL MODELO 3D**: [https://jjfqyg.csb.app/](https://jjfqyg.csb.app/)

## Variables globales
Primero se guarda en un array los siguientes datos de los planetas con el formato:
* Nombre
* Radio
* Número de segmentos horizontales
* Número de segmentos verticales
* Color
* Distancia
* Velocidad de movimiento
* Textura del planeta
Toda esta información es la que se usará para crear las mallas, órbitas, movimientos, objetos 3D y aplicarles las texturas. 

También se crean las variables globales para la camara, los controles, el renderer, el textureLoader, y otra para guardar los objetos como el Sol, cada planeta o luna cuando se creen en 3D.

## Funciones para crear objetos
Dentro del sistema se van a crear 3 tipos de objetos, planetas y estrellas. La diferencia entre estos es el tipo de material y su reacción ante la luz.

Los planetas usarán Phong para que les afecten las luces y sombras de las lunas, además de crear el planeta en sí se generará su órbita mediante, pero no serán capaces de oscurecer otros planetas, mientras que las estrellas, es decir el Sol, será un BasicMaterial para que la fuente de luz que se encuentra en su misma posición también ilumine la superficie de este simulando que el objeto es el que genera la luz, por último las lunas serán capaces de generar sombras en los planetas que orbitan. A parte de la diferencia de material, la función para generar planetas y lunas viene crear también la órbita que siguen

Además de las funciones para crear estos 2 objetos se ha añadido una función para generar pequeños puntos blancos en el cielo, simulando campo de estrellas lejanas, esto definiendo un espacio, y con aleatoriedad seleccionando coordenadas en las que situar los puntos blancos, siendo estos puntos blancos objetos PointsMaterial.

## Controles de cámara
La cámara se controla con los FlyControls de Three.js, por lo que se puede mover libremente la cámara con las teclas W,A,S,D para mover la posición de la cámara, además se puede usar la tecla R y F para controlar la altura de la cámara, subiendo y bajando esta. Para girar la cámara se puede hacer uso del ratón, haciendo click en la pantalla para rotarla en esa dirección, o usar las teclas Q y E para rotar a la izquierda y derecha respectivamente. 

También se ha añadido la opción de un menú en el que se selecciona un planeta al que la cámara quedará fijada y lo seguirá mientras este se mueva por el sistema solar. Cuando se haga esta selección no se podrá mover libremente la cámara por el sistema hasta deseleccionar el planeta, pero si que se podrá alejar la cámara y ver la ruta desde más lejos. En caso de que se quiera volver a la posición original hay un botón que resetea la posición actual de la cámara.

## Modo Editar
Se ha implementado un modo Editar, en este modo se puede seleccionar cualquiera de los objetos que se han creado y modificar su posición y tamaño a través de las opciones de TransformControls. Para poder seleccionar los objetos de forma interactiva se ha creado una función auxilar que hace uso de rayCasting para detectar el objeto sobre el que se hace click y poder editarlo.

Se le añade al gui una opción para poder agregar nuevos astros, ya sean planetas o lunas.

## Modo Realista
Este modo cambia la representción del sistema solar a uno que muestre las verdaderas órbitas y tamaños entre los planetas a escala X:X. Se le añade una imagen de fondo de una galaxia.

## Vídeo
