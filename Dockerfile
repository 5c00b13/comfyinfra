# Build stage
FROM node:20-slim as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code (excluding worker)
COPY . .
RUN rm -rf src/worker

# Build the frontend application
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built frontend
COPY --from=build /app/dist ./dist

EXPOSE 3030

CMD ["serve", "-s", "dist", "-l", "3030"]