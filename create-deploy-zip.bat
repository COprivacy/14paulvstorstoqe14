@echo off
echo ========================================
echo   CRIANDO ZIP PARA DEPLOY NO DISCLOUD
echo ========================================
echo.

echo [1/3] Verificando arquivos necessarios...
if not exist "server\index.ts" (
    echo ERRO: server/index.ts nao foi encontrado!
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ERRO: package.json nao foi encontrado!
    pause
    exit /b 1
)

echo.
echo [2/3] Removendo zip antigo (se existir)...
if exist "pavisoft-deploy.zip" del pavisoft-deploy.zip

echo.
echo [3/3] Criando arquivo ZIP...
powershell -Command "Compress-Archive -Path discloud.config,package.json,package-lock.json,server,client,shared,migrations,drizzle.config.ts,tsconfig.json,vite.config.ts,postcss.config.js,tailwind.config.ts,components.json -DestinationPath pavisoft-deploy.zip -Force"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ZIP CRIADO COM SUCESSO!
    echo ========================================
    echo.
    echo Arquivo: pavisoft-deploy.zip
    echo.
    echo Proximo passo:
    echo 1. Acesse: https://discloud.app
    echo 2. Faca login
    echo 3. Clique em "Upload"
    echo 4. Selecione: pavisoft-deploy.zip
    echo.
    echo NAO SE ESQUECA de configurar as variaveis de ambiente!
    echo Veja DEPLOY_DISCLOUD.md para mais detalhes.
    echo.
) else (
    echo ERRO: Falha ao criar ZIP!
)

pause
