# Multi-stage Docker build for production optimization
# Business Intelligence Dashboard - Enterprise Deployment

# Stage 1: Dependencies installation
FROM node:18-alpine AS dependencies
WORKDIR /app

# Add security updates
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies with production optimizations
RUN yarn --frozen-lockfile --production=false

# Stage 2: Build application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN yarn build

# Stage 3: Production runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Add security and performance packages
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy public assets
COPY --from=builder /app/public ./public

# Set correct permissions for nextjs user
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check for monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]

# Labels for metadata
LABEL maintainer="Business Intelligence Dashboard Team"
LABEL version="1.0.0"
LABEL description="Enterprise Business Intelligence Dashboard"
LABEL org.opencontainers.image.source="https://github.com/erkin98/dashboard" 