param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectId,

  [Parameter(Mandatory = $false)]
  [string]$Region = 'us-central1'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Set-Location "$PSScriptRoot\..\backend"

Write-Host "Building backend container with Cloud Build..."
gcloud builds submit --tag "gcr.io/$ProjectId/venueflow-api"

Write-Host "Deploying Cloud Run service..."
gcloud run deploy venueflow-api `
  --image "gcr.io/$ProjectId/venueflow-api" `
  --platform managed `
  --region $Region `
  --allow-unauthenticated
