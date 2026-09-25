# Deploy the built site to S3 + CloudFront (Windows PowerShell).
# Prerequisites: AWS CLI v2 configured with a profile that can write to the bucket and
# create CloudFront invalidations. Run from the website/ folder:
#   .\deploy\deploy.ps1 -Bucket saasnova-site-prod -DistributionId E123ABC456 -Profile saasnova
param(
  [Parameter(Mandatory = $true)] [string] $Bucket,
  [Parameter(Mandatory = $true)] [string] $DistributionId,
  [string] $Profile = 'default',
  [switch] $SkipBuild
)
$ErrorActionPreference = 'Stop'

if (-not $SkipBuild) {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Build failed; nothing was deployed.' }
}
if (-not (Test-Path 'dist/index.html')) { throw 'dist/ is missing. Run npm run build first.' }

# 1. Fingerprinted assets: cache for a year.
aws s3 sync dist/_assets "s3://$Bucket/_assets" --profile $Profile `
  --cache-control 'public, max-age=31536000, immutable'
if ($LASTEXITCODE -ne 0) { throw 'Asset upload failed.' }

# 2. Everything else (HTML, feeds, images in /media and /campaigns): short cache, revalidate.
#    --delete removes files that are no longer in the build, including the legacy .html pages
#    (their URLs keep working through the CloudFront Function redirects).
aws s3 sync dist "s3://$Bucket" --profile $Profile --delete `
  --exclude '_assets/*' `
  --cache-control 'public, max-age=300, must-revalidate'
if ($LASTEXITCODE -ne 0) { throw 'Site upload failed.' }

# 3. Text files that S3 would otherwise mislabel.
aws s3 cp dist/llms.txt "s3://$Bucket/llms.txt" --profile $Profile --content-type 'text/plain; charset=utf-8' --cache-control 'public, max-age=3600'
aws s3 cp dist/llms-full.txt "s3://$Bucket/llms-full.txt" --profile $Profile --content-type 'text/plain; charset=utf-8' --cache-control 'public, max-age=3600'
aws s3 cp dist/assistant-kb.json "s3://$Bucket/assistant-kb.json" --profile $Profile --content-type 'application/json; charset=utf-8' --cache-control 'public, max-age=300'
aws s3 cp dist/site.webmanifest "s3://$Bucket/site.webmanifest" --profile $Profile --content-type 'application/manifest+json' --cache-control 'public, max-age=86400'

# 4. Invalidate HTML so visitors see the new version immediately.
aws cloudfront create-invalidation --distribution-id $DistributionId --paths '/*' --profile $Profile | Out-Null
Write-Host "Deployed to s3://$Bucket and invalidated $DistributionId."
