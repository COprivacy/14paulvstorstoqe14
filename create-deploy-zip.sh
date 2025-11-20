#!/bin/bash

echo "========================================"
echo "  CRIANDO ZIP PARA DEPLOY NO DISCLOUD"
echo "========================================"
echo ""

echo "[1/3] Verificando arquivos necessários..."
if [ ! -f "server/index.ts" ]; then
    echo "ERRO: server/index.ts não foi encontrado!"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "ERRO: package.json não foi encontrado!"
    exit 1
fi

echo ""
echo "[2/3] Removendo zip antigo (se existir)..."
rm -f pavisoft-deploy.zip

echo ""
echo "[3/3] Criando arquivo ZIP..."
zip -r pavisoft-deploy.zip \
    discloud.config \
    package.json \
    package-lock.json \
    server/ \
    client/ \
    shared/ \
    migrations/ \
    drizzle.config.ts \
    tsconfig.json \
    vite.config.ts \
    postcss.config.js \
    tailwind.config.ts \
    components.json \
    -x "*.git*" "*/node_modules/*" "*.env*" "*/dist/*"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ZIP CRIADO COM SUCESSO!"
    echo "========================================"
    echo ""
    echo "Arquivo: pavisoft-deploy.zip"
    echo ""
    echo "Próximo passo:"
    echo "1. Acesse: https://discloud.app"
    echo "2. Faça login"
    echo "3. Clique em 'Upload'"
    echo "4. Selecione: pavisoft-deploy.zip"
    echo ""
    echo "NÃO SE ESQUEÇA de configurar as variáveis de ambiente!"
    echo "Veja DEPLOY_DISCLOUD.md para mais detalhes."
    echo ""
else
    echo "ERRO: Falha ao criar ZIP!"
    exit 1
fi
