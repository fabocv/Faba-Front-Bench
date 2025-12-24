#!/bin/bash

# Colores para la consola
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'


# Definir las rutas de las apps
APPS=(
    "apps/angular-test-light"
    "apps/angular-test-heavy"
    "apps/react-swc-test-light"
    "apps/react-swc-test-heavy",
    "apps/vue-test-light",
    "apps/vue-test-heavy",
    "apps/controller-vanillajs"
)

# Bucle de instalación
for APP in "${APPS[@]}"
do
    if [ -d "$APP" ]; then
        echo -e "${BLUE}📦 Instalando en: $APP...${NC}"
        (cd "$APP" && npm install)
        echo -e "${GREEN}✅ $APP listo.${NC}"
    else
        echo -e "⚠️  Advertencia: No se encontró la carpeta $APP"
    fi
done

echo -e "${GREEN}⭐ Instalación finalizada con éxito.${NC}"

echo -e "${BLUE}🚀 Configurando Frameworks Modernos (Angular 19+ & Vite)...${NC}"

# 1. ANGULAR (Light & Heavy)
# Usamos npx para asegurar la última versión del CLI sin instalarlo globalmente
APPS_ANGULAR=("apps/angular-test-light" "apps/angular-test-heavy")
for APP in "${APPS_ANGULAR[@]}"
do
    if [ ! -d "$APP" ]; then
        echo -e "${BLUE}✨ Creando Angular moderno en $APP...${NC}"
        npx -p @angular/cli ng new $(basename $APP) --directory=$APP --routing=true --style=css --skip-git
    else
        echo -e "${BLUE}📦 Instalando dependencias en $APP...${NC}"
        (cd "$APP" && npm install)
    fi
done


# 3. CONTROLADOR
if [ -d "apps/controller-vanillajs" ]; then
    echo -e "${BLUE}🎮 Configurando Controlador...${NC}"
    (cd apps/controller-vanillajs && npm install)
fi

echo -e "${GREEN}✅ ¡Entorno preparado! Angular 21 y React/Vite instalados.${NC}"

echo -e "${BLUE}🚀 Iniciando instalación completa del Benchmark v1.2...${NC}"