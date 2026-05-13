# Usamos Node 22 en su versión completa (Bookworm)
FROM node:22-bookworm

# Creamos el directorio de trabajo
WORKDIR /app

# Instalamos herramientas necesarias para compilar módulos nativos (esencial para SQLite)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiamos los archivos de configuración
COPY package*.json ./

# Forzamos la compilación desde el código fuente para esquivar el error de GLIBC
RUN npm install --build-from-source

# Copiamos el resto del código
COPY . .

# Compilamos de TypeScript a JavaScript
RUN npm run build

# Exponemos el puerto
EXPOSE 3000

# Iniciamos la aplicación
CMD ["npm", "start"]