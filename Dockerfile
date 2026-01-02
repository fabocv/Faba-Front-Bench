# Usamos Node 22 (la versión actual más estable) sobre Debian Bookworm
FROM node:22-bookworm

# Instalar dependencias del sistema para Google Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    --no-install-recommends

# Instalar Google Chrome de forma oficial (esto asegura todas las librerías necesarias)
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Variables para que Puppeteer use el Chrome que acabamos de instalar
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Copiamos archivos y ejecutamos tu setup
COPY . .
RUN chmod +x setup.sh && ./setup.sh

EXPOSE 3000 3001 3002 3003 3004 3005 3006 4201 4202

# Usamos el comando de arranque del controlador
CMD ["npm", "run", "start:docker-all"]