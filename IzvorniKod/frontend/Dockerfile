#kopirano s https://github.com/progi-devops/progi-monorepo:

FROM nginx:alpine

# Kopira dist folder sadržaj sa stroja u nginx folder u Docker containeru
COPY dist /usr/share/nginx/html

# Izlozi port
EXPOSE 80

# Kopira konfiguraciju nginx-a
COPY nginx.conf /etc/nginx/conf.d/default.template

# postavlja entrypoint
ENTRYPOINT ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]