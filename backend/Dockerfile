FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install express mongoose socket.io crypto-js cors
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
