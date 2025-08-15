@echo off
echo Starting Frontend...
cd client
set NODE_OPTIONS=--openssl-legacy-provider
npm start

