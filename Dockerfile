# Multi-stage build for production UI (served with Nginx)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the static distribution assets
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine AS runner

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy default nginx configuration if custom routing is needed (optional fallback to SPA routing)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
