# Base image — using Node.js version 20, Alpine Linux (light: ~5MB instead of ~900MB)
FROM node:20-alpine 

# Create a folder worrking inside container, every code runs in /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies based on package.json copied
RUN npm install

# Copy source code into container ( run after npm install to take advantage cache )
COPY . .

# Initialize container will listen port 3001
EXPOSE 3001

# Code run when container start 
CMD ["npm","start"]
