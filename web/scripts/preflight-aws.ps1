[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$webRoot = Split-Path -Parent $PSScriptRoot
$composeFile = Join-Path $webRoot "docker-compose.aws.yml"
$envExample = Join-Path $webRoot ".env.production.example"
$envProduction = Join-Path $webRoot ".env.production"
$createdTemporaryEnv = $false

function Assert-Command {
    param([Parameter(Mandatory)][string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "No se encontró '$Name' en PATH."
    }
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][string[]]$ArgumentList
    )
    & $FilePath @ArgumentList
    if ($LASTEXITCODE -ne 0) {
        throw "Falló: $FilePath $($ArgumentList -join ' ') (código $LASTEXITCODE)."
    }
}

Push-Location $webRoot
try {
    Assert-Command "docker"
    Assert-Command "node"
    Assert-Command "npm"
    Assert-Command "git"

    Invoke-Checked "docker" @("compose", "version")
    Invoke-Checked "node" @("--version")
    Invoke-Checked "npm" @("--version")

    $requiredFiles = @(
        "Dockerfile",
        ".dockerignore",
        "docker-compose.aws.yml",
        ".env.production.example",
        "scripts/deploy-ec2.sh",
        "AWS_DEPLOYMENT.md",
        "AWS_MANUAL_CHECKLIST.md"
    )
    foreach ($relativePath in $requiredFiles) {
        if (-not (Test-Path -LiteralPath (Join-Path $webRoot $relativePath) -PathType Leaf)) {
            throw "Falta el archivo AWS requerido: web/$relativePath"
        }
    }

    & git check-ignore --quiet -- ".env.production"
    if ($LASTEXITCODE -ne 0) {
        throw "web/.env.production no está ignorado por Git."
    }
    $trackedProductionEnv = & git ls-files -- ".env.production"
    if ($trackedProductionEnv) {
        throw "web/.env.production está trackeado por Git. Retíralo del índice sin borrar el archivo local."
    }

    if (-not (Test-Path -LiteralPath $envProduction)) {
        Copy-Item -LiteralPath $envExample -Destination $envProduction
        $createdTemporaryEnv = $true
        Write-Host "Se creó un .env.production temporal desde el ejemplo para validar Compose."
    }

    Invoke-Checked "npm" @("ci")
    Invoke-Checked "npm" @("run", "build")
    Invoke-Checked "docker" @("compose", "-f", $composeFile, "config", "--quiet")
    Invoke-Checked "docker" @("compose", "-f", $composeFile, "build")

    Write-Host ""
    Write-Host "AWS PREFLIGHT"
    Write-Host ""
    Write-Host "Next build: OK"
    Write-Host "Docker build: OK"
    Write-Host "Compose: OK"
    Write-Host "Secrets tracked: NO"
    Write-Host ""
    Write-Host "LISTO PARA PARTE MANUAL AWS"
}
finally {
    if ($createdTemporaryEnv -and (Test-Path -LiteralPath $envProduction)) {
        Remove-Item -LiteralPath $envProduction
        Write-Host "Se eliminó el .env.production temporal."
    }
    Pop-Location
}
