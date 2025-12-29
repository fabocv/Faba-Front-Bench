#!/bin/bash

# Colores para la consola
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Iniciando preparación del entorno Faba v1.2...${NC}"

# 1. CONFIGURACIÓN DE NVM Y NODE LTS
export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo -e "${BLUE}ℹ️  Cargando NVM...${NC}"
    \. "$NVM_DIR/nvm.sh"
else
    echo -e "${YELLOW}⚠️  NVM no detectado. Intentando instalar...${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    \. "$NVM_DIR/nvm.sh"
fi

echo -e "${BLUE}🔄 Configurando Node.js a la versión LTS más reciente...${NC}"
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

NODE_VER=$(node -v)
echo -e "${GREEN}✅ Usando Node.js $NODE_VER${NC}"

# 2. DEFINIR RUTAS
APPS_EXISTENTES=(
    "apps/vue-test-light"
    "apps/vue-test-heavy"
    "apps/react-swc-test-light"
    "apps/react-swc-test-heavy"
    "apps/controller"
)

# 3. INSTALACIÓN DE DEPENDENCIAS
for APP in "${APPS_EXISTENTES[@]}"
do
    if [ -d "$APP" ]; then
        echo -e "${BLUE}📦 Instalando en: $APP...${NC}"
        # --no-audit y --no-fund para acelerar en entornos limpios
        (cd "$APP" && npm install --no-audit --no-fund)
        echo -e "${GREEN}✅ $APP listo.${NC}"
    else
        echo -e "${YELLOW}⚠️  Omitiendo: No se encontró la carpeta $APP${NC}"
    fi
done

# 4. MANEJO ESPECIAL DE ANGULAR
APPS_ANGULAR=("apps/angular-test-light" "apps/angular-test-heavy")
for APP in "${APPS_ANGULAR[@]}"
do
    if [ -d "$APP" ]; then
        echo -e "${BLUE}🅰️  Actualizando dependencias Angular en $APP...${NC}"
        (cd "$APP" && npm install --no-audit)
    else
        echo -e "${BLUE}✨ Generando nueva estructura Angular en $APP...${NC}"
        # --yes evita el prompt de confirmación de npx
        npx --yes @angular/cli@latest new $(basename $APP) --directory=$APP --routing=true --style=css --skip-git --skip-install=false
    fi
done

echo -e "\n${GREEN}⭐ ¡Entorno Faba v1.2 configurado con éxito!${NC}"
echo -e "${BLUE}💡 Tip: Si es la primera vez que instalas NVM, reinicia tu terminal o ejecuta: 'source ~/.bashrc'${NC}"