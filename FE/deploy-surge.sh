# Build react app with production mode
npm run build
# Move to build folder
cd build

# Clone index to 200.html
cp index.html 200.html

# Start deploying via Surge
# Deploy
npx surge . lmsfpt-group4.surge.sh