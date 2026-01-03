FROM node:22-alpine AS build
WORKDIR /opt/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY projects .
COPY esbuild.js ./esbuild.js
COPY default.conf ./default.conf

CMD npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build dist .
COPY --from=build default.conf /etc/nginx/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
