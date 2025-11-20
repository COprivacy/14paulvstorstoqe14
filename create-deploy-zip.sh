#!/bin/bash

echo "========================================"
echo "  CRIANDO ZIP PARA DEPLOY NO DISCLOUD"
echo "========================================"
echo ""

echo "[1/4] Fazendo build da aplicação..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERRO: Build falhou!"
    exit 1
fi

echo ""
echo "[2/4] Verificando arquivos necessários..."
if [ ! -f "dist/index.js" ]; then
    echo "ERRO: dist/index.js não foi criado!"
    echo "Execute: npm run build"
    exit 1
fi

echo ""
echo "[3/4] Removendo zip antigo (se existir)..."
rm -f pavisoft-deploy.zip

echo ""
echo "[4/4] Criando arquivo ZIP..."
zip -r pavisoft-deploy.zip \
    discloud.config \
    package.json \
    package-lock.json \
    dist/ \
    server/ \
    shared/ \
    migrations/ \
    drizzle.config.ts \
    tsconfig.json \
    -x "*.git*" "*/node_modules/*" "*.env*"

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
