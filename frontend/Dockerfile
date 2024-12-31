# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build



# Stage 2: Serve the built application using a lightweight server
FROM nginx:stable-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx configuration
RUN rm -rf ./*

# Copy built files from the builder stage
COPY --from=builder /app/.next /usr/share/nginx/html

# Add a custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000


### Optional : Custom Nginx configuration If applicable
