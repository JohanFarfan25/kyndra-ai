# KYNDRA AI

# Descripción General
 Kyndra AI es una aplicación Full Stack de demostración que implementa un asistente conversacional con persistencia en MongoDB, desarrollado con NestJS (backend), Angular (frontend) y TailwindCSS. El sistema permite enviar mensajes, procesarlos con un servicio de inteligencia artificial (OpenAI o mock estructurado) y visualizar el historial completo de la conversación. El proyecto demuestra principios de arquitectura limpia, separación de responsabilidades, manejo de errores, seguridad básica y buenas prácticas de desarrollo.

# Diseño Aquitectínico

## BACK

### Arquitectura por capas

 Se ha adoptado una arquitectura hexagonal adaptada al framework NestJS, separando claramente las responsabilidades en:

 Controller => Maneja las peticiones HTTP, valida entrada, devuelve respuestas.
 Application => Orquesta casos de uso, aplica reglas de negocio, maneja transaciones.
 Domain => Entidades, objetos, interfaces de repositorios, logica de negocio.
 Repository => Abstracción de persistencia; implementación con Mongoose.
 Infrastructure => Adaptadores concretos: base de datos, servicios externos (AI) Confihuraciones, guards, etc.

### Diagrama de flujo

<img width="871" height="511" alt="Diagrama de flujo" src="https://github.com/user-attachments/assets/8a1e3a9d-301f-42a2-8343-3d9b48dca5ab" />

(img propia)
El servicio de aplicación inyecta una dependencia de la interfaz del repositorio (principio de inversión de dependencias), lo que permite cambiar la implementación sin afectar la lógica de negocio.

Específico
POST /messages
  │
  ├─► ValidationPipe (class-validator)
  │
  ├─► MessagesController.create()
  │    │
  │    └─► CreateMessageUseCase (Application Service)
  │          │
  │          ├─► 1. Crear entidad Message (Domain)
  │          │
  │          ├─► 2. Guardar mensaje usuario → MessageRepository.save()
  │          │      └─► MongoDB (Mongoose)
  │          │
  │          ├─► 3. Enviar texto a IA → AiService.generateResponse()
  │          │      ├─► Intento de OpenAI (si API key presente)
  │          │      └─► Respuesta mock estructurada (fallback)
  │          │
  │          ├─► 4. Crear entidad Message (respuesta IA)
  │          │
  │          └─► 5. Guardar respuesta IA → MessageRepository.save()
  │
  └─► Respuesta 201 Created (mensaje usuario + respuesta IA)

GET /messages
  │
  ├─► JwtAuthGuard (valida token)
  │
  ├─► MessagesController.findAll()
  │    │
  │    └─► FindMessagesQuery (Application Service)
  │          └─► MessageRepository.findAll()
  │                └─► MongoDB
  │
  └─► Respuesta 200 OK (array de mensajes)


  # Seguridad y Manejo de Sesión

  ## Autenticación (JWT)

  La aplicación usa un sistema básico de autenticación con JWT.
  Hay un endpoint POST /auth/login donde se envían unas credenciales fijas (solo para efectos de la prueba). Si son correctas, el servidor devuelve un token.
  Ese token se debe enviar en cada petición a las rutas /messages, usando el header: Authorization: Bearer <token>
  Si no se envía el token o no es válido, no se puede acceder a esas rutas.

  ¿Cómo se maneja la seguridad?
  La autenticación la maneja el propio framework (NestJS) usando sus herramientas internas..
  Las partes donde está la lógica del negocio no se preocupan por cómo se valida el usuario. Solo reciben el userId que viene dentro del token ya validado.

  En otras palabras:
  la seguridad se resuelve “antes” de llegar a la lógica principal, y los servicios solo trabajan con el identificador del usuario sin saber cómo se autenticó.

  Protección de información sensible
  * Las variables de entorno (.env) almacenan secretos (JWT_SECRET, MONGO_URI, OPENAI_API_KEY).
  * El archivo .env no se versiona; se provee un .env.example.
  * La API key de OpenAI nunca se expone al frontend.
  * Las contraseñas (aunque demo) se hashean con bcrypt.

# Escalabilidad y Rendimiento

## Concurrencia y Volumen Transaccional

NestJS corre sobre Node.js, que maneja la concurrencia con el modelo de event loop no bloqueante.  
En la práctica, esto significa que puede atender múltiples peticiones al mismo tiempo sin quedarse esperando a que una termine para empezar otra.

Este enfoque funciona muy bien cuando el sistema depende de operaciones de I/O, como:

* Consultas a base de datos  
* Llamadas a APIs externas  
* Peticiones HTTP  

Para este tipo de carga, Node.js es bastante eficiente.

Si el volumen de tráfico crece, la forma correcta de escalar no es “hacer el servidor más grande”, sino escalar horizontalmente, por ejemplo:

* Ejecutando múltiples instancias con PM2 (modo cluster).  
* Usando contenedores Docker replicados.  
* Orquestando con Kubernetes para repartir carga automáticamente.  

MongoDB también permite crecer junto con la aplicación:

