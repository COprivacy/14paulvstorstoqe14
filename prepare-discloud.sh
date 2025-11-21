
#!/bin/bash

echo "🔨 Preparando build para Discloud..."

# 1. Limpar builds anteriores
rm -rf dist/
rm -f pavisoft-discloud.zip

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 3. Build do cliente (Vite)
echo "🎨 Compilando cliente..."
npm run build

# 4. Build do servidor (TypeScript)
echo "⚙️  Compilando servidor..."
npx tsc --project tsconfig.json --outDir dist

# 5. Criar arquivo zip para deploy
echo "📦 Criando arquivo zip..."
zip -r pavisoft-discloud.zip dist/ node_modules/ discloud.config package.json package-lock.json

echo "✅ Build concluído! Arquivo: pavisoft-discloud.zip"
echo "📤 Faça upload deste arquivo no Discloud"
