# weather-app

Simple TypeScript single-page weather dashboard. Uses the free Open-Meteo API — no API key needed.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:5173.

## Deploy with Portainer

1. Build the image: from the repo root, run `docker build -t weather-app .` (assumes a Dockerfile exists or will exist: multi-stage build, Node 20 to build with Vite, then nginx:alpine to serve the dist folder on port 80).
2. In Portainer, go to Containers, click Add container.
3. Name it weather-app.
4. Image: weather-app:latest (or the image you built/pushed).
5. Map host port 8080 to container port 80.
6. Deploy the container.
7. Open http://your-server-ip:8080 to see the app.

If you use Portainer's registry or a remote Docker host, build and push the image first: `docker tag weather-app your-registry/weather-app:latest` then `docker push your-registry/weather-app:latest` and use that image name in step 4.
