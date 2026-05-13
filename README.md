# 📋 Task Management System - Challenge Técnico

Sistema de gestión de tareas con jerarquía recursiva, desarrollado para el challenge técnico de 42i.

## 🏗️ Arquitectura y Decisiones Técnicas

El proyecto está dividido en dos aplicaciones independientes para garantizar la separación de responsabilidades, facilitar la escalabilidad y permitir un despliegue aislado.

### 💻 Backend (API REST)

- **Tecnologías:** Node.js con TypeScript para asegurar la integridad de los datos en tiempo de compilación.
- **Base de Datos:** SQLite gestionado con el ORM Sequelize. Se utilizaron **UUID v4** para asegurar identificadores únicos irrepetibles y evitar enumeraciones inseguras.
- **Lógica de Negocio:** Implementación de algoritmos recursivos directamente en el servidor para calcular los esfuerzos acumulados de tareas y sus jerarquías de subtareas, aliviando la carga de procesamiento en el cliente.
- **Testing:** Pruebas unitarias con Jest para validar la precisión matemática de las métricas.

### 🎨 Frontend (SPA)

- **Tecnologías:** Angular 21.
- **¿Por qué Angular 21?:** Se eligió la versión más reciente del framework para aprovechar su estado de zoneless por defecto, lo que permite que la pagina sea mas agil . Esto permite utilizar **Signals** en su formato más maduro para una reactividad fina (sin depender de RxJS para el estado local), y sacar el máximo provecho de los *Standalone Components* por defecto. Además, la compilación con el nuevo Application Builder garantiza una aplicación extremadamente rápida y ligera.
- **Diseño UI:** Enfoque en *Progressive Disclosure* para mantener el panel global limpio mientras se permite anidar y visualizar infinitas subtareas en la vista de detalle.

---

## 📁 Estructura del Proyecto

El repositorio sigue una estructura monorepo lógica para facilitar la evaluación:

```text
/
├── backend/                 # API REST y lógica de negocio
│   ├── src/                 
│   │   ├── controllers/     # Lógica de gestión de peticiones HTTP
│   │   ├── interface/       # DTOs y tipados estrictos
│   │   ├── models/          # Esquemas de Sequelize (SQLite)
│   │   ├── repositories/    # Patrón Repositorio para abstracción de BD
│   │   └── routes/          # Definición de endpoints
│   ├── Dockerfile           # Receta de compilación desde código fuente
│   └── package.json         
├── frontend/                # Aplicación cliente Angular
│   ├── src/                 
│   │   ├── app/             # Componentes standalone y servicios
│   │   ├── public/          # Assets estáticos
│   │   └── styles.css       # Estilos globales
│   ├── Dockerfile           # Receta de compilación y servidor Nginx
│   └── angular.json         
├── docker-compose.yml       # Orquestador general
├── ai-rules.md              # Reglas de arquitectura
└── README.md                # Documentación

## ✨ Funcionalidades Principales

- **CRUD Completo:** Creación, lectura, actualización y eliminación de tareas.
- **Anidamiento Infinito:** Capacidad de crear subtareas dentro de subtareas sin límite de profundidad.
- **Cálculo de Esfuerzo Recursivo:** El dashboard global calcula automáticamente la suma del esfuerzo estimado de una tarea padre y toda su descendencia, brindando una métrica real de la carga de trabajo.
- **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.

## ⚖️ Trade-offs y Asunciones

Durante el desarrollo, se tomaron las siguientes decisiones de diseño:
- **Cálculo en Backend vs Frontend:** Se decidió que la lógica recursiva para sumar los puntos de esfuerzo resida en el backend (vía el endpoint de métricas). Esto asegura que el cliente (Nginx/Angular) se mantenga ligero y delegue el procesamiento pesado al servidor.
- **SQLite vs Bases Externas:** Se optó por SQLite en lugar de un motor como PostgreSQL para eliminar la necesidad de contenedores adicionales, garantizando que los evaluadores puedan levantar la prueba técnica de forma instantánea y sin fricciones de infraestructura.
- **Separación visual del esfuerzo:** En la UI, la tarjeta individual muestra el esfuerzo propio de la tarea, mientras que el panel superior muestra el esfuerzo acumulado (padre + hijos). Esto se hizo intencionalmente para no confundir al usuario sobre la asignación directa vs. la carga global.
