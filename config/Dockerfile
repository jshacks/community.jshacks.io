FROM node:5.6

RUN apt-get update && apt-get install -y nmap

# Filesystem
RUN mkdir -p /app

WORKDIR /app

EXPOSE 8080

CMD ["/app/scripts/tasks.sh", "server_start"]
