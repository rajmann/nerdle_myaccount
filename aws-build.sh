#!/bin/bash
# Build specifically for AWS S3/CloudFront deployment

echo "Building for AWS S3/CloudFront deployment at /connect/ path..."

# Clean previous build
rm -rf dist

# First set the environment to production
export NODE_ENV=production

# Build with production config and base path
VITE_BASE_URL=/connect npm run build

# Create a simple index.html test file at the root to verify deployment
echo '<!DOCTYPE html>
<html>
<head>
  <title>Redirect to connect</title>
  <meta http-equiv="refresh" content="0;URL=/connect/" />
</head>
<body>
  <p>Redirecting to <a href="/connect/">Nerdle connect</a>...</p>
</body>
</html>' > dist/public/redirect.html

# Create a special version of index.html with debugging console logs
cat dist/public/index.html | 
  sed 's|</head>|<script>console.log("Page loaded at: " + window.location.href);</script></head>|' > dist/public/debug.html

echo "Adding base tag and fixing asset paths..."

# Fix the HTML file
cat dist/public/index.html | 
  sed 's|<head>|<head>\n    <base href="/connect/" />|' |
  sed 's|href="/assets/|href="/connect/assets/|g' |
  sed 's|src="/assets/|src="/connect/assets/|g' > dist/public/index.html.tmp
mv dist/public/index.html.tmp dist/public/index.html

# Fix paths in all CSS files
echo "Fixing CSS file paths..."

# Using a more compatible approach with temporary files
for cssfile in $(find dist/public/assets -name "*.css"); do
  echo "Processing CSS file: $cssfile"
  # Fix url(/) paths
  sed 's|url(/|url(/connect/|g' "$cssfile" > "$cssfile.tmp"
  mv "$cssfile.tmp" "$cssfile"
  
  # Fix url("/) paths
  sed 's|url("/|url("/connect/|g' "$cssfile" > "$cssfile.tmp"
  mv "$cssfile.tmp" "$cssfile"
  
  # Fix url('/) paths
  sed "s|url('/|url('/connect/|g" "$cssfile" > "$cssfile.tmp"
  mv "$cssfile.tmp" "$cssfile"
done

# Ensure the nerdleverse logo is properly referenced
echo "Adding specific fix for nerdleverse logo path..."
cp public/nerdleverse-logo.png dist/public/assets/

echo "Build completed with fixes for /connect/ path"
echo "Run 'npm run deploy' to upload to AWS S3"
echo ""
echo "IMPORTANT: After deploy, access your site at:"
echo "  https://nerdlegame.com/connect/"
echo "If you see a blank page, try viewing source and check for path issues,"
echo "or use the debug version at:"
echo "  https://nerdlegame.com/connect/debug.html"