* Replica sets para alta disponibilidad.  
* Sharding para dividir grandes volúmenes de datos entre varios nodos.  

---

## Modelo de Despliegue Ideal

En producción, una configuración razonable sería:

* Backend en un contenedor Docker.  
* Frontend servido con Nginx en otro contenedor.  
* MongoDB en su propio contenedor o como servicio gestionado.  
* Orquestación con Kubernetes si el proyecto requiere autoescalado y alta disponibilidad.  
* Base de datos en MongoDB Atlas o replica sets gestionados.  
* Variables de entorno inyectadas al contenedor para credenciales y configuración sensible.  
* CI/CD con GitHub Actions para ejecutar pruebas y desplegar automáticamente.  

Nada exótico, pero sí alineado con buenas prácticas modernas.

---

## Mejoras Pensando en Producción

Si el proyecto evoluciona y empieza a recibir tráfico real, estas serían mejoras lógicas:

* Redis como caché: guardar respuestas de IA repetidas por un tiempo corto (TTL), reducir latencia y costos.  
* Rate limiting con @nestjs/throttler: evitar abusos de la API.  
* Compresión gzip en Express para reducir tamaño de respuesta.  
* Helmet para configurar cabeceras HTTP seguras.  
* Índices en MongoDB (por ejemplo userId, timestamp) para acelerar consultas.  
* Paginación en GET /messages para evitar cargar demasiados registros en memoria.  
* Colas con Bull si el procesamiento de IA se vuelve pesado o lento, desacoplando la generación de respuestas mediante jobs asíncronos.  

Estas mejoras no son obligatorias en una prueba técnica, pero demuestran que el diseño soporta crecimiento real.

---

## Límites de Responsabilidad entre Servicios

Cada módulo tiene una responsabilidad clara:

* Auth Service: registro, login y emisión/validación de tokens.  
* Messages Service: gestión de mensajes y coordinación con el servicio de IA.  
* AI Service: capa de abstracción para comunicarse con proveedores externos (OpenAI, Azure o un mock).  

La idea es que cada uno pueda evolucionar o cambiar sin afectar los demás.  
Si mañana se reemplaza OpenAI por otro proveedor, solo cambia el AI Service.

---

## Integración Futura con Single Sign-On (SSO)

Si más adelante se requiere SSO (OAuth2, SAML, login con Google, etc.), se agrega una estrategia adicional en la capa de autenticación usando Passport.

El resto del sistema no tendría que modificarse, porque los servicios internos solo trabajan con un userId.  
Una vez validado el usuario externo, se seguiría emitiendo un JWT interno que es el que usa la API.

En otras palabras: la identidad externa cambia, pero el contrato interno del sistema se mantiene igual.


# Decisiones Técnicas Clave

NestJS + TypeScript => Framework progresivo que promueve arquitectura limpia, inyección de dependencias, y es altamente testeable.

Angular + TailwindCSS => Angular ofrece estructura sólida para aplicaciones empresariales; TailwindCSS permite diseño profesional sin escribir CSS personalizado.

MongoDB con Mongoose => Esquemas flexibles para mensajes, fácil integración con NestJS y adecuado para el volumen esperado.

Docker solo para MongoDB => Si no se proporciona OPENAI_API_KEY, el servicio responde con frases predefinidas pero manteniendo la misma interfaz. Permite probar el flujo completo.

Misma sesión para toda la app => Se asigna un userId fijo (demo) o se obtiene del login; esto evita complejidad innecesaria pero demuestra comprensión del manejo de sesión.

## Cómo ejecutar el proyecto

(Esta sección se detalla en la guía técnica paso a paso, pero se resume en el README)

1. Clonar el repositorio.

2. Configurar las variables de entorno (`.env`) dentro de la carpeta `/backend`.

  NODE_ENV=development
  PORT=3000
  MONGO_URI=mongodb://admin:password123@localhost:27017/kyndra?authSource=admin
  JWT_SECRET=supersecretkey
  JWT_EXPIRES_IN=1d
  OPENAI_API_KEY=your_openai_key_optional
  OPENAI_MODEL=your_model_ai
  USER_DEMO=user_demo
  PASSWORD_DEMO=password_demo

3. Levantar MongoDB con Docker.

4. Instalar dependencias y ejecutar el backend (NestJS).

5. Instalar dependencias y ejecutar el frontend (Angular).

6. Abrir el navegador en: http://localhost:4200


## Conclusión

Kyndra AI cumple con todos los requisitos de la prueba técnica, demostrando un diseño arquitectónico robusto, decisiones técnicas justificadas, código limpio y una interfaz de usuario atractiva.  

El proyecto está preparado para ser presentado ante un panel técnico y sirve como base sólida para evolucionar a un sistema en producción.

---

**Johan Farfán**  
Desarrollador de Software  

Email: johanfarfan25@gmail.con  
Celular: 3227111889  
GitHub: https://github.com/JohanFarfan25  
LinkedIn: https://www.linkedin.com/in/johan-alexander-farfan-sierra-617844b7/





