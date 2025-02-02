FROM denoland/deno:alpine-1.42.2

EXPOSE 7777


WORKDIR /app


COPY deps.js /app
RUN deno cache deps.js


COPY ./app /app

CMD ["deno", "run", "--allow-env", "--allow-net", "--allow-read", "--compat", "--watch", "app.js"]

