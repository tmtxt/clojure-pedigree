FROM node:4.1.2
RUN npm install -g nodemon
RUN npm install -g lodash
RUN npm install -g node-uuid
RUN npm install -g winston
WORKDIR /usr/src/app
COPY bashrc /root/.bashrc
ENV NODE_PATH /usr/local/lib/node_modules

EXPOSE 80
