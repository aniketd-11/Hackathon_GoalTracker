# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

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

# Stage 2: Run the Next.js application with Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy application code and dependencies from the builder stage
COPY --from=builder /app /app

# Expose port for the app
EXPOSE 3000

# Run the Next.js application
CMD ["npm", "start"]
