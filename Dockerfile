# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json separately for caching
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --only=production

# Copy the rest of the app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
