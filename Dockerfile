# Multi-stage Dockerfile for Sanad (Frontend + Backend)

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./

# Install dependencies
RUN npm ci --only=production=false

# Copy frontend source
COPY src ./src
COPY public ./public

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY server/package*.json ./
COPY server/tsconfig.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy backend source
COPY server/src ./src

# Build backend
RUN npm run build

# Stage 3: Production
FROM node:18-alpine

WORKDIR /app

# Install production dependencies for backend
COPY server/package*.json ./
RUN npm ci --only=production

# Copy built backend
COPY --from=backend-builder /app/dist ./dist

# Copy built frontend
COPY --from=frontend-builder /app/dist ./public

# Copy nginx config (if using nginx)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "dist/index.js"]
