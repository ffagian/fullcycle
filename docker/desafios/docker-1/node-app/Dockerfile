FROM node:18

WORKDIR /usr/src/app

# instala dockerize e cria o wrapper 'dockerrize'
RUN apt-get update \
  && apt-get install -y wget tar ca-certificates \
  && wget -qO /tmp/dockerize.tar.gz https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
  && tar -C /usr/local/bin -xzvf /tmp/dockerize.tar.gz \
  && rm /tmp/dockerize.tar.gz \
  && chmod +x /usr/local/bin/dockerize \
  && printf '#!/bin/sh\nexec /usr/local/bin/dockerize "$@"\n' > /usr/local/bin/dockerrize \
  && chmod +x /usr/local/bin/dockerrize \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
