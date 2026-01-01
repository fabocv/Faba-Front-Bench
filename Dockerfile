FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    bash \
    iperf3 \
    fio \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN chmod +x setup.sh

EXPOSE 3000
# Comando por defecto al iniciar el contenedor

CMD ["/bin/bash", "./setup.sh"]