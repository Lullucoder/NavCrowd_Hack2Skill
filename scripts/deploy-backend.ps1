param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectId,

  [Parameter(Mandatory = $false)]
  [string]$Region = 'us-central1',

  [Parameter(Mandatory = $false)]
  [string]$GeminiApiKey = $env:GEMINI_API_KEY
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Set-Location "$PSScriptRoot\..\backend"

Write-Host "Building backend container with Cloud Build..."
gcloud builds submit --tag "gcr.io/$ProjectId/venueflow-api"

Write-Host "Deploying Cloud Run service..."
$deployArgs = @(
  'run',
  'deploy',
  'venueflow-api',
  '--image', "gcr.io/$ProjectId/venueflow-api",
  '--platform', 'managed',
  '--region', $Region,
  '--allow-unauthenticated'
)

if (-not [string]::IsNullOrWhiteSpace($GeminiApiKey)) {
  Write-Host "Applying GEMINI_API_KEY from env var mode..."
  $deployArgs += @('--set-env-vars', "GEMINI_API_KEY=$GeminiApiKey")
} else {
  Write-Host "GEMINI_API_KEY not provided. Deploying with fallback-only AI responses."
}

gcloud @deployArgs
