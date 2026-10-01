# weather-app

Simple TypeScript single-page weather dashboard. Uses the free Open-Meteo API — no API key needed.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:5173.

## Deploy with Portainer

The repo includes a multi-stage `Dockerfile` (Node 20 + Vite build → `nginx:alpine` on port 80) and a `.dockerignore`.

### Option A: Portainer stack (build from Git)

1. In Portainer, go to **Stacks** → **Add stack**.
2. Name it `weather-app`.
3. **Build method:** Web editor. Paste:

```yaml
services:
  weather-app:
    build: https://github.com/alicenir/weather-app.git#main
    pull_policy: build
    image: weather-app:latest
    container_name: weather-app
    ports:
      - "8080:80"
    restart: unless-stopped
```

4. Deploy the stack. Portainer clones the repo and builds the image from the `Dockerfile`.
5. Open `http://your-server-ip:8080`.

### Option B: Build locally, then add a container

1. From the repo root: `docker build -t weather-app .`
2. In Portainer, go to **Containers** → **Add container**.
3. Name: `weather-app`. Image: `weather-app:latest`.
4. Map host port `8080` to container port `80`.
5. Deploy, then open `http://your-server-ip:8080`.

If you use Portainer's registry or a remote Docker host, build and push the image first: `docker tag weather-app your-registry/weather-app:latest` then `docker push your-registry/weather-app:latest` and use that image name in the stack or container settings.
