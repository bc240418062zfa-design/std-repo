# Production Multi-Stage Dockerfile for MIHORA STUDY LIBRARY
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# Build static client assets & verify security
FROM deps AS builder
COPY . .
RUN npm run build
RUN npm run validate
RUN npm run test

# Production Runner
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
