FROM nginx:alpine AS prod

WORKDIR /usr/share/nginx/html

COPY projects .
COPY default.conf /etc/nginx/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]