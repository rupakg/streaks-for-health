# Use Node.js LTS (Long Term Support) as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["npm", "run", "preview"]