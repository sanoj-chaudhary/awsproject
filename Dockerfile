# Use official Node.js LTS image
FROM node:latest
RUN npm install -g nodemon
    WORKDIR /app

    # COPY package*.json ./
    # RUN npm install --only=production

COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
