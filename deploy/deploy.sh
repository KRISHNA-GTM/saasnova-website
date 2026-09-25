#!/usr/bin/env bash
# Deploy the built site to S3 + CloudFront (macOS/Linux/CI).
# Usage (from website/): BUCKET=saasnova-site-prod DISTRIBUTION_ID=E123ABC456 AWS_PROFILE=saasnova ./deploy/deploy.sh
set -euo pipefail
: "${BUCKET:?Set BUCKET}"
: "${DISTRIBUTION_ID:?Set DISTRIBUTION_ID}"

[ "${SKIP_BUILD:-0}" = "1" ] || npm run build
test -f dist/index.html || { echo "dist/ missing"; exit 1; }

aws s3 sync dist/_assets "s3://$BUCKET/_assets" --cache-control 'public, max-age=31536000, immutable'
aws s3 sync dist "s3://$BUCKET" --delete --exclude '_assets/*' --cache-control 'public, max-age=300, must-revalidate'
aws s3 cp dist/llms.txt "s3://$BUCKET/llms.txt" --content-type 'text/plain; charset=utf-8' --cache-control 'public, max-age=3600'
aws s3 cp dist/llms-full.txt "s3://$BUCKET/llms-full.txt" --content-type 'text/plain; charset=utf-8' --cache-control 'public, max-age=3600'
aws s3 cp dist/assistant-kb.json "s3://$BUCKET/assistant-kb.json" --content-type 'application/json; charset=utf-8' --cache-control 'public, max-age=300'
aws s3 cp dist/site.webmanifest "s3://$BUCKET/site.webmanifest" --content-type 'application/manifest+json' --cache-control 'public, max-age=86400'
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths '/*' >/dev/null
echo "Deployed to s3://$BUCKET and invalidated $DISTRIBUTION_ID."
