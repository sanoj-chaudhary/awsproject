# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
