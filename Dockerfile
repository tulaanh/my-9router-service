FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 20128
ENV PORT=20128
CMD ["node", "server.js"]
