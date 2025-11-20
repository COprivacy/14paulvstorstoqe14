@echo off
echo ========================================
echo   CRIANDO ZIP PARA DEPLOY NO DISCLOUD
echo ========================================
echo.

echo [1/4] Fazendo build da aplicacao...
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Build falhou!
    pause
    exit /b 1
)

echo.
echo [2/4] Verificando arquivos necessarios...
if not exist "dist\index.js" (
    echo ERRO: dist/index.js nao foi criado!
    echo Execute: npm run build
    pause
    exit /b 1
)

echo.
echo [3/4] Removendo zip antigo (se existir)...
if exist "pavisoft-deploy.zip" del pavisoft-deploy.zip

echo.
echo [4/4] Criando arquivo ZIP...
powershell -Command "Compress-Archive -Path discloud.config,package.json,package-lock.json,dist,server,shared,migrations,drizzle.config.ts,tsconfig.json -DestinationPath pavisoft-deploy.zip -Force"

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
