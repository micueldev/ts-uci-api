ARG app_port
ARG debug_port

FROM node:14-alpine
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install -g typescript nodemon
RUN npm ci

COPY . .
RUN npm run build
EXPOSE $app_port
EXPOSE $debug_port
CMD [ "npm", "start" ]