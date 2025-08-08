npx esbuild seed.ts \
  --bundle \
  --platform=node \
  --format=cjs \
  --outfile=../../dist/scripts/dev-infra/seed/seed.js \
  --packages=external \
  --external:@prisma/* \
  --external:.prisma/* \
  --minify