# Task Management System - Challenge Técnico

Sistema de gestión de tareas con jerarquía recursiva, desarrollado para el challenge técnico de 42i.

## 🚀 Decisiones Técnicas & Arquitectura

- **Backend**: Node.js con TypeScript para asegurar la integridad de los datos.
- **Base de Datos**: SQLite con Sequelize. Se utilizaron **UUID v4** para los identificadores.
- **Lógica de Negocio**: Implementación de algoritmos recursivos para el cálculo de esfuerzos en tareas y subtareas.
- **Testing**: Pruebas unitarias con Jest para validar la precisión de las métricas.
- **Frontend**: Angular 18 utilizando **Signals** para una reactividad eficiente y moderna.
- **Infraestructura**: Dockerizado con `docker-compose` para un despliegue inmediato.

## 🛠️ Instalación y Ejecución

Para correr el proyecto completo con un solo comando:

```bash
docker-compose up --build
```

La API estará disponible en <http://localhost:3000> y el Frontend en <http://localhost:4200>.

🤖 Uso de IA
Este proyecto fue desarrollado con asistencia de IA (Gemini/Copilot), siguiendo un conjunto de reglas de arquitectura predefinidas en el archivo ai-rules.md para garantizar código limpio y patrones SOLID.
