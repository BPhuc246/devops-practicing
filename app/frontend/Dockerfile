# Base image — using Node.js version 20, Alpine Linux (light: ~5MB instead of ~900MB)
FROM node:20-alpine AS builder

# Create a folder worrking inside container, every code runs in /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies based on package.json copied
RUN npm install

# Copy source code into container ( run after npm install to take advantage cache )
COPY . .

# get from --build-arg
ARG VITE_BACKEND_URL

# expose ra environment
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html

# Initialize container will listen port 80
EXPOSE 5173

# Code run when container start
# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "dev", "--", "--host"]