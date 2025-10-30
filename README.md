# IG-Sistema_Solar
Este proyecto consiste en una simulación 3D interactiva del Sistema Solar desarrollada con Three.js, que permite visualizar los planetas, sus lunas y órbitas, así como explorar el entorno mediante diferentes modos de visualización y edición. El objetivo es ofrecer una herramienta didáctica e interactiva para aprender sobre los movimientos planetarios y la estructura del sistema solar

**ENLACE AL CÓDIGO**: [https://codesandbox.io/p/sandbox/entrega-s6-s7-jjfqyg](https://codesandbox.io/p/sandbox/entrega-s6-s7-jjfqyg)

**ENLACE AL MODELO 3D**: [https://jjfqyg.csb.app/](https://jjfqyg.csb.app/)

## **Índice**   
1. [Variables globales](#variables-globales)  
2. [Funciones para crear objetos](#funciones-para-crear-objetos)  
3. [Controles de cámara](#controles-de-cámara)  
4. [Loop](#loop)  
5. [Modo Educativo](#modo-educativo)  
6. [Modo Editar](#modo-editar)  
7. [Modo Realista](#modo-realista)  
8. [Vídeo](#vídeo)

## Variables globales
Dentro del modelo han hecho falta muchas variables para que todos los sistemas, Objetos 3D, Controles, Texturas y demás elementos pudiesen funcionar sin interferir entre el resto de utilidades del proyecto. Entre de las variables que se han declarado para poder trabajar existen 2 tipos, las individuales y las agrupaciones de datos.

Empezando por las agrupaciones, al empezar se guarda en un array los siguientes datos de los planetas:
* Nombre
* Radio
* Número de segmentos horizontales
* Número de segmentos verticales
* Color
* Distancia
* Velocidad de movimiento
* Textura del planeta

Toda esta información es la que se usará para crear las mallas, órbitas, movimientos, objetos 3D y aplicarles las texturas. Las lunas también tienen un array del mismo formato pero además se le añadirá el nombre del planeta al que se le va a asignar. Además para cada objeto que se cree, se le guardarán varios de estos datos en sus UserData

Las variables individuales son en su mayoría para iniciar o guardar objetos como las camaras, los diferentes controles, el renderer, el textureLoader, arrays para guardar los objetos como el Sol, cada planeta o luna al crearlos, y otras variables booleanas para poder cambiar entre modos e impedir el uso de alguna de las opciones a no ser que se cumplan ciertas condiciones.

## Funciones para crear objetos
Dentro del sistema se van a crear 3 tipos de objetos: planetas, lunas y estrellas. La diferencia entre estos es el tipo de material y su reacción ante la luz, y que tipo de objeto es su padre.

Los planetas y las lunas harán uso de una función común, **Esfera()**, ambos usarán como material de su mesh Phong, para que le afecte la luz, con una geometría de esfera, para crearla se le pasam los valores del radio, y el número de segmentos horizontales y verticales, durante la creación también se especifíca el archivo que se va a usar como textura y el color de la propia esfera. Además de crear el objeto en sí se generará su órbita mediante una línea elíptica de material Basic, para que se vea siempre, haciendo uso de la distancia del planeta respecto al sol y unos valores focales, f1 y f2 que se han puesto para todos los planetas con valor 1. Cuando se cree el objeto o la órbita se revisa si el objeto que se ha pasado como padre es un Mesh, para ver si el objeto al que se va a añadir es un planeta y por tanto se está creando una luna, o si por el contrario se está agregando un planeta nuevo a la escena.

Mientras las estrellas, se crean usando la función **Estrella()**, en el caso de este trabajo solo el Sol, será un BasicMaterial para que la esfera generada muestre su color pese a que la luz se encuentra dentro de la esfera generada, así logrando que se "ilumine" la superficie simulando que el objeto es el que genera la luz. De resto esta función es igual a la de **Esfera()** pero sin la creación de una órbita.

Además de las funciones para crear estos 2 objetos se ha añadido una función, **createStarfield()**, para generar pequeños puntos blancos en el cielo, simulando campo de estrellas lejanas, esto definiendo un espacio, y con aleatoriedad seleccionando coordenadas en las que situar los puntos blancos, siendo estos puntos blancos objetos PointsMaterial. 

Otro objeto creado son los **anillos de Saturno**, que se generan usando una geometría de anillo, definiendo la posición del borde interno y del borde exterior. Para que se aplique correctamente la textura se deben coger las coordenadas UV que son las que indican como se debe poner la textura, de base la textura se ve como enrollada alrededor del anillo, no en capas desde el borde interior al exterior. Para solucionarlo tomamos la posición (x, y) de cada vértice (UV), esto nos dice dónde está el vértice dentro del anillo, le calculamos el radio, esto da la distancia desde el centro del anillo hasta ese vértice. A continuación se normaliza el radio y se lo asignamos al UV, de esta forma se le dice de que parte del anillo a que otra parte va la textura.

Por último para el **Modo Edición**, explicado más adelante, se ha añadido una opción para que el usuario cree objetos de pequeño tamaño que simulen asteroides al activar la opción y hacer click en la pantalla. Pese a reutilizar la función **Esfera()**, estos objetos serán estáticos.

## Controles de cámara
La simulación cuenta con 2 cámaras entre las que se puede alternar en cualquier momento, una estática que permite ver todo el sistema siempre que se use y otra de libre movimiento. Esta cámara se controla con los FlyControls de Three.js, por lo que se puede mover libremente la cámara con las teclas W,A,S,D para mover la posición de la cámara, además se puede usar la tecla R y F para controlar la altura de la cámara, subiendo y bajando esta. Para girar la cámara se puede hacer uso del ratón, haciendo click en la pantalla para rotarla en esa dirección, o usar las teclas Q y E para rotar a la izquierda y derecha respectivamente. 

También se ha añadido la opción de un menú en el que se selecciona un planeta al que la cámara libre se acercará, se quedará fijada y lo seguirá mientras este se mueva por el sistema solar. Cuando se haga esta selección no se podrá mover libremente la cámara por el sistema hasta deseleccionar el planeta, pero si que se podrá alejar la cámara y ver la ruta desde más lejos. En caso de que se quiera volver a la posición original hay un botón que resetea la posición actual de la cámara libre.

## Loop
El loop de animación se divide en 3 partes, una para cada modo, en el modo Educativo y el Realista las posiciones de los planetas y las lunas se van actualizando en torno a su órbita. Este loop permite el uso de los flyControls por lo que siempre que se use la cámara Libre se permite el movimiento por este. En el modo Editar se deja el sistema estático, debido al uso de los TransformControls es más sencillo para la edición y el reposicionamiento de los objetos si se quedan quietos.

## Modo Educativo
Es el modo predeterminado de la simulación, permite observar el sistema solar y sus elementos a través de las cámaras que se han creado. Esta animado con los movimientos de los planetas y sus lunas representados. 

## Modo Editar
Se ha implementado un modo Editar, en este modo se puede seleccionar cualquiera de los objetos que se han creado y modificar su posición y tamaño a través de las opciones de TransformControls. Para poder seleccionar los objetos de forma interactiva se ha creado una función auxilar que hace uso de rayCasting para detectar el objeto sobre el que se hace click, buscarlo en la lista de objetos creados y así poder editarlo. Cuando se cambie la posición del planeta seleccionado y se vuelva al modo Educativo, se recalculan las órbitas del planeta y de las lunas, moviendose todos estos objetos en su nueva posición. Otra opción de este modo es para crear asteroides de pequeño tamaño al habilitar la opción, solo será posible añadirlos en este modo aunque se haga click en el botón en alguno de los otros, estos objetos también se pueden editar su posición con los TransformControls.

Cuando se entra en este modo se desactivan los FlyControls para que no haya conflictos entre estos y los TransformControls cuando se usen.

## Modo Realista
Este modo le añade una imagen al fondo de una galaxia.

## Vídeo
