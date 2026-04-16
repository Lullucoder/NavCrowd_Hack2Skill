param(
  [Parameter(Mandatory = $true)]
  [string]$FirebaseProjectId
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Set-Location "$PSScriptRoot\.."

Write-Host "Building frontend..."
npm run build

Write-Host "Selecting Firebase project $FirebaseProjectId..."
firebase use $FirebaseProjectId

Write-Host "Deploying frontend hosting..."
firebase deploy --only hosting
